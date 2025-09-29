import express from "express";
import authValidation from "../middlewares/authValidation.js";
import schema from "../validations/authSchema.js";
import userController from "../controllers/userController.js";
const router = express.Router();

router.post(
  "/signup",
  authValidation(schema.signupSchema),
  userController.signup
);
router.post(
  "/verifyOTP",
  authValidation(schema.otpSchema),
  userController.verifyOtp
);
router.post("/login", authValidation(schema.loginSchema), userController.login);
router.get("/refresh", userController.refresh);
export default router;
