import type { Config } from "tailwindcss";
import fig2twPlugin from "@fig2tw/tailwindcss-plugin";
import fig2twTheme from "./fig2tw.json";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  plugins: [
    fig2twPlugin({
      variables: fig2twTheme,
      root: { gridSystemPx: 8 },
      defineColors: it => ({
        ...it.Mode.Scheme.Neutral,
        ...it.Mode.Scheme.Primary,
        ...it.Mode.Scheme.Secondary,
        ...it.Mode.Scheme.Success,
        ...it.Mode.Scheme.Alert,
        ...it.Mode.Scheme.Error,
      }),
      defineRadius: it => it.Density.Radius,
      defineSpacing: it => it.Density.Space,
      defineSizes: it => it.Density.Size,
    }),
  ],
} satisfies Config;
