import { PaginationMetaSchema } from "./pagination.schemas";

export const HexColorPattern = "^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$";

export const TagSchema = {
  type: "object",
  required: ["id", "title", "color", "createdAt", "updatedAt"],
  properties: {
    id: { type: "integer", minimum: 1, example: 1 },
    title: { type: "string", minLength: 1, maxLength: 50, example: "Food" },
    color: {
      type: "string",
      pattern: HexColorPattern,
      description: "HEX color code (#RGB or #RRGGBB)",
      example: "#FF6B6B",
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
    title: { type: "string", minLength: 1, maxLength: 50, example: "Food" },
    color: { type: "string", pattern: HexColorPattern, example: "#FF6B6B" },
  },
};

export const UpdateTagRequestSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: {
      type: "string",
      minLength: 1,
      maxLength: 50,
      example: "Food & Drinks",
    },
    color: { type: "string", pattern: HexColorPattern, example: "#FF8A00" },
  },
};
