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
  },
];
