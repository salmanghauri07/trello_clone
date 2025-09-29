import jwt from "jsonwebtoken";
import messages from "../config/messages.js";
import { ApiError } from "../utils/apiError.js";
import baseRepository from "../utils/baseRepository.js";
import User from "../models/user.js";

export default class userServices extends baseRepository {
  constructor(model) {
    super(model);
  }

  // custom service method to generate a jwt token
  static createToken(data, key, expiry) {
    try {
      return jwt.sign(data, key, { expiresIn: expiry });
    } catch (err) {
      throw new ApiError(messages.TOKEN_GENERATION_FAILED + err.message, 500);
    }
  }
}
