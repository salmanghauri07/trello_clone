import express from "express";
import validateSchema from "../middlewares/validateSchema.js";
import schema from "../validations/authSchema.js";
import userController from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/signup",
  validateSchema(schema.signupSchema),
  userController.signup
);
router.post(
  "/verifyOTP",
  validateSchema(schema.otpSchema),
  userController.verifyOtp
);
router.post("/login", validateSchema(schema.loginSchema), userController.login);
router.get("/refresh", userController.refresh);

router.get("/resendOTP/:token", userController.resendOtp);
router.get("/logout", authMiddleware, userController.logout);
export default router;
