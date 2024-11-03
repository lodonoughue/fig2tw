import type { Config } from "tailwindcss";
import fig2twPlugin from "./fig2tw-plugin";

//const textStyles = ["Heading", "Headline", "Body", "Code"] as const;

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  plugins: [fig2twPlugin],
  theme: {
    extend: {
      borderRadius: {
        none: "0",
      },
    },
  },
};

export default config;
