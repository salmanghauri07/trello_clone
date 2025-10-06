import messages from "../config/messages.js";
import Board from "../models/Board.js";
import List from "../models/List.js";
import listServices from "../services/listServices.js";
import { ApiError } from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";

const listDb = new listServices(List);
const boardDb = new listServices(Board);

export default class listController {
  static async addList(req, res) {
    try {
      const { title, pos } = req.body;
      const boardId = req.params.boardId;
      await listDb.create({
        title,
        board: boardId,
        pos,
      });
      return ApiResponse.success(res, messages.LIST_ADD_SUCCESS, {}, 200);
    } catch (err) {
      return ApiResponse.error(
        res,
        err.message || messages.ADD_LIST_FAILED,
        err.statusCode || 500
      );
    }
  }
  static async deleteList(req, res) {
    try {
      const listId = req.params.listId;
      const list = await listDb.findById(listId);
      if (!list) throw new ApiError(messages.LIST_NOT_FOUND, 404);
      await listDb.deleteById(listId);
      return ApiResponse.success(res, messages.LIST_DELETED_SUCCESS, {}, 200);
    } catch (err) {
      return ApiResponse.error(
        res,
        err.message || messages.DELETE_LIST_FAILED,
        err.statusCode || 500
      );
    }
  }
}
