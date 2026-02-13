import {
  AuthResponseSchema,
  LoginRequestSchema,
  SignupRequestSchema,
} from "../schemas/auth.schemas";
import { ErrorResponseSchema } from "../schemas/error-response.schema";
export const authPaths = {
  "/api/v1/auth/signup": {
    post: {
      summary: "User registration",
      tags: ["Authentication"],

      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: SignupRequestSchema,
          },
        },
      },

      responses: {
        200: {
          description: "User successfully registered",
          content: {
            "application/json": {
              schema: AuthResponseSchema,
            },
          },
        },

        409: {
          description: "Email already exists",
          content: {
            "application/json": {
              schema: ErrorResponseSchema,
            },
          },
        },

        422: {
          description: "Validation error",
          content: {
            "application/json": {
              schema: ErrorResponseSchema,
            },
          },
        },

        500: {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: ErrorResponseSchema,
            },
          },
        },
      },
    },
  },

  "/api/v1/auth/login": {
    post: {
      summary: "User login",
      tags: ["Authentication"],

      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: LoginRequestSchema,
          },
        },
      },

      responses: {
        200: {
          description: "User successfully authenticated",
          content: {
            "application/json": {
              schema: AuthResponseSchema,
            },
          },
        },

        401: {
          description: "Invalid credentials",
          content: {
            "application/json": {
              schema: ErrorResponseSchema,
            },
          },
        },

        422: {
          description: "Validation error",
          content: {
            "application/json": {
              schema: ErrorResponseSchema,
            },
          },
        },

        500: {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: ErrorResponseSchema,
            },
          },
        },
      },
    },
  },
};
