import { LastLogin } from "../../generated/prisma/client";
import { TLastLoginResponseDto } from "./types/last-login.types";

export const toLastLoginResponse = (
  login: LastLogin,
): TLastLoginResponseDto => ({
  id: login.id,
  userAgent: login.userAgent ?? undefined,
  ipAddress: login.ipAddress ?? undefined,
  lastLoginAt: login.lastLoginAt,
});
