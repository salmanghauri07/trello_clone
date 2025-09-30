import express from "express";
import validateSchema from "../middlewares/validateSchema.js";
import schema from "../validations/authSchema.js";
import userController from "../controllers/userController.js";
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
export default router;
