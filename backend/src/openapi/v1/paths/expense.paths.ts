import {
  ExpenseSchema,
  ExpenseDetailsSchema,
  ExpenseListResponseSchema,
  CreateExpenseRequestSchema,
  UpdateExpenseRequestSchema,
} from "../schemas/expense.schemas";
import { ErrorResponseSchema } from "../schemas/error-response.schema";

export const expensePaths = {
  "/api/v1/expenses": {
    get: {
      summary: "Get expenses list",
      tags: ["Expenses"],
      security: [{ bearerAuth: [] }],

      parameters: [
        {
          name: "page",
          in: "query",
          required: true,
          schema: { type: "integer", minimum: 1 },
          example: 1,
        },
        {
          name: "perPage",
          in: "query",
          required: true,
          schema: { type: "integer", minimum: 1, maximum: 100 },
          example: 10,
        },
        {
          name: "description",
          in: "query",
          required: false,
          schema: { type: "string", minLength: 1, maxLength: 255 },
          example: "coffee",
        },
        {
          name: "valueFrom",
          in: "query",
          required: false,
          schema: { type: "number" },
          example: 10,
        },
        {
          name: "valueTo",
          in: "query",
          required: false,
          schema: { type: "number" },
          example: 500,
        },

        {
          name: "expenseType",
          in: "query",
          required: false,
          schema: { type: "string", enum: ["INCOME", "EXPENSE"] },
          example: "EXPENSE",
        },
        {
          name: "paymentType",
          in: "query",
          required: false,
          schema: { type: "string", enum: ["CARD", "CASH"] },
          example: "CARD",
        },

        {
          name: "categoryId",
          in: "query",
          required: false,
          schema: { type: "integer", minimum: 1 },
          example: 3,
        },

        {
          name: "tagIds",
          in: "query",
          required: false,
          style: "form",
          explode: true,
          schema: { type: "array", items: { type: "integer", minimum: 1 } },
          example: [1, 2],
        },

        {
          name: "createdFromDate",
          in: "query",
          required: false,
          schema: { type: "string", format: "date-time" },
          example: "2026-02-01T00:00:00.000Z",
        },
        {
          name: "createdToDate",
          in: "query",
          required: false,
          schema: { type: "string", format: "date-time" },
          example: "2026-02-27T23:59:59.999Z",
        },

        {
          name: "orderByCreatedAt",
          in: "query",
          required: false,
          schema: { type: "boolean" },
          example: true,
        },
        {
          name: "orderByCreatedAtDirection",
          in: "query",
          required: false,
          schema: { type: "string", enum: ["asc", "desc"] },
          example: "desc",
        },

        {
          name: "orderByValue",
          in: "query",
          required: false,
          schema: { type: "boolean" },
          example: true,
        },
        {
          name: "orderByValueDirection",
          in: "query",
          required: false,
          schema: { type: "string", enum: ["asc", "desc"] },
          example: "desc",
        },

        {
          name: "orderByExpenseType",
          in: "query",
          required: false,
          schema: { type: "boolean" },
          example: false,
        },
        {
          name: "orderByExpenseTypeDirection",
          in: "query",
          required: false,
          schema: { type: "string", enum: ["asc", "desc"] },
          example: "asc",
        },

        {
          name: "orderByPaymentType",
          in: "query",
          required: false,
          schema: { type: "boolean" },
          example: false,
        },
        {
          name: "orderByPaymentTypeDirection",
          in: "query",
          required: false,
          schema: { type: "string", enum: ["asc", "desc"] },
          example: "asc",
        },
      ],

      responses: {
        200: {
          description: "Expenses list",
          content: {
            "application/json": { schema: ExpenseListResponseSchema },
          },
        },

        401: {
          description: "Unauthorized",
          content: { "application/json": { schema: ErrorResponseSchema } },
        },

        422: {
          description: "Validation error",
          content: { "application/json": { schema: ErrorResponseSchema } },
        },

        500: {
          description: "Internal server error",
          content: { "application/json": { schema: ErrorResponseSchema } },
        },
      },
    },

    post: {
      summary: "Create expense",
      tags: ["Expenses"],
      security: [{ bearerAuth: [] }],

      requestBody: {
        required: true,
        content: { "application/json": { schema: CreateExpenseRequestSchema } },
      },

      responses: {
        201: {
          description: "Expense created",
          content: { "application/json": { schema: ExpenseSchema } },
        },

        401: {
          description: "Unauthorized",
          content: { "application/json": { schema: ErrorResponseSchema } },
        },

        422: {
          description: "Validation error",
          content: { "application/json": { schema: ErrorResponseSchema } },
        },

        500: {
          description: "Internal server error",
          content: { "application/json": { schema: ErrorResponseSchema } },
        },
      },
    },
  },

  "/api/v1/expenses/{id}": {
    get: {
      summary: "Get expense by id",
      tags: ["Expenses"],
      security: [{ bearerAuth: [] }],

      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "integer", minimum: 1 },
          example: 1,
        },
      ],

      responses: {
        200: {
          description: "Expense details",
          content: {
            "application/json": {
              schema: ExpenseDetailsSchema,
            },
          },
        },

        401: {
          description: "Unauthorized",
          content: { "application/json": { schema: ErrorResponseSchema } },
        },

        404: {
          description: "Expense not found",
          content: { "application/json": { schema: ErrorResponseSchema } },
        },

        422: {
          description: "Validation error",
          content: { "application/json": { schema: ErrorResponseSchema } },
        },

        500: {
          description: "Internal server error",
          content: { "application/json": { schema: ErrorResponseSchema } },
        },
      },
    },

    patch: {
      summary: "Update expense",
      tags: ["Expenses"],
      security: [{ bearerAuth: [] }],

      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "integer", minimum: 1 },
          example: 1,
        },
      ],

      requestBody: {
        required: true,
        content: { "application/json": { schema: UpdateExpenseRequestSchema } },
      },

      responses: {
        200: {
          description: "Expense updated",
          content: { "application/json": { schema: ExpenseSchema } },
        },

        401: {
          description: "Unauthorized",
          content: { "application/json": { schema: ErrorResponseSchema } },
        },

        404: {
          description: "Expense not found",
          content: { "application/json": { schema: ErrorResponseSchema } },
        },

        422: {
          description: "Validation error",
          content: { "application/json": { schema: ErrorResponseSchema } },
        },

        500: {
          description: "Internal server error",
          content: { "application/json": { schema: ErrorResponseSchema } },
        },
      },
    },

    delete: {
      summary: "Delete expense",
      tags: ["Expenses"],
      security: [{ bearerAuth: [] }],

      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "integer", minimum: 1 },
          example: 1,
        },
      ],

      responses: {
        204: { description: "Expense deleted" },

        401: {
          description: "Unauthorized",
          content: { "application/json": { schema: ErrorResponseSchema } },
        },

        404: {
          description: "Expense not found",
          content: { "application/json": { schema: ErrorResponseSchema } },
        },

        422: {
          description: "Validation error",
          content: { "application/json": { schema: ErrorResponseSchema } },
        },

        500: {
          description: "Internal server error",
          content: { "application/json": { schema: ErrorResponseSchema } },
        },
      },
    },
  },
};
