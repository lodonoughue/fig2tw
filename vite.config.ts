import { defineConfig } from "vitest/config";
import { viteSingleFile } from "vite-plugin-singlefile";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [viteSingleFile(), tsconfigPaths()],
  resolve: {
    alias: {
      "@ui": path.resolve(__dirname, "./src/ui"),
      "@common": path.resolve(__dirname, "./src/common"),
    },
  },
  test: {
    include: ["src/**/*.spec.{ts,tsx}"],
    coverage: {
      include: ["src/**/*.{ts,tsx}"],
    },
  },
});
