import { z } from "zod";
import type {
  ISignupPayload,
  ILoginPayload,
  IRefreshTokensPayload,
  ILogoutPayload,
} from "../../../types/v1/auth";

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
