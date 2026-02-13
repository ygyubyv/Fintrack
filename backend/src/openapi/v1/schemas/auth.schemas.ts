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

export const AuthResponseSchema = {
  type: "object",
  required: ["accessToken", "idToken"],
  properties: {
    accessToken: {
      type: "string",
      description: "JWT access token for API authentication",
    },
    idToken: {
      type: "string",
      description: "JWT ID token with user information",
    },
  },
};
