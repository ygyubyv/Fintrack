import { z } from "zod";
import type {
  ISignupPayload,
  ILoginPayload,
  IRefreshTokensPayload,
  ILogoutPayload,
  IResetPasswordPayload,
  IForgotPasswordPayload,
  IVerifyEmailPayload,
  IGooglePayload,
} from "../../../services/auth/types/auth.types";

export const SignupSchema: z.ZodType<ISignupPayload> = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

export const LoginSchema: z.ZodType<ILoginPayload> = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const LogoutSchema: z.ZodType<ILogoutPayload> = z.object({
  refreshToken: z.string(),
});

export const RefreshSchema: z.ZodType<IRefreshTokensPayload> = z.object({
  refreshToken: z.string(),
});

export const ForgotPasswordSchema: z.ZodType<IForgotPasswordPayload> = z.object(
  {
    email: z.string().email(),
  },
);

export const ResetPasswordSchema: z.ZodType<IResetPasswordPayload> = z.object({
  token: z.string(),
  password: z.string().min(6),
});

export const VerifyEmailSchema: z.ZodType<IVerifyEmailPayload> = z.object({
  code: z
    .number()
    .min(100000)
    .max(1000000 - 1),
});

export const GoogleSchema: z.ZodType<IGooglePayload> = z.object({
  idToken: z.string(),
});
