import { AppError } from "../../errors/AppError";
import { MapPrismaError } from "../../errors/mapper/prisma-error.mapper";
import { prisma } from "../../lib/prisma";
import type {
  TGetAllCategoriesFilters,
  IGetCategoryByIdFilters,
  ICreateCategoryPayload,
  IUpdateCategoryPayload,
  IImportCategoryPayload,
} from "./types/category.types";
import Papa from "papaparse";

export const CategoryService = () => {
  const findById = async (userId: number, filters: IGetCategoryByIdFilters) => {
    return await prisma.category.findFirst({
      where: {
        userId,
        id: filters.id,
      },
    });
  };

  const findAll = async (userId: number, filters: TGetAllCategoriesFilters) => {
    const skip = (filters.page - 1) * filters.perPage;
    const take = filters.perPage;

    const total = await prisma.category.count({
      where: {
        userId,
        ...(filters?.title && {
          title: { contains: filters.title, mode: "insensitive" },
        }),
        ...(filters.categoryIds?.length && {
          id: { in: filters.categoryIds },
        }),
      },
    });

    const data = await prisma.category.findMany({
      where: {
        userId,
        ...(filters?.title && {
          title: { contains: filters.title, mode: "insensitive" },
        }),
        ...(filters.categoryIds?.length && {
          id: { in: filters.categoryIds },
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

  const create = async (userId: number, payload: ICreateCategoryPayload) => {
    try {
      return await prisma.category.create({
        data: {
          ...payload,
          userId,
        },
      });
    } catch (error) {
      const dbError = MapPrismaError(error);

      if (dbError === "DB_UNIQUE_CONSTRAINT") {
        throw new AppError("CATEGORY_EXISTS");
      }

      throw error;
    }
  };

  const update = async (
    userId: number,
    id: number,
    payload: IUpdateCategoryPayload,
  ) => {
    try {
      return await prisma.category.update({
        where: {
          id,
          userId,
        },
        data: payload,
      });
    } catch (error) {
      const dbError = MapPrismaError(error);

      if (dbError === "DB_RECORD_NOT_FOUND") {
        throw new AppError("CATEGORY_NOT_FOUND");
      }

      throw error;
    }
  };

  const remove = async (userId: number, id: number) => {
    try {
      return await prisma.category.delete({
        where: {
          id,
          userId,
        },
      });
    } catch (error) {
      const dbError = MapPrismaError(error);

      if (dbError === "DB_RECORD_NOT_FOUND") {
        throw new AppError("CATEGORY_NOT_FOUND");
      }

      throw error;
    }
  };

  const exportAll = async (
    userId: number,
    filters?: TGetAllCategoriesFilters,
  ) => {
    const categories = await prisma.category.findMany({
      where: {
        userId,
        ...(filters?.title && {
          title: { contains: filters.title, mode: "insensitive" },
        }),
        ...(filters?.categoryIds?.length && {
          id: { in: filters.categoryIds },
        }),
      },
      orderBy: {
        ...(filters?.orderByCreatedAt &&
          filters?.orderByCreatedAtDirection && {
            createdAt: filters.orderByCreatedAtDirection,
          }),
      },
    });

    const data = categories.map((category) => {
      return {
        id: category.id,
        title: category.title,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      };
    });

    return Papa.unparse(data, {
      delimiter: ";",
      columns: ["id", "title", "createdAt", "updatedAt"],
      header: true,
    });
  };

  const importAll = async (userId: number, file: Express.Multer.File) => {
    const csvString = file.buffer.toString("utf-8");

    const { data: payload } = Papa.parse<IImportCategoryPayload>(csvString, {
      header: true,
      skipEmptyLines: true,
      delimiter: ";",
    });

    await prisma.$transaction(async (transaction) => {
      await transaction.category.deleteMany({
        where: {
          userId,
        },
      });

      if (!payload.length) {
        return;
      }

      await transaction.category.createMany({
        data: payload.map((category) => {
          return {
            userId,
            id: Number(category.id),
            title: category.title,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt,
          };
        }),
      });
    });
  };

  return {
    findAll,
    findById,
    create,
    update,
    remove,
    exportAll,
    importAll,
  };
};
