import jwt from "jsonwebtoken";
import messages from "../config/messages.js";
import { ApiError } from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import config from "../config/settings.js";

export function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(messages.NO_ACCESS_TOKEN, 401);
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, config.ACCESS_TOKEN_SECRET);
    if (!decoded) {
      throw new ApiError(messages.USER_NOT_EXIST, 404);
    }

    req.user = decoded;
    next();
  } catch (err) {
    return ApiResponse.error(res, messages.ACCESS_TOKEN_EXPIRED, 401);
  }
}
