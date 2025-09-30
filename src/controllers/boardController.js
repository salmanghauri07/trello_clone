import messages from "../config/messages.js";
import Board from "../models/Board.js";
import User from "../models/user.js";
import boardServices from "../services/boardServices.js";
import ApiResponse from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";

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

  static async getAllBoardsOfUser(req, res) {
    try {
      const user = req.user;

      // get all the boards of which user is either owner or member
      const boards = await boardDb.find(
        {
          $or: [{ owner: user.id }, { "members.user": user.id }],
        },
        {},
        {},
        ["owner", "company", "members.user"]
      );

      return ApiResponse.success(
        res,
        messages.GET_ALL_BOARDS_SUCCESS,
        {
          boards,
        },
        200
      );
    } catch (err) {
      return ApiResponse.error(
        res,
        err.message || messages.GET_ALL_BOARDS_FAILED,
        err.statusCode || 500
      );
    }
  }

  static async getBoardById(req, res) {
    try {
      const id = req.params.id;
      const user = req.user;

      const board = await boardDb.findByIdWithAccess(id, user.id, {}, {}, [
        "owner",
        "company",
        "members.user",
      ]);
      if (!board) {
        throw new ApiError(messages.BOARD_NOT_EXIST, 400);
      }

      return ApiResponse.success(
        res,
        messages.GET_BOARD_SUCCESS,
        { board },
        200
      );
    } catch (err) {
      return ApiResponse.error(
        res,
        err.message || messages.GET_BOARD_FAILED,
        err.statusCode || 500
      );
    }
  }

  static async deleteBoard(req, res) {
    try {
      const id = req.params.id;
      const user = req.user;

      const board = await boardDb.findByIdWithAccess(
        id,
        user.id,
        "owner",
        {},
        {},
        ["owner", "company", "members.user"]
      );

      if (!board) {
        throw new ApiError(messages.BOARD_NOT_EXIST, 200);
      }

      await boardDb.deleteById(board._id);

      return ApiResponse.success(res, messages.DELETE_BOARD_SUCCESS, 200);
    } catch (err) {
      return ApiResponse.error(
        res,
        err.message || messages.DELETE_BOARD_FAILED,
        err.statusCode || 500
      );
    }
  }
}
