import { defineProject, configDefaults } from "vitest/config";

const exclude = [
  "**/dist/**",
  "**/build/**",
  "**/coverage/**",
  "**/tailwind.config.ts",
];

export default defineProject({
  test: {
    exclude: [...configDefaults.exclude, ...exclude],
    coverage: {
      exclude: [...(configDefaults.coverage.exclude ?? []), ...exclude],
    },
  },
});
