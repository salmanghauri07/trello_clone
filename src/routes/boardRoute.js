import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import validateSchema from "../middlewares/validateSchema.js";
import { createBoardSchema } from "../validations/boardSchema.js";
import boardController from "../controllers/boardController.js";
const router = express.Router();

router.use(authMiddleware);

router.post(
  "/createBoard",
  validateSchema(createBoardSchema),
  boardController.createBoard
);

router.get("/getAllBoardsOfUser", boardController.getAllBoardsOfUser);

router.get("/getBoard/:id", boardController.getBoardById);

router.delete("/deleteBoard/:boardId", boardController.deleteBoard);

router.post("/addMember/:boardId", boardController.addMember);

router.delete("/removeMember/:boardId/:userId", boardController.removeMember);

export default router;
