export const LastLoginSchema = {
  type: "object",
  required: ["id", "lastLoginAt"],
  properties: {
    id: { type: "integer", minimum: 1, example: 1 },
    userAgent: { type: "string", example: "Mozilla/5.0 ..." },
    ipAddress: { type: "string", example: "192.168.1.10" },
    lastLoginAt: {
      type: "string",
      format: "date-time",
      example: "2026-02-27T10:00:00.000Z",
    },
  },
};

export const UserSchema = {
  type: "object",
  required: [
    "id",
    "firstName",
    "lastName",
    "email",
    "emailVerified",
    "createdAt",
    "updatedAt",
    "lastLogin",
  ],
  properties: {
    id: { type: "integer", minimum: 1, example: 10 },
    firstName: {
      type: "string",
      minLength: 1,
      maxLength: 100,
      example: "John",
    },
    lastName: { type: "string", minLength: 1, maxLength: 100, example: "Doe" },
    email: {
      type: "string",
      format: "email",
      maxLength: 254,
      example: "john.doe@example.com",
    },
    emailVerified: { type: "boolean", example: true },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
    lastLogin: { ...LastLoginSchema, nullable: true },
  },
};

export const UpdateUserRequestSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstName: {
      type: "string",
      minLength: 1,
      maxLength: 100,
      example: "John",
    },
    lastName: { type: "string", minLength: 1, maxLength: 100, example: "Doe" },
    email: {
      type: "string",
      format: "email",
      maxLength: 254,
      example: "john.new@example.com",
    },
    password: {
      type: "string",
      minLength: 6,
      maxLength: 128,
      example: "NewSecurePassword123!",
    },
  },
};
