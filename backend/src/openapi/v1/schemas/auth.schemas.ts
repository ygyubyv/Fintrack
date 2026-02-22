export const SignupRequestSchema = {
  type: "object",
  required: ["firstName", "lastName", "email", "password"],
  properties: {
    firstName: {
      type: "string",
      minLength: 1,
      example: "John",
    },
    lastName: {
      type: "string",
      minLength: 1,
      example: "Doe",
    },
    email: {
      type: "string",
      format: "email",
      example: "john.doe@example.com",
    },
    password: {
      type: "string",
      minLength: 6,
      example: "SecurePassword123!",
    },
  },
};

export const LoginRequestSchema = {
  type: "object",
  required: ["email", "password"],
  properties: {
    email: {
      type: "string",
      format: "email",
      example: "john.doe@example.com",
    },
    password: {
      type: "string",
      minLength: 6,
      example: "SecurePassword123!",
    },
  },
};

export const RefreshRequestSchema = {
  type: "object",
  required: ["refreshToken"],
  properties: {
    refreshToken: {
      type: "string",
      description: "Refresh token used to rotate tokens",
      example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    },
  },
};

export const LogoutRequestSchema = {
  type: "object",
  required: ["refreshToken"],
  properties: {
    refreshToken: {
      type: "string",
      description: "Refresh token to revoke",
      example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    },
  },
};

export const AuthResponseSchema = {
  type: "object",
  required: ["accessToken", "refreshToken", "idToken"],
  properties: {
    accessToken: {
      type: "string",
      description: "JWT access token for API authentication",
    },
    refreshToken: {
      type: "string",
      description: "JWT refresh token used for token rotation",
    },
    idToken: {
      type: "string",
      description: "JWT ID token with user information",
    },
  },
};

export const ForgotPasswordRequestSchema = {
  type: "object",
  required: ["email"],
  properties: {
    email: {
      type: "string",
      format: "email",
      example: "john.doe@example.com",
    },
  },
};

export const ResetPasswordRequestSchema = {
  type: "object",
  required: ["token", "password"],
  properties: {
    token: {
      type: "string",
      description: "Reset password token received via email",
      example: "a3f8c9e2b7d4...",
    },
    password: {
      type: "string",
      minLength: 6,
      example: "NewSecurePassword123!",
    },
  },
};
