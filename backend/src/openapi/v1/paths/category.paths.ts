import {
  CategorySchema,
  CategoryListResponseSchema,
  CreateCategoryRequestSchema,
  UpdateCategoryRequestSchema,
} from "../schemas/category.schemas";
import { ErrorResponseSchema } from "../schemas/error-response.schema";

export const categoryPaths = {
  "/api/v1/categories": {
    get: {
      summary: "Get categories list",
      tags: ["Categories"],
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
          schema: { type: "string" },
          example: "gro",
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
          description: "Categories list",
          content: {
            "application/json": { schema: CategoryListResponseSchema },
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
      summary: "Create category",
      tags: ["Categories"],
      security: [{ bearerAuth: [] }],

      requestBody: {
        required: true,
        content: {
          "application/json": { schema: CreateCategoryRequestSchema },
        },
      },

      responses: {
        201: {
          description: "Category created",
          content: { "application/json": { schema: CategorySchema } },
        },

        401: {
          description: "Unauthorized",
          content: { "application/json": { schema: ErrorResponseSchema } },
        },

        409: {
          description: "Category already exists",
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

  "/api/v1/categories/{id}": {
    get: {
      summary: "Get category by id",
      tags: ["Categories"],
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
          description: "Category (can be null if not found)",
          content: {
            "application/json": {
              schema: { ...CategorySchema, nullable: true },
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

    patch: {
      summary: "Update category",
      tags: ["Categories"],
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
        content: {
          "application/json": { schema: UpdateCategoryRequestSchema },
        },
      },

      responses: {
        200: {
          description: "Category updated",
          content: { "application/json": { schema: CategorySchema } },
        },

        401: {
          description: "Unauthorized",
          content: { "application/json": { schema: ErrorResponseSchema } },
        },

        404: {
          description: "Category not found",
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
      summary: "Delete category",
      tags: ["Categories"],
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
        204: { description: "Category deleted" },

        401: {
          description: "Unauthorized",
          content: { "application/json": { schema: ErrorResponseSchema } },
        },

        404: {
          description: "Category not found",
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
