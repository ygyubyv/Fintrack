import { AppError } from "../../errors/AppError";
import { MapPrismaError } from "../../errors/mapper/prisma-error.mapper";
import { prisma } from "../../lib/prisma";
import {
  ICreateTagPayload,
  IUpdateTagPayload,
  TGetAllTagsFilters,
  IGetTagByIdFilters,
} from "./types/tag.types";

export const TagService = () => {
  const findById = async (userId: number, filters: IGetTagByIdFilters) => {
    return await prisma.tag.findFirst({
      where: {
        userId,
        id: filters.id,
      },
    });
  };

  const findAll = async (userId: number, filters: TGetAllTagsFilters) => {
    const skip = (filters.page - 1) * filters.perPage;
    const take = filters.perPage;

    const total = await prisma.tag.count({
      where: {
        userId,
        ...(filters?.title && {
          title: { contains: filters.title, mode: "insensitive" },
        }),
      },
    });

    const data = await prisma.tag.findMany({
      where: {
        userId,
        ...(filters?.title && {
          title: { contains: filters.title, mode: "insensitive" },
        }),
      },
      skip,
      take,
      orderBy: {
        ...(filters?.orderByCreatedAt &&
          filters?.orderByCreatedAtDirection && {
            createdAt: filters.orderByCreatedAtDirection,
          }),
      },
    });

    const perPage = filters.perPage;
    const currentPage = filters.page;
    const lastPage = Math.ceil(total / perPage);

    return {
      data,
      meta: {
        currentPage,
        lastPage,
        perPage,
        total,
      },
    };
  };

  const create = async (userId: number, payload: ICreateTagPayload) => {
    try {
      return await prisma.tag.create({
        data: {
          ...payload,
          userId,
        },
      });
    } catch (error) {
      const dbError = MapPrismaError(error);

      if (dbError === "DB_UNIQUE_CONSTRAINT") {
        throw new AppError("TAG_EXISTS");
      }

      throw error;
    }
  };

  const update = async (
    userId: number,
    id: number,
    payload: IUpdateTagPayload,
  ) => {
    try {
      return await prisma.tag.update({
        where: {
          id,
          userId,
        },
        data: payload,
      });
    } catch (error) {
      const dbError = MapPrismaError(error);

      if (dbError === "DB_RECORD_NOT_FOUND") {
        throw new AppError("TAG_NOT_FOUND");
      }

      throw error;
    }
  };

  const remove = async (userId: number, id: number) => {
    try {
      return await prisma.tag.delete({
        where: {
          id,
          userId,
        },
      });
    } catch (error) {
      const dbError = MapPrismaError(error);

      if (dbError === "DB_RECORD_NOT_FOUND") {
        throw new AppError("TAG_NOT_FOUND");
      }

      throw error;
    }
  };

  return {
    findById,
    findAll,
    create,
    update,
    remove,
  };
};
