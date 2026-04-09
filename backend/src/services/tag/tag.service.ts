import { AppError } from "../../errors/AppError";
import { MapPrismaError } from "../../errors/mapper/prisma-error.mapper";
import { prisma } from "../../lib/prisma";
import {
  ICreateTagPayload,
  IUpdateTagPayload,
  TGetAllTagsFilters,
  IGetTagByIdFilters,
  IImportTagPayload,
} from "./types/tag.types";
import Papa from "papaparse";

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
        ...(filters.tagIds?.length && {
          id: { in: filters.tagIds },
        }),
      },
    });

    const data = await prisma.tag.findMany({
      where: {
        userId,
        ...(filters?.title && {
          title: { contains: filters.title, mode: "insensitive" },
        }),
        ...(filters.tagIds?.length && {
          id: { in: filters.tagIds },
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

  const exportAll = async (userId: number, filters?: TGetAllTagsFilters) => {
    const tags = await prisma.tag.findMany({
      where: {
        userId,
        ...(filters?.title && {
          title: { contains: filters.title, mode: "insensitive" },
        }),
        ...(filters?.tagIds?.length && {
          id: { in: filters.tagIds },
        }),
      },
      orderBy: {
        ...(filters?.orderByCreatedAt &&
          filters?.orderByCreatedAtDirection && {
            createdAt: filters.orderByCreatedAtDirection,
          }),
      },
    });

    const data = tags.map((tag) => {
      return {
        id: tag.id,
        title: tag.title,
        color: tag.color,
        createdAt: tag.createdAt,
        updatedAt: tag.updatedAt,
      };
    });

    return Papa.unparse(data, {
      delimiter: ";",
      columns: ["id", "title", "color", "createdAt", "updatedAt"],
      header: true,
    });
  };

  const importAll = async (userId: number, file: Express.Multer.File) => {
    const csvString = file.buffer.toString("utf-8");

    const { data: payload } = Papa.parse<IImportTagPayload>(csvString, {
      header: true,
      skipEmptyLines: true,
      delimiter: ";",
    });

    await prisma.$transaction(async (transaction) => {
      await transaction.tag.deleteMany({
        where: {
          userId,
        },
      });

      if (!payload.length) {
        return;
      }

      await transaction.tag.createMany({
        data: payload.map((tag) => {
          return {
            userId,
            id: Number(tag.id),
            color: tag.color,
            title: tag.title,
            createdAt: tag.createdAt,
            updatedAt: tag.updatedAt,
          };
        }),
      });
    });
  };

  return {
    findById,
    findAll,
    create,
    update,
    remove,
    exportAll,
    importAll,
  };
};
