import { INVALID } from "zod/v3";

const messages = {
  // errors
  INVALID_OR_EXPIRED_OTP_TOKEN: "Invalid or expired OTP token",
  USER_NOT_FOUND: "User not found",
  USER_ALREADY_VERIFIED: "User already verified",
  OTP_RESENT_SUCCESSFULLY: "OTP resent successfully",
  FAILED_TO_RESEND_OTP: "Failed to resend OTP",
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
  ACCESS_TOKEN_EXPIRED: "Token has expired, Please log in again",
  NO_ACCESS_TOKEN: "No access token provided",
  USER_NOT_EXIST: "User doesn't exist",
  BOARD_CREATION_FAILED: "Board creation failed",
  GET_ALL_BOARDS_FAILED: "Failed to fetch all the boards for the user",
  GET_BOARD_FAILED: "Failed to fetch the baord",
  BOARD_NOT_EXIST: "The board of this id doesn't exist",
  DELETE_BOARD_FAILED: "Failed to delete the board",
  USER_NOT_OWNER_ERROR: "The user is not owner",
  USER_ALREADY_MEMBER: "User is already member",
  CANNOT_ADD_OWNER_AS_MEMBER: "Can't add owner as member",
  MEMBER_NOT_EXIST: "Member doesn't exist",

  // general
  VERIFICATION_EMAIL_SUBJECT: "Verification through OTP",

  //   success
  SIGNUP_SUCCESS: "OTP sent!",
  OTP_VERIFIED: "OTP is verified",
  LOGIN_SUCCESS: "Login Successful",
  ACCESS_TOKEN_GENERATED: "New access token generated",
  BOARD_CREATED_SUCCESSFULLY: "Board has been created successfully",
  GET_ALL_BOARDS_SUCCESS: "All boards for the user are fetched successfully",
  GET_BOARD_SUCCESS: "Board has been fetched successfully",
  DELETE_BOARD_SUCCESS: "Board has been deleted successfully",
  MEMBER_REMOVE_SUCCESS: "Member is removed successfully",
  MEMBER_ADD_SUCCESS: "Member is added successfully",
  OTP_RESENT_SUCCESSFULLY: "OTP resent successfully",
};

export default messages;
