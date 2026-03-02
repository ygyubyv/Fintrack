import { PaginationMetaSchema } from "./pagination.schemas";
import { TagSchema } from "./tag.schemas";
import { CategorySchema } from "./category.schemas";

export const ExpenseTypeSchema = {
  type: "string",
  enum: ["INCOME", "EXPENSE"],
  example: "EXPENSE",
};

export const PaymentTypeSchema = {
  type: "string",
  enum: ["CARD", "CASH"],
  example: "CARD",
};

export const ExpenseValueSchema = {
  type: "string",
  description: "Expense value as decimal string (e.g. '123.45')",
  example: "1250.00",
};

export const ExpenseSchema = {
  type: "object",
  required: [
    "id",
    "value",
    "expenseType",
    "paymentType",
    "tags",
    "createdAt",
    "updatedAt",
  ],
  properties: {
    id: { type: "integer", minimum: 1, example: 1 },
    value: ExpenseValueSchema,

    description: {
      type: "string",
      minLength: 1,
      maxLength: 255,
      example: "Coffee",
    },

    expenseType: ExpenseTypeSchema,
    paymentType: PaymentTypeSchema,

    category: { ...CategorySchema, nullable: true },

    tags: { type: "array", items: TagSchema, example: [] },

    createdAt: {
      type: "string",
      format: "date-time",
      example: "2026-02-27T10:00:00.000Z",
    },
    updatedAt: {
      type: "string",
      format: "date-time",
      example: "2026-02-27T10:00:00.000Z",
    },
  },
};

export const ExpenseDetailsSchema = ExpenseSchema;

export const ExpenseListResponseSchema = {
  type: "object",
  required: ["data", "meta"],
  properties: {
    data: { type: "array", items: ExpenseSchema },
    meta: PaginationMetaSchema,
  },
};

export const CreateExpenseRequestSchema = {
  type: "object",
  required: ["value", "expenseType", "paymentType"],
  properties: {
    value: { type: "number", minimum: 1, example: 1250 },
    description: {
      type: "string",
      minLength: 1,
      maxLength: 255,
      example: "Coffee",
    },
    expenseType: ExpenseTypeSchema,
    paymentType: PaymentTypeSchema,
    categoryId: { type: "integer", minimum: 1, example: 3 },
    tagIds: {
      type: "array",
      items: { type: "integer", minimum: 1 },
      example: [1, 2],
    },
  },
};

export const UpdateExpenseRequestSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number", minimum: 1, example: 990 },
    description: {
      type: "string",
      minLength: 1,
      maxLength: 255,
      example: "Lunch",
    },
    expenseType: ExpenseTypeSchema,
    paymentType: PaymentTypeSchema,
    categoryId: { type: "integer", minimum: 1, example: 2 },
    tagIds: {
      type: "array",
      items: { type: "integer", minimum: 1 },
      example: [2, 3],
    },
  },
};
