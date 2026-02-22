import { prisma } from "../../lib/prisma";
import { ICreateEmailVerificationToken } from "./types/email-verification-token.types";

export const EmailVerificationTokenService = () => {
  const findByVerificationToken = async (tokenHash: string) => {
    const token = await prisma.emailVerificationToken.findUnique({
      where: {
        tokenHash,
      },
      include: {
        user: true,
      },
    });

    return token;
  };

  const create = async (payload: ICreateEmailVerificationToken) => {
    return prisma.emailVerificationToken.create({
      data: payload,
    });
  };

  const consume = async (tokenHash: string) => {
    return prisma.emailVerificationToken.update({
      where: { tokenHash },
      data: {
        usedAt: new Date(),
      },
    });
  };

  return { findByVerificationToken, create, consume };
};
