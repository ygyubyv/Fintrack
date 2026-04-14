import type { IPaginationPayload, TOrderBy } from "../../../types/v1";

export interface ICreateExpensePayload {
  value: number;
  description?: string;
  expenseType: TExpenseType;
  paymentType: TPaymentType;
  categoryId: number | null;
  tagIds?: number[];
  createdAt?: string;
}

export interface IUpdateExpensePayload {
  value?: number;
  description?: string;
  expenseType?: TExpenseType;
  paymentType?: TPaymentType;
  categoryId?: number | null;
  tagIds?: number[];
  createdAt?: string;
}

export interface IImportExpensePayload {
  id: string;
  value: string;
  description?: string;
  expenseType: TExpenseType;
  paymentType: TPaymentType;
  categoryId: string | null;
  tagIds?: string;
  createdAt: string;
  updatedAt: string;
}

export type TExpenseOrderByFields =
  | "CreatedAt"
  | "Value"
  | "ExpenseType"
  | "PaymentType";

export type TGetAllExpensesFilters = Partial<IPaginationPayload> &
  TOrderBy<TExpenseOrderByFields> & {
    description?: string;
    valueFrom?: number;
    valueTo?: number;
    expenseType?: TExpenseType;
    paymentType?: TPaymentType;
    categoryId?: number;
    tagIds?: number[];
    createdFromDate?: string;
    createdToDate?: string;
  };

export type TExportAllExpensesFilters = TOrderBy<TExpenseOrderByFields> & {
  description?: string;
  valueFrom?: number;
  valueTo?: number;
  expenseType?: TExpenseType;
  paymentType?: TPaymentType;
  categoryId?: number;
  tagIds?: number[];
  createdFromDate?: string;
  createdToDate?: string;
};

export interface IGetExpenseByIdFilters {
  id: number;
}

export const ExpenseType = {
  INCOME: "INCOME",
  EXPENSE: "EXPENSE",
} as const;

export type TExpenseType = keyof typeof ExpenseType;

export const PaymentType = {
  CARD: "CARD",
  CASH: "CASH",
} as const;

export type TPaymentType = keyof typeof PaymentType;
