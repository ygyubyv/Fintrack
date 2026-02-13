export * from "./prisma";

export const ERROR_CODES = {
  // Auth
  AUTH_INVALID_CREDENTIALS: "AUTH_INVALID_CREDENTIALS",
  AUTH_TOKEN_INVALID: "AUTH_TOKEN_INVALID",
  AUTH_TOKEN_EXPIRED: "AUTH_TOKEN_EXPIRED",

  // User
  USER_NOT_FOUND: "USER_NOT_FOUND",
  USER_EMAIL_EXISTS: "USER_EMAIL_EXISTS",

  // Shared
  VALIDATION_ERROR: "VALIDATION_ERROR",
  FORBIDDEN: "FORBIDDEN",
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

export const ERROR_MAP: Record<ErrorCode, { status: number; message: string }> =
  {
    // Auth
    AUTH_INVALID_CREDENTIALS: {
      status: 401,
      message: "Invalid email or password",
    },

    AUTH_TOKEN_INVALID: {
      status: 401,
      message: "Token is invalid",
    },

    AUTH_TOKEN_EXPIRED: {
      status: 401,
      message: "Token expired",
    },

    // User
    USER_NOT_FOUND: {
      status: 404,
      message: "User not found",
    },

    USER_EMAIL_EXISTS: {
      status: 409,
      message: "Email already exists",
    },

    // Shared
    VALIDATION_ERROR: {
      status: 422,
      message: "Validation failed",
    },

    FORBIDDEN: {
      status: 403,
      message: "Forbidden",
    },

    INTERNAL_ERROR: {
      status: 500,
      message: "Internal server error",
    },
  };
