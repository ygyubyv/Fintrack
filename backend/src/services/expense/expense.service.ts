import { AppError } from "../../errors/AppError";
import { MapPrismaError } from "../../errors/mapper/prisma-error.mapper";
import { prisma } from "../../lib/prisma";
import {
  ICreateExpensePayload,
  IGetExpenseByIdFilters,
  IUpdateExpensePayload,
  TGetAllExpensesFilters,
} from "./types/expense.types";

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

  const findAll = async (userId: number, filters: TGetAllExpensesFilters) => {
    const skip = (filters.page - 1) * filters.perPage;
    const take = filters.perPage;

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
      skip,
      take,
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

  return {
    findById,
    findAll,
    create,
    update,
    remove,
  };
};
