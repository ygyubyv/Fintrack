import eslint from "@eslint/js";
import globals from "globals";
import typescriptEslint from "typescript-eslint";

export default typescriptEslint.config(
  { ignores: ["dist/**", "node_modules/**"] },
  {
    extends: [
      eslint.configs.recommended,
      ...typescriptEslint.configs.recommended,
    ],
    files: ["**/*.{js,ts}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.node,
    },
    rules: {
      "no-console": "off",
      "no-debugger": "warn",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": "warn",
      eqeqeq: ["warn", "always"],
      curly: "warn",
    },
  },
);
