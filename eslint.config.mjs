import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";
import next from "eslint-config-next";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      globals: globals.browser
    }
  },
  pluginJs.configs.recommended, // JavaScript ESLint rules
  ...tseslint.configs.recommended, // TypeScript ESLint rules
  next, // Next.js ESLint rules
  prettier, // Disables conflicting Prettier rules
  {
    rules: {
      "react/react-in-jsx-scope": "off", // Fix JSX scope issue in Next.js
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }], // Ignore unused variables prefixed with _
      "@typescript-eslint/no-explicit-any": "warn", // Allow but warn on `any`
      "no-prototype-builtins": "off", // Fix prototype method warnings
    }
  },
  {
    ignores: ["node_modules/", ".next/", "dist/", "public/"]
  }
];