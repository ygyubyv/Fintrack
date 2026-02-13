export const ErrorResponseSchema = {
  type: "object",
  required: ["code", "message"],
  properties: {
    code: {
      type: "string",
      description: "Application error code",
      example: "AUTH_INVALID_CREDENTIALS",
    },
    message: {
      type: "string",
      description: "Human readable error message",
      example: "Invalid email or password",
    },
    details: {
      type: "object",
      nullable: true,
      description: "Additional error metadata",
    },
  },
};
