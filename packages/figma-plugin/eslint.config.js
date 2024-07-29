import baseConfig from "../../eslint.config.base.js";
import globals from "globals";

export default [
  ...baseConfig,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_|h",
          varsIgnorePattern: "^_|h",
        },
      ],
    },
  },
];
