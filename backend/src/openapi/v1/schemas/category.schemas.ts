import { PaginationMetaSchema } from "./pagination.schemas";

export const CategorySchema = {
  type: "object",
  required: ["id", "title", "userId", "createdAt", "updatedAt"],
  properties: {
    id: { type: "integer", minimum: 1, example: 1 },
    title: { type: "string", example: "Groceries" },
    userId: { type: "integer", minimum: 1, example: 10 },
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

export const CategoryListResponseSchema = {
  type: "object",
  required: ["data", "meta"],
  properties: {
    data: { type: "array", items: CategorySchema },
    meta: PaginationMetaSchema,
  },
};

export const CreateCategoryRequestSchema = {
  type: "object",
  required: ["title"],
  properties: {
    title: { type: "string", example: "Groceries" },
  },
};

export const UpdateCategoryRequestSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: { type: "string", example: "Groceries & Household" },
  },
};
