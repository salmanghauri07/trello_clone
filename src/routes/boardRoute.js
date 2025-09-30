import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import validateSchema from "../middlewares/validateSchema.js";
import { createBoardSchema } from "../validations/boardSchema.js";
import boardController from "../controllers/boardController.js";
const router = express.Router();

router.post(
  "/createBoard",
  authMiddleware,
  validateSchema(createBoardSchema),
  boardController.createBoard
);

export default router;
