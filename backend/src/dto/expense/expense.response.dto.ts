import { Prisma } from "../../lib/prisma";
import { toCategoryResponse } from "../category/category.response.dto";
import { toTagResponse } from "../tag/tag.response.dto";
import { TExpenseResponseDto } from "./types/expense.types";

type Expense = Prisma.ExpenseGetPayload<{
  include: { category: true; tags: true };
}>;

export const toExpenseResponse = (expense: Expense): TExpenseResponseDto => ({
  id: expense.id,
  value: expense.value.toString(),
  description: expense.description ?? undefined,
  expenseType: expense.expenseType,
  paymentType: expense.paymentType,
  category: expense.category ? toCategoryResponse(expense.category) : null,
  tags: expense.tags?.map((tag) => toTagResponse(tag)),
  createdAt: expense.createdAt,
  updatedAt: expense.updatedAt,
});
