import type { Config } from "tailwindcss";
import fig2twPlugin, { pick } from "@fig2tw/tailwindcss-plugin";
import fig2twTheme from "../../fig2tw.json";

const textStyles = ["Heading", "Headline", "Body", "Code"] as const;

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  plugins: [
    fig2twPlugin({
      variables: fig2twTheme,
      gridSystem: { unitPx: 8 },
      spacing: it => it.Density.Space,
      sizes: it => it.Density.Size,
      colors: it => ({
        ...it.Scheme.Neutral,
        ...it.Scheme.Primary,
        ...it.Scheme.Secondary,
        ...it.Scheme.Tertiary,
        ...it.Scheme.Quaternary,
        ...it.Scheme.Quinary,
      }),
      borderRadius: it => it.Density.Radius,
      fontFamily: it => pick(it.Typography, textStyles, v => v["Font Family"]),
      fontSize: it => pick(it.Typography, textStyles, v => v["Font Size"]),
      lineHeight: it => pick(it.Typography, textStyles, v => v["Line Height"]),
    }),
  ],
  theme: {
    extend: {
      borderRadius: {
        none: "0",
      },
    },
  },
};

export default config;
