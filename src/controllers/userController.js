import jwt from "jsonwebtoken";
import messages from "../config/messages.js";
import Company from "../models/Company.js";
import ApiResponse from "../utils/apiResponse.js";
import generateOTP from "../utils/generateOTP.js";
import { sendEmail } from "../utils/sendMail.js";
import { ApiError } from "../utils/apiError.js";
import userServices from "../services/userServices.js";
import config from "../config/environment_variables.js";
import User from "../models/user.js";
import { verificationTemplate } from "../utils/emailTemplates/verificationTemplate.js";

const userDb = new userServices(User);
const companyDb = new userServices(Company);

export default class userController {
  static async signup(req, res) {
    try {
      const { name, email, password, company } = req.body;

      const existingUser = await userDb.findOne(
        { email: email },
        { _id: 1, isVerified: 1, name: 1, email: 1, company: 1 }
      );
      // Check if user already exists and is verified
      if (existingUser && existingUser.isVerified) {
        throw new ApiError(messages.USER_EXIST_ERROR, 400);
      }

      let OTP = null;
      // Check if user already exists and is not verified
      if (existingUser && !existingUser.isVerified) {
        OTP = generateOTP();
        // store the new otp in db
        await userDb.updateById(
          existingUser._id,
          {
            $set: {
              OTP: OTP,
              otpExpiresAt: new Date(Date.now() + 5 * 60 * 1000),
            },
          },
          { runValidators: true }
        );

        // Send OTP through email
        await sendEmail(
          email,
          messages.VERIFICATION_EMAIL_SUBJECT,
          verificationTemplate({ name, OTP })
        );

        return ApiResponse.success(res, messages.SIGNUP_SUCCESS, {
          user: {
            id: existingUser._id,
            name: existingUser.name,
            email: existingUser.email,
            company: existingUser.company,
            isVerified: existingUser.isVerified,
          },
        });
      }
      // Check if company exists
      const existingCompany = await companyDb.findOne({ name: company });
      if (!existingCompany) {
        throw new ApiError(messages.COMPANY_NOT_FOUND_ERROR, 400);
      }
      const companyId = existingCompany._id;

      OTP = generateOTP();

      const newUser = await userDb.create({
        name,
        email,
        password,
        company: companyId,
        OTP,
        otpExpiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 mins
      });

      await sendEmail(email, messages.VERIFICATION_EMAIL_SUBJECT, OTP, name);

      return ApiResponse.success(res, messages.SIGNUP_SUCCESS, {
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          company: newUser.company,
          isVerified: newUser.isVerified,
        },
      });
    } catch (err) {
      return ApiResponse.error(
        res,
        err.message || messages.SIGNUP_ERROR,
        err.statusCode || 500
      );
    }
  }

  static async verifyOtp(req, res) {
    try {
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
          name: user.name,
          email: user.email,
          company: user.company,
          isVerified: true,
        },
      });
    } catch (err) {
      return ApiResponse.error(
        res,
        err.message || messages.OTP_VERIFICATION_FAILED,
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
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return ApiResponse.success(res, messages.LOGIN_SUCCESS, {
        accessToken: accessToken,
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

      // verfiy token
      jwt.verify(token, config.REFRESH_TOKEN_SECRET, async (err, decoded) => {
        if (err) {
          throw new ApiError(messages.JWT_ERROR, 403);
        }

        const user = await userDb.findById(decoded.id);
        if (!user || user.refreshToken[0] !== token) {
          throw new ApiError(res, messages.REFRESH_TOKEN_NOT_VALID, 403);
        }

        const newAccessToken = userServices.createToken(
          { id: user._id, email: user.email },
          config.ACCESS_TOKEN_SECRET,
          "15m"
        );

        return ApiResponse.success(res, messages.ACCESS_TOKEN_GENERATED, {
          accessToken: newAccessToken,
        });
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
