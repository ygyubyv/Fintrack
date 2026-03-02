import { PaginationMetaSchema } from "./pagination.schemas";

export const CategorySchema = {
  type: "object",
  required: ["id", "title", "createdAt", "updatedAt"],
  properties: {
    id: { type: "integer", minimum: 1, example: 1 },
    title: {
      type: "string",
      minLength: 1,
      maxLength: 50,
      example: "Groceries",
    },
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
    title: {
      type: "string",
      minLength: 1,
      maxLength: 50,
      example: "Groceries",
    },
  },
};

export const UpdateCategoryRequestSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: {
      type: "string",
      minLength: 1,
      maxLength: 50,
      example: "Groceries & Household",
    },
  },
};
