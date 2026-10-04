import js from "@eslint/js";
import ts from "typescript-eslint";
import hooks from "eslint-plugin-react-hooks";
export default ts.config(
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "playwright-report/**",
      "test-results/**",
    ],
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    files: ["**/*.{ts,tsx,mjs}"],
    plugins: { "react-hooks": hooks },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error",
    },
    languageOptions: {
      globals: {
        document: "readonly",
        HTMLInputElement: "readonly",
        Event: "readonly",
        performance: "readonly",
        navigator: "readonly",
        window: "readonly",
        console: "readonly",
        requestAnimationFrame: "readonly",
      },
    },
  },
);
