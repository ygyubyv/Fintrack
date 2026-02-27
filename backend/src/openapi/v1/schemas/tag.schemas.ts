import { PaginationMetaSchema } from "./pagination.schemas";

export const TagSchema = {
  type: "object",
  required: ["id", "title", "color", "userId", "createdAt", "updatedAt"],
  properties: {
    id: { type: "integer", minimum: 1, example: 1 },
    title: { type: "string", example: "Food" },
    color: {
      type: "string",
      description: "Tag color (client-defined format, e.g. hex)",
      example: "#FF6B6B",
    },
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

export const TagListResponseSchema = {
  type: "object",
  required: ["data", "meta"],
  properties: {
    data: { type: "array", items: TagSchema },
    meta: PaginationMetaSchema,
  },
};

export const CreateTagRequestSchema = {
  type: "object",
  required: ["title", "color"],
  properties: {
    title: { type: "string", example: "Food" },
    color: { type: "string", example: "#FF6B6B" },
  },
};

export const UpdateTagRequestSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: { type: "string", example: "Food & Drinks" },
    color: { type: "string", example: "#FF8A00" },
  },
};
