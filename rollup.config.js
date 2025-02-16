import terser from "@rollup/plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import { babel } from "@rollup/plugin-babel";
import copy from "rollup-plugin-copy";

/** @type {import('rollup').RollupOptions} */
export default {
  input: "src/main.ts",
  output: {
    dir: "dist",
    format: "cjs",
    globals: {
      figma: "figma",
    },
  },
  plugins: [
    typescript({ outputToFilesystem: true }),
    commonjs(),
    resolve(),
    babel({
      babelHelpers: "bundled",
      presets: ["@babel/preset-env"],
    }),
    //terser(),
    copy({
      targets: [{ src: "./src/manifest.json", dest: "dist" }],
    }),
  ],
};
