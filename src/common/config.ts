import { NumberScope } from "./variables";

export interface Config {
  tabWidth: number;
  rootSelector: string;
  baseFontSize: number;
  units: Record<NumberScope, Unit>;
  hasDefaultValues: boolean;
  trimKeywords: string[];
}

export type Unit = "px" | "rem" | "em" | "none";

export const defaultConfig = {
  tabWidth: 2,
  rootSelector: ":root",
  baseFontSize: 16,
  units: {
    "all-numbers": "rem",
    "font-size": "rem",
    "font-weight": "none",
    gap: "rem",
    "letter-spacing": "px",
    "line-height": "rem",
    radius: "rem",
    size: "rem",
    "stroke-width": "px",
  },
  hasDefaultValues: true,
  trimKeywords: [
    "gap",
    "space",
    "spacing",
    "stroke",
    "size",
    "color",
    "radius",
    "font-family",
    "font-size",
    "line-height",
    "letter-spacing",
    "font-weight",
  ],
} satisfies Config;
