import express from "express";
import { AuthController } from "../../controllers/v1/auth.controller";
import { ValidateMiddleware } from "../../middlewares/validate.middleware";
import {
  LoginSchema,
  SignupSchema,
  LogoutSchema,
  RefreshSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  VerifyEmailSchema,
  GoogleSchema,
} from "../../validation/schemas/v1/auth.schema";

const router = express.Router();
const {
  login,
  signup,
  logout,
  refresh,
  forgotPassword,
  resetPassword,
  verifyEmail,
  google,
} = AuthController();

router.post("/login", ValidateMiddleware(LoginSchema), login);
router.post("/signup", ValidateMiddleware(SignupSchema), signup);
router.post("/logout", ValidateMiddleware(LogoutSchema), logout);
router.post("/refresh", ValidateMiddleware(RefreshSchema), refresh);
router.post(
  "/forgot-password",
  ValidateMiddleware(ForgotPasswordSchema),
  forgotPassword,
);
router.post(
  "/reset-password",
  ValidateMiddleware(ResetPasswordSchema),
  resetPassword,
);
router.post(
  "/verify-email",
  ValidateMiddleware(VerifyEmailSchema),
  verifyEmail,
);
router.post("/google", ValidateMiddleware(GoogleSchema), google);

export default router;
