import { AppError } from "../../errors/AppError";
import { MapPrismaError } from "../../errors/mapper/prisma-error.mapper";
import { Prisma, prisma } from "../../lib/prisma";
import type {
  ICreateExpensePayload,
  IGetExpenseByIdFilters,
  IImportExpensePayload,
  IUpdateExpensePayload,
  TGetAllExpensesFilters,
} from "./types/expense.types";
import Papa from "papaparse";

export const ExpenseService = () => {
  const findById = async (userId: number, filters: IGetExpenseByIdFilters) => {
    return await prisma.expense.findFirst({
      where: {
        id: filters.id,
        userId,
      },
      include: {
        tags: true,
        category: true,
      },
    });
  };

  const findAll = async (userId: number, filters?: TGetAllExpensesFilters) => {
    const total = await prisma.expense.count({
      where: {
        userId,
        ...(filters?.description && {
          description: { contains: filters.description, mode: "insensitive" },
        }),
        ...(filters?.valueFrom || filters?.valueTo
          ? {
              value: {
                ...(filters.valueFrom && { gte: filters.valueFrom }),
                ...(filters.valueTo && { lte: filters.valueTo }),
              },
            }
          : {}),
        ...(filters?.expenseType && { expenseType: filters.expenseType }),
        ...(filters?.paymentType && { paymentType: filters.paymentType }),
        ...(filters?.categoryId && { categoryId: filters.categoryId }),
        ...(filters?.tagIds && {
          tags: { some: { id: { in: filters.tagIds } } },
        }),
        ...(filters?.createdFromDate || filters?.createdToDate
          ? {
              createdAt: {
                ...(filters.createdFromDate && {
                  gte: filters.createdFromDate,
                }),
                ...(filters.createdToDate && { lte: filters.createdToDate }),
              },
            }
          : {}),
      },
    });

    const data = await prisma.expense.findMany({
      where: {
        userId,
        ...(filters?.description && {
          description: { contains: filters.description, mode: "insensitive" },
        }),
        ...(filters?.valueFrom || filters?.valueTo
          ? {
              value: {
                ...(filters.valueFrom && { gte: filters.valueFrom }),
                ...(filters.valueTo && { lte: filters.valueTo }),
              },
            }
          : {}),
        ...(filters?.expenseType && { expenseType: filters.expenseType }),
        ...(filters?.paymentType && { paymentType: filters.paymentType }),
        ...(filters?.categoryId && { categoryId: filters.categoryId }),
        ...(filters?.tagIds && {
          tags: { some: { id: { in: filters.tagIds } } },
        }),
        ...(filters?.createdFromDate || filters?.createdToDate
          ? {
              createdAt: {
                ...(filters.createdFromDate && {
                  gte: filters.createdFromDate,
                }),
                ...(filters.createdToDate && { lte: filters.createdToDate }),
              },
            }
          : {}),
      },
      include: {
        tags: true,
        category: true,
      },
      skip:
        filters?.page && filters?.perPage
          ? (filters.page - 1) * filters.perPage
          : undefined,
      take: filters?.perPage ? filters.perPage : undefined,
      orderBy: {
        ...(filters?.orderByValue &&
          filters?.orderByValueDirection && {
            value: filters.orderByValueDirection,
          }),
        ...(filters?.orderByExpenseType &&
          filters?.orderByExpenseTypeDirection && {
            expenseType: filters.orderByExpenseTypeDirection,
          }),
        ...(filters?.orderByPaymentType &&
          filters?.orderByPaymentTypeDirection && {
            paymentType: filters.orderByPaymentTypeDirection,
          }),
        ...(filters?.orderByCreatedAt &&
          filters?.orderByCreatedAtDirection && {
            createdAt: filters.orderByCreatedAtDirection,
          }),
      },
    });

    const perPage = filters?.perPage;
    const currentPage = filters?.page;
    const lastPage = filters?.perPage ? Math.ceil(total / filters.perPage) : 1;

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

  const create = async (userId: number, payload: ICreateExpensePayload) => {
    try {
      const { value, expenseType, paymentType, categoryId, description } =
        payload;

      return await prisma.expense.create({
        data: {
          value,
          expenseType,
          description,
          categoryId,
          paymentType,
          userId,
          createdAt: payload.createdAt,
          tags: payload.tagIds?.length
            ? { connect: payload.tagIds.map((id) => ({ id })) }
            : undefined,
        },
        include: {
          tags: true,
          category: true,
        },
      });
    } catch (error) {
      const dbError = MapPrismaError(error);

      if (dbError === "DB_FOREIGN_KEY") {
        throw new AppError("INVALID_CATEGORY_OR_TAG");
      }

      throw error;
    }
  };

  const update = async (
    userId: number,
    id: number,
    payload: IUpdateExpensePayload,
  ) => {
    try {
      const { value, expenseType, paymentType, categoryId, description } =
        payload;

      return await prisma.expense.update({
        where: {
          id,
          userId,
        },
        data: {
          value,
          expenseType,
          description,
          categoryId,
          paymentType,
          createdAt: payload.createdAt,
          tags:
            payload.tagIds !== undefined
              ? {
                  set: payload.tagIds.map((id) => ({ id })),
                }
              : undefined,
        },
        include: {
          tags: true,
          category: true,
        },
      });
    } catch (error) {
      const dbError = MapPrismaError(error);

      if (dbError === "DB_RECORD_NOT_FOUND") {
        throw new AppError("EXPENSE_NOT_FOUND");
      }

      if (dbError === "DB_FOREIGN_KEY") {
        throw new AppError("INVALID_CATEGORY_OR_TAG");
      }

      throw error;
    }
  };

  const remove = async (userId: number, id: number) => {
    try {
      return await prisma.expense.delete({
        where: {
          id,
          userId,
        },
      });
    } catch (error) {
      const dbError = MapPrismaError(error);

      if (dbError === "DB_RECORD_NOT_FOUND") {
        throw new AppError("EXPENSE_NOT_FOUND");
      }

      throw error;
    }
  };

  const exportAll = async (
    userId: number,
    filters?: TGetAllExpensesFilters,
  ) => {
    const expenses = await prisma.expense.findMany({
      where: {
        userId,
        ...(filters?.description && {
          description: { contains: filters.description, mode: "insensitive" },
        }),
        ...(filters?.valueFrom || filters?.valueTo
          ? {
              value: {
                ...(filters.valueFrom && { gte: filters.valueFrom }),
                ...(filters.valueTo && { lte: filters.valueTo }),
              },
            }
          : {}),
        ...(filters?.expenseType && { expenseType: filters.expenseType }),
        ...(filters?.paymentType && { paymentType: filters.paymentType }),
        ...(filters?.categoryId && { categoryId: filters.categoryId }),
        ...(filters?.tagIds && {
          tags: { some: { id: { in: filters.tagIds } } },
        }),
        ...(filters?.createdFromDate || filters?.createdToDate
          ? {
              createdAt: {
                ...(filters.createdFromDate && {
                  gte: filters.createdFromDate,
                }),
                ...(filters.createdToDate && { lte: filters.createdToDate }),
              },
            }
          : {}),
      },

      orderBy: {
        ...(filters?.orderByValue &&
          filters?.orderByValueDirection && {
            value: filters.orderByValueDirection,
          }),
        ...(filters?.orderByExpenseType &&
          filters?.orderByExpenseTypeDirection && {
            expenseType: filters.orderByExpenseTypeDirection,
          }),
        ...(filters?.orderByPaymentType &&
          filters?.orderByPaymentTypeDirection && {
            paymentType: filters.orderByPaymentTypeDirection,
          }),
        ...(filters?.orderByCreatedAt &&
          filters?.orderByCreatedAtDirection && {
            createdAt: filters.orderByCreatedAtDirection,
          }),
      },

      include: {
        tags: true,
      },
    });

    const data = expenses.map((expense) => {
      return {
        id: expense.id,
        value: expense.value,
        description: expense.description,
        expenseType: expense.expenseType,
        paymentType: expense.paymentType,
        categoryId: expense.categoryId,
        tagIds: expense.tags
          .map((tag) => {
            return tag.id;
          })
          .join(","),
        createdAt: expense.createdAt,
        updatedAt: expense.updatedAt,
      };
    });

    return Papa.unparse(data, {
      delimiter: ";",
      columns: [
        "id",
        "value",
        "description",
        "expenseType",
        "paymentType",
        "categoryId",
        "tagIds",
        "createdAt",
        "updatedAt",
      ],
      header: true,
    });
  };

  const importAll = async (userId: number, file: Express.Multer.File) => {
    const csvString = file.buffer.toString("utf-8");

    const { data: payload } = Papa.parse<IImportExpensePayload>(csvString, {
      header: true,
      skipEmptyLines: true,
      delimiter: ";",
    });

    await prisma.$transaction(async (transaction) => {
      await transaction.expense.deleteMany({
        where: {
          userId,
        },
      });

      if (!payload.length) {
        return;
      }

      await transaction.expense.createMany({
        data: payload.map((expense) => {
          return {
            userId,
            id: Number(expense.id),
            value: Number(expense.value),
            description: expense.description,
            expenseType: expense.expenseType,
            paymentType: expense.paymentType,
            categoryId: expense.categoryId ? Number(expense.categoryId) : null,
            createdAt: expense.createdAt,
            updatedAt: expense.updatedAt,
          };
        }),
      });

      const tagsToExpenses = payload.flatMap((expense) => {
        const tagIds = expense.tagIds
          ?.split(",")
          .map((id) => id.trim())
          .filter((id) => id !== "");

        if (!tagIds || !tagIds?.length) {
          return [];
        }

        return tagIds.map((tagId) => {
          return Prisma.sql`(${expense.id}, ${tagId})`;
        });
      });

      if (!tagsToExpenses.length) {
        return;
      }

      await transaction.$executeRaw`
        INSERT INTO "_ExpenseToTag" ("A", "B")
        VALUES ${Prisma.join(tagsToExpenses)}
      `;
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
