import { ExpenseType, PaymentType } from "../../../generated/prisma/enums";
import { TCategoryResponseDto } from "../../category/types/category.types";
import { TTagResponseDto } from "../../tag/types/tag.types";

export type TExpenseResponseDto = {
  id: number;
  value: string;
  description?: string;
  expenseType: ExpenseType;
  paymentType: PaymentType;
  category?: TCategoryResponseDto;
  tags?: TTagResponseDto[];
  createdAt: Date;
  updatedAt: Date;
};
