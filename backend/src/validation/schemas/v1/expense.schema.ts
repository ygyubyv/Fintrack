import { z } from "zod";
import type {
  ICreateExpensePayload,
  TGetAllExpensesFilters,
  IGetExpenseByIdFilters,
  IUpdateExpensePayload,
  TExpenseType,
  TPaymentType,
} from "../../../services/expense/types/expense.types";
import { TSortDirection } from "../../../types/v1";

export const SortDirectionSchema = z.custom<TSortDirection>(
  (val) => val === "asc" || val === "desc",
);

const ExpenseTypeSchema = z.custom<TExpenseType>(
  (val) => val === "INCOME" || val === "EXPENSE",
);

const PaymentTypeSchema = z.custom<TPaymentType>(
  (val) => val === "CARD" || val === "CASH",
);

const dateNotLaterThanNow = z.string().refine(
  (val) => {
    const date = new Date(val);
    return date <= new Date();
  },
  {
    message: "Date can not be grater than now",
  },
);

export const GetAllSchema: z.ZodType<TGetAllExpensesFilters> = z.object({
  page: z.coerce.number().int().min(1).optional(),
  perPage: z.coerce.number().int().min(1).max(100).optional(),
  description: z.string().min(1).max(255).optional(),
  valueFrom: z.coerce.number().optional(),
  valueTo: z.coerce.number().optional(),
  expenseType: ExpenseTypeSchema.optional(),
  paymentType: PaymentTypeSchema.optional(),
  categoryId: z.coerce.number().optional(),
  tagIds: z.array(z.coerce.number()).optional(),
  createdFromDate: z.iso.datetime().optional(),
  createdToDate: z.iso.datetime().optional(),

  orderByCreatedAt: z.coerce.boolean().optional(),
  orderByCreatedAtDirection: SortDirectionSchema.optional(),

  orderByValue: z.coerce.boolean().optional(),
  orderByValueDirection: SortDirectionSchema.optional(),

  orderByExpenseType: z.coerce.boolean().optional(),
  orderByExpenseTypeDirection: SortDirectionSchema.optional(),

  orderByPaymentType: z.coerce.boolean().optional(),
  orderByPaymentTypeDirection: SortDirectionSchema.optional(),
});

export const GetByIdSchema: z.ZodType<IGetExpenseByIdFilters> = z.object({
  id: z.coerce.number().int().min(1).default(1),
});

export const CreateSchema: z.ZodType<ICreateExpensePayload> = z.object({
  value: z.number().min(1),
  description: z.string().min(1).max(255).optional(),
  expenseType: ExpenseTypeSchema,
  paymentType: PaymentTypeSchema,
  categoryId: z.number().int().min(1).nullable(),
  tagIds: z.array(z.number().int().min(1)),
  createdAt: dateNotLaterThanNow.optional(),
});

export const UpdateSchema: z.ZodType<IUpdateExpensePayload> = z.object({
  value: z.number().min(1).optional(),
  description: z.string().min(1).max(255).optional(),
  expenseType: ExpenseTypeSchema.optional(),
  paymentType: PaymentTypeSchema.optional(),
  categoryId: z.number().int().min(1).optional().nullable(),
  tagIds: z.array(z.number().int().min(1)).optional(),
  createdAt: dateNotLaterThanNow.optional(),
});
