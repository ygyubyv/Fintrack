import { authPaths } from "./paths/auth.paths";
import { categoryPaths } from "./paths/category.paths";
import { expensePaths } from "./paths/expense.paths";
import { tagPaths } from "./paths/tag.paths";

export const openapiDefinitionV1 = {
  openapi: "3.0.3",
  info: {
    title: "Expense Tracker API",
    version: "1.0.0",
  },
  paths: {
    ...authPaths,
    ...tagPaths,
    ...categoryPaths,
    ...expensePaths,
  },
};
