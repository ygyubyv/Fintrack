import type { ICategory } from "@/views/categories/types";
import type { ITag } from "@/views/tags/types";

export interface IExpense {
  id: number;
  value: string;
  description?: string;
  expenseType: TExpenseType;
  paymentType: TPaymentType;
  category: ICategory | null;
  tags: ITag[];
  createdAt: string;
  updatedAt: string;
}

export interface ICreateExpense {
  value: number;
  description?: string;
  expenseType: TExpenseType;
  paymentType: TPaymentType;
  categoryId: number | null;
  tagIds: number[];
  createdAt?: string;
}

export interface IUpdateExpense {
  value: number;
  description?: string;
  expenseType: TExpenseType;
  paymentType: TPaymentType;
  categoryId: number | null;
  tagIds: number[];
  createdAt?: string;
}

export interface IImportExpenses {
  file: File;
}

export type TExpenseType = "INCOME" | "EXPENSE";
export type TPaymentType = "CARD" | "CASH";
