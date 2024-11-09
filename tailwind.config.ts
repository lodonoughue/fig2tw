import type { Config } from "tailwindcss";
import fig2twPlugin from "./tailwind.fig2tw";

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
