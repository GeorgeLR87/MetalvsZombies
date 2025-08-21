// eslint.config.js
import eslint from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import prettier from "eslint-config-prettier";
import globals from "globals";

/** @type {import("eslint").Linter.Config[]} */
export default [
  // Reglas JS base
  eslint.configs.recommended,

  // Ignorar rutas y archivos que no queremos lint
  {
    ignores: [
      "dist/**",
      "public/**",
      "legacy_v1/**",
      "eslint.config.js" // 👈 evita lint al propio config
    ]
  },

  // 1) Type-aware SOLO para código dentro de src (usa tsconfig.json) + globals del navegador
  {
    files: ["src/**/*.ts", "src/**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: process.cwd(),
        ecmaVersion: "latest",
        sourceType: "module"
      },
      globals: {
        ...globals.browser
      }
    },
    plugins: { "@typescript-eslint": tsPlugin },
    rules: {
      ...tsPlugin.configs["recommended-type-checked"].rules,
      "@typescript-eslint/no-unused-vars": "warn",
      "no-console": "off"
    }
  },

  // 2) TS fuera de src (vite.config.ts, scripts, etc.) SIN project + globals de Node
  {
    files: ["*.ts", "*.tsx", "vite.config.ts"],
    ignores: ["src/**"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module"
      },
      globals: {
        ...globals.node
      }
    },
    plugins: { "@typescript-eslint": tsPlugin },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": "warn",
      "no-console": "off"
    }
  },

  // 3) Prettier al final
  prettier
];
