import type { Prisma } from "../../lib/prisma";
import { toLastLoginResponse } from "../last-login/last-login.response.dto";
import type { TUserResponseDto } from "./types/user.types";

type User = Prisma.UserGetPayload<{
  include: {
    lastLogin: true;
  };
}>;

export const toUserResponse = (user: User): TUserResponseDto => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  emailVerified: user.emailVerified,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
  lastLogin: user.lastLogin ? toLastLoginResponse(user.lastLogin) : null,
});
