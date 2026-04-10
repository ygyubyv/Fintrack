import {
  TagSchema,
  TagListResponseSchema,
  CreateTagRequestSchema,
  UpdateTagRequestSchema,
} from "../schemas/tag.schemas";
import { ErrorResponseSchema } from "../schemas/error-response.schema";

export const tagPaths = {
  "/api/v1/tags": {
    get: {
      summary: "Get tags list",
      tags: ["Tags"],
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
          name: "title",
          in: "query",
          required: false,
          schema: { type: "string", minLength: 1, maxLength: 50 },
          example: "foo",
        },
        {
          name: "tagIds[]",
          in: "query",
          required: false,
          style: "form",
          explode: true,
          schema: { type: "array", items: { type: "integer", minimum: 1 } },
          example: [1, 2],
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
      ],

      responses: {
        200: {
          description: "Tags list",
          content: {
            "application/json": {
              schema: TagListResponseSchema,
            },
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
      summary: "Create tag",
      tags: ["Tags"],
      security: [{ bearerAuth: [] }],

      requestBody: {
        required: true,
        content: {
          "application/json": { schema: CreateTagRequestSchema },
        },
      },

      responses: {
        201: {
          description: "Tag created",
          content: {
            "application/json": { schema: TagSchema },
          },
        },

        401: {
          description: "Unauthorized",
          content: { "application/json": { schema: ErrorResponseSchema } },
        },

        409: {
          description: "Tag already exists",
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

  "/api/v1/tags/{id}": {
    get: {
      summary: "Get tag by id",
      tags: ["Tags"],
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
          description: "Tag",
          content: {
            "application/json": { schema: TagSchema },
          },
        },

        401: {
          description: "Unauthorized",
          content: { "application/json": { schema: ErrorResponseSchema } },
        },

        404: {
          description: "Tag not found",
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
      summary: "Update tag",
      tags: ["Tags"],
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
        content: { "application/json": { schema: UpdateTagRequestSchema } },
      },

      responses: {
        200: {
          description: "Tag updated",
          content: { "application/json": { schema: TagSchema } },
        },

        401: {
          description: "Unauthorized",
          content: { "application/json": { schema: ErrorResponseSchema } },
        },

        404: {
          description: "Tag not found",
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
      summary: "Delete tag",
      tags: ["Tags"],
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
        204: { description: "Tag deleted" },

        401: {
          description: "Unauthorized",
          content: { "application/json": { schema: ErrorResponseSchema } },
        },

        404: {
          description: "Tag not found",
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

  "/api/v1/tags/export": {
    post: {
      summary: "Export tags to CSV",
      tags: ["Tags"],
      security: [{ bearerAuth: [] }],

      parameters: [
        {
          name: "title",
          in: "query",
          required: false,
          schema: { type: "string", minLength: 1, maxLength: 50 },
          example: "foo",
        },
        {
          name: "tagIds[]",
          in: "query",
          required: false,
          style: "form",
          explode: true,
          schema: { type: "array", items: { type: "integer", minimum: 1 } },
          example: [1, 2],
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
      ],

      responses: {
        200: {
          description: "CSV file with tags",
          content: { "text/csv": { schema: { type: "string" } } },
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

  "/api/v1/tags/import": {
    post: {
      summary: "Import tags from CSV",
      tags: ["Tags"],
      security: [{ bearerAuth: [] }],

      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              required: ["file"],
              properties: {
                file: { type: "string", format: "binary" },
              },
            },
          },
        },
      },

      responses: {
        200: { description: "Tags imported successfully" },

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
};
