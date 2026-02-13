import { authPaths } from "./paths/auth.paths";

export const openapiDefinitionV1 = {
  openapi: "3.0.3",
  info: {
    title: "Expense Tracker API",
    version: "1.0.0",
  },
  paths: {
    ...authPaths,
  },
};
