import express from "express";
import { AuthController } from "../../controllers/v1/auth.controller";
import { ValidateMiddleware } from "../../middlewares/validate.middleware";
import {
  LoginSchema,
  SignupSchema,
  LogoutSchema,
  RefreshSchema,
} from "../../validation/schemas/v1/auth.schema";

const router = express.Router();
const { login, signup, logout, refresh } = AuthController();

router.post("/login", ValidateMiddleware(LoginSchema), login);
router.post("/signup", ValidateMiddleware(SignupSchema), signup);
router.post("/logout", ValidateMiddleware(LogoutSchema), logout);
router.post("/refresh", ValidateMiddleware(RefreshSchema), refresh);

export default router;
