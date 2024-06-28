//import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import peerdeps from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import dts from "rollup-plugin-dts";

/** @type {import('rollup').RollupOptions} */
export default [
  {
    input: "./build/index.js",
    output: {
      dir: "dist",
      format: "cjs",
      sourcemap: true,
    },
    plugins: [peerdeps(), resolve(), terser()],
  },
  {
    input: "./build/index.d.ts",
    output: [{ file: "./dist/index.d.ts", format: "es" }],
    plugins: [peerdeps(), resolve(), dts({ respectExternal: true })],
  },
];
