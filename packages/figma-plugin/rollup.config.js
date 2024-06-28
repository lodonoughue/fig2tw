import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import copy from "rollup-plugin-copy";

export default [
  {
    input: "src/index.ts",
    output: {
      dir: "dist",
      format: "cjs",
    },
    plugins: [
      resolve(),
      typescript({
        module: "nodenext",
        tsconfig: "./tsconfig.json",
      }),
      terser(),
      copy({
        targets: [{ src: "src/index.html", dest: "dist" }],
      }),
    ],
  },
];
