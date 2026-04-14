import { prisma } from "../../lib/prisma";
import type { ICreateRefreshToken } from "./types/refresh-token.types";

export const RefreshTokenService = () => {
  const create = async (payload: ICreateRefreshToken) => {
    return prisma.refreshToken.create({
      data: payload,
    });
  };

  const revoke = async (tokenHash: string) => {
    return prisma.refreshToken.updateMany({
      where: { tokenHash },
      data: {
        revokedAt: new Date(),
      },
    });
  };

  return { create, revoke };
};
