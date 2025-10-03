import jwt from "jsonwebtoken";
import messages from "../config/messages.js";
import Company from "../models/Company.js";
import ApiResponse from "../utils/apiResponse.js";
import generateOTP from "../utils/generateOTP.js";
import { sendEmail } from "../utils/sendMail.js";
import { ApiError } from "../utils/apiError.js";
import userServices from "../services/userServices.js";
import config from "../config/settings.js";
import User from "../models/User.js";
import { verificationTemplate } from "../utils/emailTemplates/verificationTemplate.js";
import Board from "../models/Board.js";

const userDb = new userServices(User);
const companyDb = new userServices(Company);
const boardDb = new userServices(Board);

export default class userController {
  static async signup(req, res) {
    try {
      const { username, email, password, company } = req.body;

      const existingUser = await userDb.findOne(
        { email },
        { _id: 1, isVerified: 1, username: 1, email: 1, company: 1 }
      );

      // ✅ Check if user already exists and is verified
      if (existingUser && existingUser.isVerified) {
        throw new ApiError(messages.USER_EXIST_ERROR, 400);
      }

      // ✅ Check if company exists
      const existingCompany = await companyDb.findOne({ name: company });
      if (!existingCompany) {
        throw new ApiError(messages.COMPANY_NOT_FOUND_ERROR, 400);
      }
      const companyId = existingCompany._id;

      // ✅ Generate avatar URL using UI Avatars
      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
        username
      )}&background=random&color=fff&size=128`;

      let OTP = null;
      let user = existingUser;

      if (existingUser && !existingUser.isVerified) {
        // User exists but not verified → regenerate OTP
        OTP = generateOTP();

        await userDb.updateById(
          existingUser._id,
          {
            $set: {
              username,
              password,
              OTP,
              otpExpiresAt: new Date(Date.now() + 5 * 60 * 1000),
              avatar: avatarUrl,
            },
          },
          { runValidators: true }
        );

        // Send OTP
        await sendEmail(
          email,
          messages.VERIFICATION_EMAIL_SUBJECT,
          verificationTemplate({ username, OTP })
        );
      } else {
        // New user
        OTP = generateOTP();

        user = await userDb.create({
          username,
          email,
          password,
          company: companyId,
          OTP,
          otpExpiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 mins
          avatar: avatarUrl,
        });

        await sendEmail(
          email,
          messages.VERIFICATION_EMAIL_SUBJECT,
          verificationTemplate({ username, OTP })
        );
      }

      // ✅ Generate short-lived JWT for OTP verification
      const otpToken = jwt.sign(
        { userId: user._id, email: user.email, purpose: "otp" },
        config.SIGNUP_TOKEN_SECRET,
        { expiresIn: "10m" } // expires in 10 minutes
      );

      return ApiResponse.success(res, messages.SIGNUP_SUCCESS, { otpToken });
    } catch (err) {
      return ApiResponse.error(
        res,
        err.message || messages.SIGNUP_ERROR,
        err.statusCode || 500
      );
    }
  }

  static async verifyOtp(req, res) {
    console.log("Verify OTP request body:", req.body);
    try {
      console.log("Verify OTP request body:", req.body);
      const { otp } = req.body;

      const user = await userDb.findOne({ OTP: otp });
      if (!user) {
        throw new ApiError(messages.INVALID_OTP, 400);
      }

      // check otp expiry
      if (user.otpExpiresAt < new Date()) {
        throw new ApiError(messages.OTP_EXPIRED, 400);
      }

      // update fields
      await userDb.updateById(user._id, {
        $set: { otpExpiresAt: null, OTP: null, isVerified: true },
      });

      return ApiResponse.success(res, messages.OTP_VERIFIED, {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          company: user.company,
          isVerified: true,
        },
      });
    } catch (err) {
      console.log("Verify OTP request body:", req.body);
      return ApiResponse.error(
        res,
        err.message || messages.OTP_VERIFICATION_FAILED,
        err.statusCode || 500
      );
    }
  }

  static async resendOtp(req, res) {
    try {
      const { token } = req.params;
      console.log(token, "token in resend otp");

      // 🔐 Verify token

      const decoded = jwt.verify(token, config.SIGNUP_TOKEN_SECRET);

      if (!decoded) {
        throw new ApiError(messages.INVALID_OR_EXPIRED_OTP_TOKEN, 400);
      }

      const { userId, email } = decoded;

      // 🔍 Find user
      const user = await userDb.findById(userId);
      if (!user) {
        throw new ApiError(messages.USER_NOT_FOUND, 404);
      }

      if (user.isVerified) {
        throw new ApiError(messages.USER_ALREADY_VERIFIED, 400);
      }

      // 🔄 Generate new OTP
      const newOtp = generateOTP();

      await userDb.updateById(user._id, {
        $set: {
          OTP: newOtp,
          otpExpiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 min
        },
      });

      // 📧 Send new OTP email
      await sendEmail(
        user.email,
        messages.VERIFICATION_EMAIL_SUBJECT,
        verificationTemplate({ username: user.username, OTP: newOtp })
      );

      // ✅ Optionally issue a new fresh token (refresh expiry)
      const otpToken = jwt.sign(
        { userId: user._id, email: user.email, purpose: "otp" },
        config.SIGNUP_TOKEN_SECRET,
        { expiresIn: "10m" }
      );

      return ApiResponse.success(res, messages.OTP_RESENT_SUCCESSFULLY, {
        otpToken,
      });
    } catch (err) {
      return ApiResponse.error(
        res,
        err.message || messages.FAILED_TO_RESEND_OTP,
        err.statusCode || 500
      );
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // find user
      const user = await userDb.findOne({ email });
      if (!user) {
        throw new ApiError(messages.LOGIN_INVALID_CREDENTIALS, 400);
      }

      // 2. Compare password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        throw new ApiError(messages.LOGIN_INVALID_CREDENTIALS, 400);
      }

      if (!user.isVerified) {
        throw new ApiError(messages.USER_NOT_VERIFIED, 400);
      }

      // 3. Create tokens
      const accessToken = userServices.createToken(
        { id: user._id, email: user.email },
        config.ACCESS_TOKEN_SECRET,
        "15m"
      );

      const refreshToken = userServices.createToken(
        { id: user._id, email: user.email },
        config.REFRESH_TOKEN_SECRET,
        "7d"
      );

      // save refresh token in db
      await userDb.updateById(user._id, {
        $set: { refreshToken: refreshToken },
      });

      // send the cookie
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "lax", // allow cross-site
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      const boards = await boardDb.find(
        {
          $or: [{ owner: user.id }, { "members.user": user.id }],
        },
        {},
        {},
        ["owner", "company", "members.user"]
      );

      return ApiResponse.success(res, messages.LOGIN_SUCCESS, {
        accessToken: accessToken,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          company: user.company,
          avatar: user.avatar,
        },
      });
    } catch (err) {
      return ApiResponse.error(
        res,
        err.message || messages.LOGIN_ERROR,
        err.statusCode || 500
      );
    }
  }

  static async refresh(req, res) {
    try {
      // 1. Get refresh token from cookies
      const token = req.cookies?.jwt;
      if (!token) {
        return ApiResponse.error(res, messages.JWT_COOKIE_NOT_FOUND, 401);
      }
      // 2. Verify refresh token
      let decoded;
      try {
        decoded = jwt.verify(token, config.REFRESH_TOKEN_SECRET);
      } catch (err) {
        return ApiResponse.error(res, messages.JWT_ERROR, 401);
      }
      // 3. Check user & stored refresh token
      const user = await userDb.findById(decoded.id);
      if (!user) {
        return ApiResponse.error(res, messages.REFRESH_TOKEN_NOT_VALID, 403);
      }
      // 4. Issue new access token
      const newAccessToken = userServices.createToken(
        { id: user._id, email: user.email },
        config.ACCESS_TOKEN_SECRET,
        "15m"
      );
      return ApiResponse.success(res, messages.ACCESS_TOKEN_GENERATED, {
        accessToken: newAccessToken,
      });
    } catch (err) {
      return ApiResponse.error(
        res,
        err.message || messages.TOKEN_GENERATION_FAILED,
        err.statusCode || 500
      );
    }
  }
}
