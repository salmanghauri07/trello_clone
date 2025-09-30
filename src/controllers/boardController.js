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
      const id = req.params.boardId;
      const user = req.user;

      // to return the board and also check if the user is owner
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

      return ApiResponse.success(res, messages.DELETE_BOARD_SUCCESS, null, 200);
    } catch (err) {
      return ApiResponse.error(
        res,
        err.message || messages.DELETE_BOARD_FAILED,
        err.statusCode || 500
      );
    }
  }

  static async addMember(req, res) {
    try {
      const id = req.params.boardId;
      const user = req.user;
      const { email, role } = req.body;

      // Check for existing user
      const existingUser = await userDb.findOne({ email });
      if (!existingUser) {
        throw new ApiError(messages.USER_NOT_EXIST, 400);
      }

      // Find board with access
      const board = await boardDb.findByIdWithAccess(id, user.id, "owner");
      if (!board) {
        throw new ApiError(messages.BOARD_NOT_EXIST, 404);
      }

      //  Prevent adding owner as member
      if (board.owner.equals(existingUser._id)) {
        throw new ApiError(messages.CANNOT_ADD_OWNER_AS_MEMBER, 400);
      }

      // Prevent duplicates

      if (board.members.some((m) => m.user.equals(existingUser._id))) {
        throw new ApiError(messages.USER_ALREADY_MEMBER, 400);
      }

      await boardDb.updateById(board._id, {
        $push: { members: { user: existingUser._id, role } },
      });

      return ApiResponse.success(res, messages.MEMBER_ADD_SUCCESS, null, 200);
    } catch (err) {
      return ApiResponse.error(res, err.message, err.statusCode || 500);
    }
  }

  static async removeMember(req, res) {
    try {
      const userId = req.params.userId;
      const boardId = req.params.boardId;
      const user = req.user;

      // Find board with access
      const board = await boardDb.findByIdWithAccess(boardId, user.id, "owner");
      if (!board) throw new ApiError(messages.BOARD_NOT_EXIST, 404);

      // check if member exists
      const memberExists = board.members.some((m) => m.user.equals(userId));
      if (!memberExists) throw new ApiError(messages.MEMBER_NOT_EXIST, 404);

      await boardDb.updateById(board._id, {
        $pull: { members: { user: userId } },
      });

      return ApiResponse.success(
        res,
        messages.MEMBER_REMOVE_SUCCESS,
        null,
        200
      );
    } catch (err) {
      return ApiResponse.error(res, err.message, err.statusCode || 500);
    }
  }

  static async updateRole(req, res) {
    try {
      const { boardId, userId } = req.params; // board + member whose role will change
      const currentUser = req.user;
      const { role } = req.body; // new role

      // Find board with access
      const board = await boardDb.findByIdWithAccess(boardId, currentUser.id);
      if (!board) throw new ApiError(messages.BOARD_NOT_EXIST, 404);

      const isMember = board.members.some((m) => m.user.equals(userId));
      if (!isMember) throw new ApiError(messages.MEMBER_NOT_EXIST, 404);

      await boardDb.updateOne(
        { _id: board._id, "members.user": userId },
        { $set: { "members.$.role": role } }
      );
      return ApiResponse.success(res, messages.ROLE_UPDATE_SUCCESS, null, 200);
    } catch (err) {
      return ApiResponse.error(res, err.message, err.statusCode || 500);
    }
  }
}
