import express from "express";
const router = express.Router();
import { authMiddleware } from "../middlewares/authMiddleware.js";
import listController from "../controllers/listController.js";

router.use(authMiddleware);
router.post("/addList/:boardId", listController.addList);
router.get("/deleteList/:listId", listController.deleteList);

export default router;
