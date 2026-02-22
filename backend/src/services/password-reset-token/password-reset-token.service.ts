import { prisma } from "../../lib/prisma";
import { ICreatePasswordResetToken } from "./types/password-reset-token.types";

export const PasswordResetTokenService = () => {
  const findByResetToken = async (tokenHash: string) => {
    const token = await prisma.passwordResetToken.findUnique({
      where: {
        tokenHash,
      },
      include: {
        user: true,
      },
    });

    return token;
  };

  const create = async (payload: ICreatePasswordResetToken) => {
    return prisma.passwordResetToken.create({
      data: payload,
    });
  };

  const consume = async (tokenHash: string) => {
    return prisma.passwordResetToken.update({
      where: { tokenHash },
      data: {
        usedAt: new Date(),
      },
    });
  };

  return { findByResetToken, create, consume };
};
