import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginVue from "eslint-plugin-vue";
import globals from "globals";
import typescriptEslint from "typescript-eslint";

export default typescriptEslint.config(
  { ignores: ["*.d.ts", "**/coverage", "**/dist"] },
  {
    extends: [
      eslint.configs.recommended,
      ...typescriptEslint.configs.recommended,
      ...eslintPluginVue.configs["flat/recommended"],
    ],
    files: ["**/*.{ts,vue}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
      parserOptions: {
        parser: typescriptEslint.parser,
      },
    },
    rules: {
      "no-console": ["warn", { allow: ["error"] }],
      "no-debugger": "warn",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": "warn",

      "vue/multi-word-component-names": "off",
      "vue/no-unused-vars": "warn",
      "vue/no-mutating-props": "warn",
      "vue/require-default-prop": "off",
      "vue/html-self-closing": "off",

      "arrow-body-style": "off",
      "prefer-arrow-callback": "off",

      eqeqeq: ["warn", "always"],
      curly: "warn",
    },
  },
  eslintConfigPrettier,
);
