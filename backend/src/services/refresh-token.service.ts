import { prisma } from "../lib/prisma";
import { ICreateRefreshToken } from "../types/v1";

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
