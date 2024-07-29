import terser from "@rollup/plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import copy from "rollup-plugin-copy";

export default [
  {
    input: "build/index.js",
    output: {
      dir: "dist",
      format: "cjs",
    },
    plugins: [
      resolve(),
      terser(),
      copy({
        targets: [
          { src: "src/index.html", dest: "dist" },
          { src: "manifest.json", dest: "dist" },
        ],
      }),
    ],
  },
];
