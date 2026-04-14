import type { ExpenseType, PaymentType } from "../../../generated/prisma/enums";
import type { TCategoryResponseDto } from "../../category/types/category.types";
import type { TTagResponseDto } from "../../tag/types/tag.types";

export type TExpenseResponseDto = {
  id: number;
  value: string;
  description?: string;
  expenseType: ExpenseType;
  paymentType: PaymentType;
  category?: TCategoryResponseDto | null;
  tags?: TTagResponseDto[];
  createdAt: Date;
  updatedAt: Date;
};
