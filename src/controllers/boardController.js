import messages from "../config/messages.js";
import Board from "../models/Board.js";
import User from "../models/user.js";
import boardServices from "../services/boardServices.js";
import ApiResponse from "../utils/apiResponse.js";

const boardDb = new boardServices(Board);
const userDb = new boardServices(User);

export default class boardController {
  static async createBoard(req, res) {
    try {
      const { title, description } = req.body;
      const user = req.user;
      const newUser = await userDb.findOne({ email: user.email });

      await boardDb.create({
        title,
        description,
        owner: newUser._id,
        company: newUser.company,
      });

      return ApiResponse.success(res, messages.BOARD_CREATED_SUCCESSFULLY, 200);
    } catch (err) {
      return ApiResponse.error(
        res,
        err.message || messages.BOARD_CREATION_FAILED,
        err.statusCode || 500
      );
    }
  }
}
