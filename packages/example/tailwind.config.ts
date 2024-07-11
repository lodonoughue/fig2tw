import type { Config } from "tailwindcss";
import fig2twPlugin from "@fig2tw/tailwindcss-plugin";
import fig2twTheme from "./fig2tw.json";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  plugins: [
    fig2twPlugin({
      variables: fig2twTheme,
      gridSystem: { unitPx: 8 },
      defineSpacing: it => it.Density.Space,
      defineColors: it => it.Scheme,
      defineRadius: it => it.Density.Radius,
    }),
  ],
} satisfies Config;
