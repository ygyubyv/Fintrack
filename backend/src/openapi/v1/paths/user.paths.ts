import { UserSchema, UpdateUserRequestSchema } from "../schemas/user.schemas";
import { ErrorResponseSchema } from "../schemas/error-response.schema";

export const userPaths = {
  "/api/v1/user/my-account": {
    get: {
      summary: "Get my account",
      tags: ["User"],
      security: [{ bearerAuth: [] }],

      responses: {
        200: {
          description: "User profile",
          content: { "application/json": { schema: UserSchema } },
        },

        401: {
          description: "Unauthorized",
          content: { "application/json": { schema: ErrorResponseSchema } },
        },

        404: {
          description: "User not found",
          content: { "application/json": { schema: ErrorResponseSchema } },
        },

        500: {
          description: "Internal server error",
          content: { "application/json": { schema: ErrorResponseSchema } },
        },
      },
    },

    patch: {
      summary: "Update my account",
      tags: ["User"],
      security: [{ bearerAuth: [] }],

      requestBody: {
        required: true,
        content: { "application/json": { schema: UpdateUserRequestSchema } },
      },

      responses: {
        200: {
          description: "User updated",
          content: { "application/json": { schema: UserSchema } },
        },

        401: {
          description: "Unauthorized",
          content: { "application/json": { schema: ErrorResponseSchema } },
        },

        404: {
          description: "User not found",
          content: { "application/json": { schema: ErrorResponseSchema } },
        },

        409: {
          description: "Email already exists",
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
      summary: "Delete my account",
      tags: ["User"],
      security: [{ bearerAuth: [] }],

      responses: {
        204: { description: "Account deleted" },

        401: {
          description: "Unauthorized",
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
