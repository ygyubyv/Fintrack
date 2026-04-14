import { prisma } from "../../lib/prisma";
import type { ICreateLastLogin } from "./types/last-login.types";

export const LastLoginService = () => {
  const upsert = async (payload: ICreateLastLogin) => {
    return prisma.lastLogin.upsert({
      where: { userId: payload.userId },
      update: {
        userAgent: payload.userAgent,
        ipAddress: payload.ipAddress,
      },
      create: {
        userId: payload.userId,
        userAgent: payload.userAgent,
        ipAddress: payload.ipAddress,
      },
    });
  };

  return { upsert };
};
