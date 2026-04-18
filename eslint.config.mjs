// @ts-check
import eslint from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import * as importPlugin from "eslint-plugin-import";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    files: ["eslint.config.mjs", "src/**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    ignores: ["src/components/ui/*"],
    settings: {
      react: {
        version: "detect",
      },

      "import/resolver": {
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
    },
    languageOptions: {
      globals: {
        ...globals.browser,
      },

      parser: tsParser,
    },
    extends: [eslint.configs.recommended, ...tseslint.configs.recommended],
    plugins: {
      react: /** @type import("eslint").ESLint.Plugin */ (reactPlugin),
      "react-refresh": reactRefresh,
      "react-hooks": /** @type import("eslint").ESLint.Plugin */ (reactHooksPlugin),
      "jsx-a11y": jsxA11yPlugin,
      import: importPlugin,
    },
    rules: {
      .../** @type import("eslint").Linter.RulesRecord */ (reactPlugin.configs.flat?.recommended.rules),
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      ...jsxA11yPlugin.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        {
          allowConstantExport: true,
        },
      ],

      "import/named": "error",
      "import/default": "error",
      "import/namespace": "error",
      "import/no-duplicates": "error",
      "import/no-extraneous-dependencies": "error",
      "react/react-in-jsx-scope": "off",
    },
  },
  // Security rules applied to ALL files including UI components.
  // These prevent patterns that fail GitLab SAST (Semgrep) scans.
  {
    files: ["src/**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      parser: tsParser,
    },
    plugins: {
      react: /** @type import("eslint").ESLint.Plugin */ (reactPlugin),
    },
    rules: {
      "no-restricted-properties": [
        "error",
        {
          object: "Math",
          property: "random",
          message:
            "Math.random() fails security scans (CWE-338). Use crypto.randomUUID() for IDs or crypto.getRandomValues() for random numbers.",
        },
      ],
      "react/no-danger": "error",
    },
  },
);
