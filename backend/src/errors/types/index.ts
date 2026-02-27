export * from "./prisma";

export const ERROR_CODES = {
  // Auth
  AUTH_INVALID_CREDENTIALS: "AUTH_INVALID_CREDENTIALS",
  AUTH_TOKEN_INVALID: "AUTH_TOKEN_INVALID",
  AUTH_TOKEN_EXPIRED: "AUTH_TOKEN_EXPIRED",
  AUTH_RESET_TOKEN_INVALID: "AUTH_RESET_TOKEN_INVALID",
  AUTH_EMAIL_VERIFICATION_TOKEN_INVALID:
    "AUTH_EMAIL_VERIFICATION_TOKEN_INVALID",
  AUTH_GOOGLE_ID_TOKEN_INVALID: "AUTH_GOOGLE_ID_TOKEN_INVALID",

  // User
  USER_NOT_FOUND: "USER_NOT_FOUND",
  USER_EMAIL_EXISTS: "USER_EMAIL_EXISTS",

  // Tag
  TAG_NOT_FOUND: "TAG_NOT_FOUND",
  TAG_EXISTS: "TAG_EXISTS",

  // Category
  CATEGORY_NOT_FOUND: "CATEGORY_NOT_FOUND",
  CATEGORY_EXISTS: "CATEGORY_EXISTS",

  // Expense
  EXPENSE_NOT_FOUND: "EXPENSE_NOT_FOUND",

  // Email
  EMAIL_SEND_FAILED: "EMAIL_SEND_FAILED",

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

    AUTH_RESET_TOKEN_INVALID: {
      status: 400,
      message: "Reset token is invalid",
    },

    AUTH_EMAIL_VERIFICATION_TOKEN_INVALID: {
      status: 400,
      message: "Email verification token is invalid",
    },

    AUTH_GOOGLE_ID_TOKEN_INVALID: {
      status: 400,
      message: "Google ID token is invalid",
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

    // Tag
    TAG_NOT_FOUND: {
      status: 404,
      message: "Tag not found",
    },

    TAG_EXISTS: {
      status: 409,
      message: "Tag already exists",
    },

    // Category
    CATEGORY_NOT_FOUND: {
      status: 404,
      message: "Category not found",
    },

    CATEGORY_EXISTS: {
      status: 409,
      message: "Category already exists",
    },

    // Expense
    EXPENSE_NOT_FOUND: {
      status: 404,
      message: "Expense not found",
    },

    // Email
    EMAIL_SEND_FAILED: {
      status: 500,
      message: "Failed to send email",
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
