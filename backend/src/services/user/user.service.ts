import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import type { ICreateUser, IUpdateUser } from "./types/user.types";
import { AppError } from "../../errors/AppError";
import { MapPrismaError } from "../../errors/mapper/prisma-error.mapper";

export const UserService = () => {
  const findById = async (id: number) => {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        lastLogin: true,
      },
    });

    return user;
  };

  const findByEmail = async (email: string) => {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  };

  const create = async (payload: ICreateUser) => {
    try {
      const hashedPassword =
        payload.password && (await bcrypt.hash(payload.password, 8));

      return await prisma.user.create({
        data: {
          ...payload,
          password: hashedPassword,
        },
      });
    } catch (error) {
      const dbError = MapPrismaError(error);

      if (dbError === "DB_UNIQUE_CONSTRAINT") {
        throw new AppError("USER_EMAIL_EXISTS");
      }

      throw error;
    }
  };

  const update = async (id: number, payload: IUpdateUser) => {
    try {
      if (payload.password) {
        payload.password = await bcrypt.hash(payload.password, 8);
      }

      const user = await prisma.user.update({
        data: payload,
        where: {
          id,
        },
        include: {
          lastLogin: true,
        },
      });

      return user;
    } catch (error) {
      const dbError = MapPrismaError(error);

      if (dbError === "DB_RECORD_NOT_FOUND") {
        throw new AppError("USER_NOT_FOUND");
      }

      throw error;
    }
  };

  const remove = async (id: number) => {
    try {
      const user = await prisma.user.delete({
        where: {
          id,
        },
      });

      return user;
    } catch (error) {
      const dbError = MapPrismaError(error);

      if (dbError === "DB_RECORD_NOT_FOUND") {
        throw new AppError("USER_NOT_FOUND");
      }

      throw error;
    }
  };

  return {
    findById,
    findByEmail,
    create,
    update,
    remove,
  };
};
