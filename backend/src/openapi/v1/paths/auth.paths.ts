import {
  AuthResponseSchema,
  LoginRequestSchema,
  LogoutRequestSchema,
  RefreshRequestSchema,
  SignupRequestSchema,
  ForgotPasswordRequestSchema,
  ResetPasswordRequestSchema,
  VerifyEmailRequestSchema,
} from "../schemas/auth.schemas";
import { ErrorResponseSchema } from "../schemas/error-response.schema";

export const authPaths = {
  "/api/v1/auth/signup": {
    post: {
      summary: "Sign up",
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
        201: {
          description:
            "User registration accepted. Verification code has been sent to email.",
        },

        409: {
          description: "Email already exists (and already verified)",
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

  "/api/v1/auth/verify-email": {
    post: {
      summary: "Verify email ",
      tags: ["Authentication"],

      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: VerifyEmailRequestSchema,
          },
        },
      },

      responses: {
        200: {
          description: "Email verified successfully. Tokens issued.",
          content: {
            "application/json": {
              schema: AuthResponseSchema,
            },
          },
        },

        400: {
          description: "Email verification token is invalid (expired/used)",
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

  "/api/v1/auth/refresh": {
    post: {
      summary: "Refresh tokens",
      tags: ["Authentication"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: RefreshRequestSchema,
          },
        },
      },
      responses: {
        200: {
          description: "Tokens refreshed",
          content: {
            "application/json": {
              schema: AuthResponseSchema,
            },
          },
        },
        401: {
          description: "Invalid refresh token",
          content: {
            "application/json": {
              schema: ErrorResponseSchema,
            },
          },
        },
      },
    },
  },

  "/api/v1/auth/logout": {
    post: {
      summary: "Logout",
      tags: ["Authentication"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: LogoutRequestSchema,
          },
        },
      },
      responses: {
        204: {
          description: "Logged out successfully",
        },
        401: {
          description: "Invalid refresh token",
          content: {
            "application/json": {
              schema: ErrorResponseSchema,
            },
          },
        },
      },
    },
  },

  "/api/v1/auth/forgot-password": {
    post: {
      summary: "Forgot password",
      tags: ["Authentication"],

      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: ForgotPasswordRequestSchema,
          },
        },
      },

      responses: {
        200: {
          description: "If the email exists, a reset link has been sent",
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

  "/api/v1/auth/reset-password": {
    post: {
      summary: "Reset password",
      tags: ["Authentication"],

      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: ResetPasswordRequestSchema,
          },
        },
      },

      responses: {
        204: {
          description: "Password successfully reset",
        },

        400: {
          description: "Invalid reset token",
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
