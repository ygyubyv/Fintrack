import { ExpenseService } from "../../services/expense/expense.service";
import type { Request, Response, NextFunction } from "express";
import type {
  TExpenseType,
  TPaymentType,
} from "../../services/expense/types/expense.types";
import type { TSortDirection } from "../../types/v1";
import { AppError } from "../../errors/AppError";
import { toExpenseResponse } from "../../dto/expense/expense.response.dto";
import { toArray } from "../../utils";

export const ExpenseController = () => {
  const getById = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const { user } = request;
      const { id } = request.params;

      const expense = await ExpenseService().findById(user!.id, {
        id: Number(id),
      });

      if (!expense) {
        throw new AppError("EXPENSE_NOT_FOUND");
      }

      const formattedExpense = toExpenseResponse(expense);

      return response.status(200).json(formattedExpense);
    } catch (error) {
      next(error);
    }
  };

  const getAll = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const { user } = request;
      const {
        page,
        perPage,
        description,
        valueFrom,
        valueTo,
        expenseType,
        paymentType,
        categoryId,
        createdFromDate,
        createdToDate,
        orderByCreatedAt,
        orderByCreatedAtDirection,
        orderByValue,
        orderByValueDirection,
        orderByExpenseType,
        orderByExpenseTypeDirection,
        orderByPaymentType,
        orderByPaymentTypeDirection,
      } = request.query;

      const tagIds = toArray(request.query["tagIds[]"])?.map((tagId) =>
        Number(tagId),
      );

      const expenses = await ExpenseService().findAll(user!.id, {
        page: Number(page),
        perPage: Number(perPage),
        description: description as string,
        valueFrom: Number(valueFrom),
        valueTo: Number(valueTo),
        expenseType: expenseType as TExpenseType,
        paymentType: paymentType as TPaymentType,
        categoryId: Number(categoryId),
        tagIds,
        createdFromDate: createdFromDate as string,
        createdToDate: createdToDate as string,
        orderByCreatedAt: !!orderByCreatedAt,
        orderByCreatedAtDirection: orderByCreatedAtDirection as TSortDirection,
        orderByValue: !!orderByValue,
        orderByValueDirection: orderByValueDirection as TSortDirection,
        orderByExpenseType: !!orderByExpenseType,
        orderByExpenseTypeDirection:
          orderByExpenseTypeDirection as TSortDirection,
        orderByPaymentType: !!orderByPaymentType,
        orderByPaymentTypeDirection:
          orderByPaymentTypeDirection as TSortDirection,
      });

      const formattedExpenses = {
        data: expenses.data.map((expense) => {
          return toExpenseResponse(expense);
        }),
        meta: expenses.meta,
      };

      return response.status(200).json(formattedExpenses);
    } catch (error) {
      next(error);
    }
  };

  const create = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const { user } = request;
      const {
        value,
        expenseType,
        paymentType,
        description,
        categoryId,
        tagIds,
        createdAt,
      } = request.body;

      const expense = await ExpenseService().create(user!.id, {
        value: Number(value),
        expenseType,
        paymentType,
        description,
        categoryId,
        tagIds,
        createdAt,
      });

      const formattedExpense = toExpenseResponse(expense);

      return response.status(201).json(formattedExpense);
    } catch (error) {
      next(error);
    }
  };

  const update = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const { user } = request;
      const { id } = request.params;
      const {
        value,
        expenseType,
        paymentType,
        description,
        categoryId,
        tagIds,
        createdAt,
      } = request.body;

      const expense = await ExpenseService().update(user!.id, Number(id), {
        value: value ? Number(value) : undefined,
        expenseType,
        paymentType,
        description,
        categoryId,
        tagIds,
        createdAt,
      });

      const formattedExpense = toExpenseResponse(expense);

      return response.status(200).json(formattedExpense);
    } catch (error) {
      next(error);
    }
  };

  const remove = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const { user } = request;
      const { id } = request.params;

      await ExpenseService().remove(user!.id, Number(id));

      return response.sendStatus(204);
    } catch (error) {
      next(error);
    }
  };

  const exportAll = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const { user } = request;
      const {
        description,
        valueFrom,
        valueTo,
        expenseType,
        paymentType,
        categoryId,
        createdFromDate,
        createdToDate,
        orderByCreatedAt,
        orderByCreatedAtDirection,
        orderByValue,
        orderByValueDirection,
        orderByExpenseType,
        orderByExpenseTypeDirection,
        orderByPaymentType,
        orderByPaymentTypeDirection,
      } = request.query;

      const tagIds = toArray(request.query["tagIds[]"])?.map((tagId) =>
        Number(tagId),
      );

      const csv = await ExpenseService().exportAll(user!.id, {
        description: description as string,
        valueFrom: Number(valueFrom),
        valueTo: Number(valueTo),
        expenseType: expenseType as TExpenseType,
        paymentType: paymentType as TPaymentType,
        categoryId: Number(categoryId),
        tagIds,
        createdFromDate: createdFromDate as string,
        createdToDate: createdToDate as string,
        orderByCreatedAt: !!orderByCreatedAt,
        orderByCreatedAtDirection: orderByCreatedAtDirection as TSortDirection,
        orderByValue: !!orderByValue,
        orderByValueDirection: orderByValueDirection as TSortDirection,
        orderByExpenseType: !!orderByExpenseType,
        orderByExpenseTypeDirection:
          orderByExpenseTypeDirection as TSortDirection,
        orderByPaymentType: !!orderByPaymentType,
        orderByPaymentTypeDirection:
          orderByPaymentTypeDirection as TSortDirection,
      });

      response.header("Content-Type", "text/csv");
      response.attachment("Expenses");

      return response.status(200).send(csv);
    } catch (error) {
      next(error);
    }
  };

  const importAll = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const { user } = request;
      const { file } = request;

      await ExpenseService().importAll(user!.id, file!);

      return response.sendStatus(200);
    } catch (error) {
      next(error);
    }
  };

  return {
    create,
    update,
    remove,
    getById,
    getAll,
    exportAll,
    importAll,
  };
};
