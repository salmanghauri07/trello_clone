import { INVALID } from "zod/v3";

const messages = {
  // errors
  VALIDATION_ERROR: "validation failed",
  USER_EXIST_ERROR: "user already exists",
  COMPANY_NOT_FOUND_ERROR:
    "Company not found. Please contact admin to register your company.",
  EMAIL_FAILED: "Email sending failed",
  SIGNUP_ERROR: "signup failed",
  LOGIN_ERROR: "login failed",
  OTP_VERIFICATION_FAILED: "failed to verify OTP",
  INVALID_OTP: "Invalid OTP",
  OTP_EXPIRED: "OTP expired!",
  LOGIN_INVALID_CREDENTIALS: "Invalid credentials",
  USER_NOT_VERIFIED: "User is not verified",
  TOKEN_GENERATION_FAILED: "Token generation failed: ",
  JWT_COOKIE_NOT_FOUND: "Jwt cookie not found",
  JWT_ERROR: "jwt error",
  REFRESH_TOKEN_NOT_VALID: "refresh token not valid",

  // general
  VERIFICATION_EMAIL_SUBJECT: "Verification through OTP",

  //   success
  SIGNUP_SUCCESS: "OTP sent!",
  OTP_VERIFIED: "OTP is verified",
  LOGIN_SUCCESS: "Login Successful",
  ACCESS_TOKEN_GENERATED: "New access token generated",
};

export default messages;
