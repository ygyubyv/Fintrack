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

router.post("/login", ValidateMiddleware({ body: LoginSchema }), login);
router.post("/signup", ValidateMiddleware({ body: SignupSchema }), signup);
router.post("/logout", ValidateMiddleware({ body: LogoutSchema }), logout);
router.post("/refresh", ValidateMiddleware({ body: RefreshSchema }), refresh);
router.post(
  "/forgot-password",
  ValidateMiddleware({ body: ForgotPasswordSchema }),
  forgotPassword,
);
router.post(
  "/reset-password",
  ValidateMiddleware({ body: ResetPasswordSchema }),
  resetPassword,
);
router.post(
  "/verify-email",
  ValidateMiddleware({ body: VerifyEmailSchema }),
  verifyEmail,
);
router.post("/google", ValidateMiddleware({ body: GoogleSchema }), google);

export default router;
