import { defineProject } from "vitest/config";
import baseConfig from "../../vitest.config";

export default defineProject({
  test: {
    ...baseConfig.test,
    environment: "node",
  },
});
