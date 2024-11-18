import plugin from "tailwindcss/plugin.js";

const figConfig = {
  "figma:all-colors": {
    "tertiary-variant": "rgb(var(--scheme-tertiary-variant, 252 120 57) / <alpha-value>)",
    "primary": "rgb(var(--scheme-primary, 131 56 236) / <alpha-value>)",
    "secondary": "rgb(var(--scheme-secondary, 57 134 255) / <alpha-value>)",
    "tertiary": "rgb(var(--scheme-tertiary, 251 86 7) / <alpha-value>)",
    "secondary-variant": "rgb(var(--scheme-secondary-variant, 97 158 255) / <alpha-value>)",
    "primary-variant": "rgb(var(--scheme-primary-variant, 156 96 240) / <alpha-value>)"
  },
  "figma:fill-color": {
    "surface": "rgb(var(--scheme-surface, 248 246 248) / <alpha-value>)",
    "primary-container": "rgb(var(--scheme-primary-container, 247 243 247) / <alpha-value>)",
    "secondary-container-variant": "rgb(var(--scheme-secondary-container-variant, 194 217 255) / <alpha-value>)",
    "tertiary-container-variant": "rgb(var(--scheme-tertiary-container-variant, 254 203 178) / <alpha-value>)",
    "container": "rgb(var(--scheme-container, 253 252 253) / <alpha-value>)",
    "primary-container-variant": "rgb(var(--scheme-primary-container-variant, 232 221 233) / <alpha-value>)",
    "secondary-container": "rgb(var(--scheme-secondary-container, 235 243 255) / <alpha-value>)",
    "tertiary-container": "rgb(var(--scheme-tertiary-container, 255 238 230) / <alpha-value>)"
  },
  "figma:text-color": {
    "surface": "rgb(var(--scheme-surface, 248 246 248) / <alpha-value>)",
    "on-surface": "rgb(var(--scheme-on-surface, 55 24 99) / <alpha-value>)",
    "on-primary": "rgb(var(--scheme-on-primary, 247 243 247) / <alpha-value>)",
    "on-secondary": "rgb(var(--scheme-on-secondary, 235 243 255) / <alpha-value>)",
    "on-tertiary": "rgb(var(--scheme-on-tertiary, 255 238 230) / <alpha-value>)",
    "container": "rgb(var(--scheme-container, 253 252 253) / <alpha-value>)",
    "on-container": "rgb(var(--scheme-on-container, 55 24 99) / <alpha-value>)",
    "on-primary-container": "rgb(var(--scheme-on-primary-container, 55 24 99) / <alpha-value>)",
    "on-secondary-container": "rgb(var(--scheme-on-secondary-container, 55 24 99) / <alpha-value>)",
    "on-tertiary-container": "rgb(var(--scheme-on-tertiary-container, 55 24 99) / <alpha-value>)"
  },
  "figma:radius": {
    "md": "var(--density-radius-md, 0.75rem)",
    "full": "var(--density-radius-full, 624.9375rem)",
    "sm": "var(--density-radius-sm, 0.5rem)",
    "xs": "var(--density-radius-xs, 0.25rem)"
  },
  "figma:size": {
    "content-max-width": "var(--density-size-content-max-width, 45rem)",
    "input-height": "var(--density-size-input-height, 3rem)"
  },
  "figma:gap": {
    "xs": "var(--density-space-xs, 0.25rem)",
    "sm": "var(--density-space-sm, 0.75rem)",
    "md": "var(--density-space-md, 2rem)",
    "lg": "var(--density-space-lg, 4rem)",
    "xl": "var(--density-space-xl, 8rem)"
  },
  "figma:stroke-width": {
    "regular": "var(--density-stroke-regular, 2px)"
  },
  "figma:font-family": {
    "heading": "var(--typography-heading-font-family, Outfit)",
    "headline": "var(--typography-headline-font-family, Koulen)",
    "code": "var(--typography-code-font-family, \"Oxygen Mono\")",
    "body-medium": "var(--typography-body-medium-font-family, Outfit)",
    "label-medium": "var(--typography-label-medium-font-family, Outfit)",
    "body-small": "var(--typography-body-small-font-family, Outfit)",
    "label-small": "var(--typography-label-small-font-family, Outfit)"
  },
  "figma:font-size": {
    "headline": [
      "var(--typography-headline-font-size, 1.25rem)",
      {
        "lineHeight": "var(--typography-headline-line-height, 1.5rem)",
        "letterSpacing": "var(--typography-headline-letter-spacing, 1px)"
      }
    ],
    "heading": [
      "var(--typography-heading-font-size, 2.5rem)",
      {
        "lineHeight": "var(--typography-heading-line-height, 3rem)",
        "fontWeight": "var(--typography-heading-font-weight, 800)"
      }
    ],
    "body-medium": [
      "var(--typography-body-medium-font-size, 1rem)",
      "var(--typography-body-medium-line-height, 1.25rem)"
    ],
    "code": [
      "var(--typography-code-font-size, 0.875rem)",
      "var(--typography-code-line-height, 1rem)"
    ],
    "label-medium": [
      "var(--typography-label-medium-font-size, 1rem)",
      "var(--typography-label-medium-line-height, 1.25rem)"
    ],
    "body-small": [
      "var(--typography-body-small-font-size, 0.875rem)",
      {
        "lineHeight": "var(--typography-body-small-line-height, 1rem)",
        "fontWeight": "var(--typography-body-small-font-weight, 300)"
      }
    ],
    "label-small": [
      "var(--typography-label-small-font-size, 0.875rem)",
      {
        "lineHeight": "var(--typography-label-small-line-height, 1rem)",
        "letterSpacing": "var(--typography-label-small-letter-spacing, 0.25px)"
      }
    ]
  },
  "figma:letter-spacing": {
    "wide": "var(--typography-letter-spacing-wide, 0.25px)"
  },
  "figma:font-weight": {
    "bold": "var(--typography-font-weight-bold, 800)",
    "light": "var(--typography-font-weight-light, 300)"
  }
};

const twConfig = {
  ...figConfig,
  "extends": {
    "fill": ({ theme }) => ({ ...theme("figma:fill-color") }),
    "accentColor": ({ theme }) => ({ ...theme("figma:fill-color") }),
    "size": ({ theme }) => ({ ...theme("figma:size") }),
    "width": ({ theme }) => ({ ...theme("figma:size") }),
    "minWidth": ({ theme }) => ({ ...theme("figma:size") }),
    "maxWidth": ({ theme }) => ({ ...theme("figma:size") }),
    "height": ({ theme }) => ({ ...theme("figma:size") }),
    "minHeight": ({ theme }) => ({ ...theme("figma:size") }),
    "maxHeight": ({ theme }) => ({ ...theme("figma:size") }),
    "margin": ({ theme }) => ({ ...theme("figma:gap") }),
    "inset": ({ theme }) => ({ ...theme("figma:gap") }),
  },
  "colors": ({ theme }) => ({ ...theme("figma:all-colors") }),
  "backgroundColor": ({ theme }) => ({ ...theme("colors"), ...theme("figma:fill-color") }),
  "gradientColorStops": ({ theme }) => ({ ...theme("colors"), ...theme("figma:fill-color") }),
  "textColor": ({ theme }) => ({ ...theme("colors"), ...theme("figma:text-color") }),
  "textDecorationColor": ({ theme }) => ({ ...theme("colors"), ...theme("figma:text-color") }),
  "caretColor": ({ theme }) => ({ ...theme("colors"), ...theme("figma:text-color") }),
  "placeholderColor": ({ theme }) => ({ ...theme("colors"), ...theme("figma:text-color") }),
  "borderRadius": ({ theme }) => ({ ...theme("figma:radius") }),
  "padding": ({ theme }) => ({ ...theme("spacing"), ...theme("figma:gap") }),
  "gap": ({ theme }) => ({ ...theme("spacing"), ...theme("figma:gap") }),
  "space": ({ theme }) => ({ ...theme("spacing"), ...theme("figma:gap") }),
  "scrollMargin": ({ theme }) => ({ ...theme("spacing"), ...theme("figma:gap") }),
  "scrollPadding": ({ theme }) => ({ ...theme("spacing"), ...theme("figma:gap") }),
  "borderSpacing": ({ theme }) => ({ ...theme("spacing"), ...theme("figma:gap") }),
  "strokeWidth": ({ theme }) => ({ ...theme("figma:stroke-width") }),
  "outlineWidth": ({ theme }) => ({ ...theme("figma:stroke-width") }),
  "borderWidth": ({ theme }) => ({
    ...theme("figma:stroke-width"),
    "DEFAULT": "1px",
  }),
  "ringWidth": ({ theme }) => ({
    ...theme("figma:stroke-width"),
    "DEFAULT": "3px",
  }),
  "fontFamily": ({ theme }) => ({ ...theme("figma:font-family") }),
  "fontSize": ({ theme }) => ({ ...theme("figma:font-size") }),
  "letterSpacing": ({ theme }) => ({ ...theme("figma:letter-spacing") }),
  "fontWeight": ({ theme }) => ({ ...theme("figma:font-weight") }),
};

const cssConfig = {
  ":root, .palette-colored": {
    "--palette-red-red-50": "255 230 241",
    "--palette-red-red-100": "255 176 210",
    "--palette-red-red-200": "255 138 188",
    "--palette-red-red-300": "255 84 158",
    "--palette-red-red-400": "255 51 139",
    "--palette-red-red-500": "255 0 110",
    "--palette-red-red-600": "232 0 100",
    "--palette-red-red-700": "181 0 78",
    "--palette-red-red-800": "140 0 61",
    "--palette-red-red-900": "107 0 46",
    "--palette-violet-violet-50": "247 243 247",
    "--palette-violet-violet-100": "232 221 233",
    "--palette-violet-violet-200": "198 163 246",
    "--palette-violet-violet-300": "172 122 242",
    "--palette-violet-violet-400": "156 96 240",
    "--palette-violet-violet-500": "131 56 236",
    "--palette-violet-violet-600": "119 51 215",
    "--palette-violet-violet-700": "93 40 168",
    "--palette-violet-violet-800": "72 31 130",
    "--palette-violet-violet-900": "55 24 99",
    "--palette-blue-blue-50": "235 243 255",
    "--palette-blue-blue-100": "194 217 255",
    "--palette-blue-blue-200": "164 199 255",
    "--palette-blue-blue-300": "122 174 255",
    "--palette-blue-blue-400": "97 158 255",
    "--palette-blue-blue-500": "57 134 255",
    "--palette-blue-blue-600": "52 122 232",
    "--palette-blue-blue-700": "40 95 181",
    "--palette-blue-blue-800": "31 74 140",
    "--palette-blue-blue-900": "24 56 107",
    "--palette-neutral-neutral-100": "248 246 248",
    "--palette-red-red-50-1s-64": "255 230 241",
    "--palette-neutral-neutral-100-1s-64": "248 246 248",
    "--palette-neutral-neutral-900": "55 24 99",
    "--palette-neutral-neutral-900-1s-64": "55 24 99",
    "--palette-violet-violet-50-1s-64": "247 243 247",
    "--palette-blue-blue-50-1s-64": "235 243 255",
    "--palette-yellow-yellow-50": "255 249 231",
    "--palette-yellow-yellow-100": "255 235 180",
    "--palette-yellow-yellow-200": "255 225 143",
    "--palette-yellow-yellow-300": "255 211 92",
    "--palette-yellow-yellow-400": "255 203 61",
    "--palette-yellow-yellow-500": "255 190 12",
    "--palette-yellow-yellow-600": "232 173 11",
    "--palette-yellow-yellow-700": "181 135 9",
    "--palette-yellow-yellow-800": "140 105 7",
    "--palette-yellow-yellow-900": "107 80 5",
    "--palette-orange-orange-50": "255 238 230",
    "--palette-orange-orange-100": "254 203 178",
    "--palette-orange-orange-200": "253 177 141",
    "--palette-orange-orange-300": "252 142 89",
    "--palette-orange-orange-400": "252 120 57",
    "--palette-orange-orange-500": "251 86 7",
    "--palette-orange-orange-600": "228 78 6",
    "--palette-orange-orange-700": "178 61 5",
    "--palette-orange-orange-800": "138 47 4",
    "--palette-orange-orange-900": "105 36 3",
    "--palette-neutral-neutral-900-1s-16": "55 24 99",
    "--palette-neutral-neutral-50": "253 252 253"
  },
  ":root, .scheme-light": {
    "--scheme-surface": "var(--palette-neutral-neutral-100, 248 246 248)",
    "--scheme-on-surface": "var(--palette-neutral-neutral-900, 55 24 99)",
    "--scheme-primary-container": "var(--palette-violet-violet-50, 247 243 247)",
    "--scheme-secondary-container-variant": "var(--palette-blue-blue-100, 194 217 255)",
    "--scheme-tertiary-variant": "var(--palette-orange-orange-400, 252 120 57)",
    "--scheme-tertiary-container-variant": "var(--palette-orange-orange-100, 254 203 178)",
    "--scheme-on-primary": "var(--palette-violet-violet-50, 247 243 247)",
    "--scheme-on-secondary": "var(--palette-blue-blue-50, 235 243 255)",
    "--scheme-on-tertiary": "var(--palette-orange-orange-50, 255 238 230)",
    "--scheme-primary": "var(--palette-violet-violet-500, 131 56 236)",
    "--scheme-secondary": "var(--palette-blue-blue-500, 57 134 255)",
    "--scheme-tertiary": "var(--palette-orange-orange-500, 251 86 7)",
    "--scheme-container": "var(--palette-neutral-neutral-50, 253 252 253)",
    "--scheme-on-container": "var(--palette-neutral-neutral-900, 55 24 99)",
    "--scheme-primary-container-variant": "var(--palette-violet-violet-100, 232 221 233)",
    "--scheme-on-primary-container": "var(--palette-neutral-neutral-900, 55 24 99)",
    "--scheme-on-secondary-container": "var(--palette-neutral-neutral-900, 55 24 99)",
    "--scheme-secondary-container": "var(--palette-blue-blue-50, 235 243 255)",
    "--scheme-tertiary-container": "var(--palette-orange-orange-50, 255 238 230)",
    "--scheme-on-tertiary-container": "var(--palette-neutral-neutral-900, 55 24 99)",
    "--scheme-secondary-variant": "var(--palette-blue-blue-400, 97 158 255)",
    "--scheme-primary-variant": "var(--palette-violet-violet-400, 156 96 240)"
  },
  ":root, .density-regular": {
    "--density-size-content-max-width": "45rem",
    "--density-space-xs": "0.25rem",
    "--density-space-sm": "0.75rem",
    "--density-space-md": "2rem",
    "--density-space-lg": "4rem",
    "--density-space-xl": "8rem",
    "--density-radius-md": "0.75rem",
    "--density-radius-full": "624.9375rem",
    "--density-radius-sm": "0.5rem",
    "--density-radius-xs": "0.25rem",
    "--density-stroke-regular": "2px",
    "--density-size-input-height": "3rem"
  },
  ":root, .typography-regular": {
    "--typography-heading-font-family": "Outfit",
    "--typography-headline-font-family": "Koulen",
    "--typography-code-font-family": "\"Oxygen Mono\"",
    "--typography-headline-font-size": "1.25rem",
    "--typography-heading-font-size": "2.5rem",
    "--typography-body-medium-font-size": "1rem",
    "--typography-code-font-size": "0.875rem",
    "--typography-headline-line-height": "1.5rem",
    "--typography-heading-line-height": "3rem",
    "--typography-code-line-height": "1rem",
    "--typography-body-medium-line-height": "1.25rem",
    "--typography-body-medium-font-family": "Outfit",
    "--typography-label-medium-font-family": "Outfit",
    "--typography-label-medium-font-size": "1rem",
    "--typography-label-medium-line-height": "1.25rem",
    "--typography-headline-letter-spacing": "1px",
    "--typography-heading-font-weight": "var(--typography-font-weight-bold, 800)",
    "--typography-font-weight-bold": "800",
    "--typography-letter-spacing-wide": "0.25px",
    "--typography-body-small-font-size": "0.875rem",
    "--typography-body-small-line-height": "1rem",
    "--typography-body-small-font-family": "Outfit",
    "--typography-font-weight-light": "300",
    "--typography-label-small-font-family": "Outfit",
    "--typography-label-small-font-size": "0.875rem",
    "--typography-label-small-line-height": "1rem",
    "--typography-body-small-font-weight": "var(--typography-font-weight-light, 300)",
    "--typography-label-small-letter-spacing": "var(--typography-letter-spacing-wide, 0.25px)"
  }
};

const fig2twPlugin = plugin(
  ({ addBase }) => addBase(cssConfig),
  { theme: twConfig }
);

export default fig2twPlugin;
