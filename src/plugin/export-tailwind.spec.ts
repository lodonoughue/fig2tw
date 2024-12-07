import { fixtures } from "@common/fixtures";
import { loadVariables } from "@plugin/variables";
import { describe, expect, it, vi } from "vitest";
import { exportTailwind } from "./export-tailwind";
import { ColorScope, NumberScope } from "@common/variables";

vi.mock("@plugin/variables", async importOriginal => {
  const original = await importOriginal<typeof import("@plugin/variables")>();
  vi.spyOn(original, "loadVariables");
  return original;
});

describe("exportTailwind (colors)", () => {
  const config = fixtures.createConfig();

  function createColorVariables(scopes: ColorScope[]) {
    return [
      fixtures.createColorVariable({
        key: "Color/Primary",
        scopes,
        valuesByMode: {
          light: fixtures.createColorValue({ value: { hex: "#800000" } }),
          dark: fixtures.createColorValue({ value: { hex: "#c00000" } }),
        },
      }),
      fixtures.createColorVariable({
        key: "Color/Secondary",
        scopes,
        valuesByMode: {
          light: fixtures.createColorValue({ value: { hex: "#008000" } }),
          dark: fixtures.createColorValue({ value: { hex: "#00c000" } }),
        },
      }),
    ];
  }

  it("should export all-colors colors", async () => {
    const variables = createColorVariables(["all-colors"]);
    vi.mocked(loadVariables).mockResolvedValue(variables);

    const result = await exportTailwind(config);
    expect(result).toMatchInlineSnapshot(`
      "import plugin from "tailwindcss/plugin.js";

      const figConfig = {
        "figma:all-colors": {
          "primary": "rgb(var(--color-primary, 128 0 0) / <alpha-value>)",
          "secondary": "rgb(var(--color-secondary, 0 128 0) / <alpha-value>)"
        }
      };

      const twConfig = {
        ...figConfig,
        "extends": {
        },
        "colors": ({ theme }) => ({ ...theme("figma:all-colors") }),
      };

      const cssConfig = {
        ":root, .color-light": {
          "--color-primary": "128 0 0",
          "--color-secondary": "0 128 0"
        },
        ".color-dark": {
          "--color-primary": "192 0 0",
          "--color-secondary": "0 192 0"
        }
      };

      const fig2twPlugin = plugin(
        ({ addBase }) => addBase(cssConfig),
        { theme: twConfig }
      );

      export default fig2twPlugin;
      "
    `);
  });

  it("should export fill-color colors", async () => {
    const variables = createColorVariables(["fill-color"]);
    vi.mocked(loadVariables).mockResolvedValue(variables);

    const result = await exportTailwind(config);
    expect(result).toMatchInlineSnapshot(`
      "import plugin from "tailwindcss/plugin.js";

      const figConfig = {
        "figma:fill-color": {
          "primary": "rgb(var(--color-primary, 128 0 0) / <alpha-value>)",
          "secondary": "rgb(var(--color-secondary, 0 128 0) / <alpha-value>)"
        }
      };

      const twConfig = {
        ...figConfig,
        "extends": {
          "fill": ({ theme }) => ({ ...theme("figma:fill-color") }),
          "accentColor": ({ theme }) => ({ ...theme("figma:fill-color") }),
        },
        "backgroundColor": ({ theme }) => ({ ...theme("colors"), ...theme("figma:fill-color") }),
        "gradientColorStops": ({ theme }) => ({ ...theme("colors"), ...theme("figma:fill-color") }),
      };

      const cssConfig = {
        ":root, .color-light": {
          "--color-primary": "128 0 0",
          "--color-secondary": "0 128 0"
        },
        ".color-dark": {
          "--color-primary": "192 0 0",
          "--color-secondary": "0 192 0"
        }
      };

      const fig2twPlugin = plugin(
        ({ addBase }) => addBase(cssConfig),
        { theme: twConfig }
      );

      export default fig2twPlugin;
      "
    `);
  });

  it("should export stroke-color colors", async () => {
    const variables = createColorVariables(["stroke-color"]);
    vi.mocked(loadVariables).mockResolvedValue(variables);

    const result = await exportTailwind(config);
    expect(result).toMatchInlineSnapshot(`
      "import plugin from "tailwindcss/plugin.js";

      const figConfig = {
        "figma:stroke-color": {
          "primary": "rgb(var(--color-primary, 128 0 0) / <alpha-value>)",
          "secondary": "rgb(var(--color-secondary, 0 128 0) / <alpha-value>)"
        }
      };

      const twConfig = {
        ...figConfig,
        "extends": {
          "stroke": ({ theme }) => ({ ...theme("figma:stroke-color") }),
        },
        "borderColor": ({ theme }) => ({ ...theme("colors"), ...theme("figma:stroke-color") }),
        "ringColor": ({ theme }) => ({ ...theme("colors"), ...theme("figma:stroke-color") }),
        "ringOffsetColor": ({ theme }) => ({ ...theme("colors"), ...theme("figma:stroke-color") }),
        "outlineColor": ({ theme }) => ({ ...theme("colors"), ...theme("figma:stroke-color") }),
      };

      const cssConfig = {
        ":root, .color-light": {
          "--color-primary": "128 0 0",
          "--color-secondary": "0 128 0"
        },
        ".color-dark": {
          "--color-primary": "192 0 0",
          "--color-secondary": "0 192 0"
        }
      };

      const fig2twPlugin = plugin(
        ({ addBase }) => addBase(cssConfig),
        { theme: twConfig }
      );

      export default fig2twPlugin;
      "
    `);
  });

  it("should export text-color colors", async () => {
    const variables = createColorVariables(["text-color"]);
    vi.mocked(loadVariables).mockResolvedValue(variables);

    const result = await exportTailwind(config);
    expect(result).toMatchInlineSnapshot(`
      "import plugin from "tailwindcss/plugin.js";

      const figConfig = {
        "figma:text-color": {
          "primary": "rgb(var(--color-primary, 128 0 0) / <alpha-value>)",
          "secondary": "rgb(var(--color-secondary, 0 128 0) / <alpha-value>)"
        }
      };

      const twConfig = {
        ...figConfig,
        "extends": {
        },
        "textColor": ({ theme }) => ({ ...theme("colors"), ...theme("figma:text-color") }),
        "textDecorationColor": ({ theme }) => ({ ...theme("colors"), ...theme("figma:text-color") }),
        "caretColor": ({ theme }) => ({ ...theme("colors"), ...theme("figma:text-color") }),
        "placeholderColor": ({ theme }) => ({ ...theme("colors"), ...theme("figma:text-color") }),
      };

      const cssConfig = {
        ":root, .color-light": {
          "--color-primary": "128 0 0",
          "--color-secondary": "0 128 0"
        },
        ".color-dark": {
          "--color-primary": "192 0 0",
          "--color-secondary": "0 192 0"
        }
      };

      const fig2twPlugin = plugin(
        ({ addBase }) => addBase(cssConfig),
        { theme: twConfig }
      );

      export default fig2twPlugin;
      "
    `);
  });

  it("should export effect-color colors", async () => {
    const variables = createColorVariables(["effect-color"]);
    vi.mocked(loadVariables).mockResolvedValue(variables);

    const result = await exportTailwind(config);
    expect(result).toMatchInlineSnapshot(`
      "import plugin from "tailwindcss/plugin.js";

      const figConfig = {
        "figma:effect-color": {
          "primary": "rgb(var(--color-primary, 128 0 0) / <alpha-value>)",
          "secondary": "rgb(var(--color-secondary, 0 128 0) / <alpha-value>)"
        }
      };

      const twConfig = {
        ...figConfig,
        "extends": {
        },
        "boxShadowColor": ({ theme }) => ({ ...theme("colors"), ...theme("figma:effect-color") }),
      };

      const cssConfig = {
        ":root, .color-light": {
          "--color-primary": "128 0 0",
          "--color-secondary": "0 128 0"
        },
        ".color-dark": {
          "--color-primary": "192 0 0",
          "--color-secondary": "0 192 0"
        }
      };

      const fig2twPlugin = plugin(
        ({ addBase }) => addBase(cssConfig),
        { theme: twConfig }
      );

      export default fig2twPlugin;
      "
    `);
  });
});

describe("exportTailwind (numbers)", () => {
  const config = fixtures.createConfig();

  function createNumberVariables(scopes: NumberScope[]) {
    return [
      fixtures.createNumberVariable({
        key: "Number/Small",
        scopes,
        valuesByMode: {
          regular: fixtures.createNumberValue({ value: 8 }),
          condensed: fixtures.createNumberValue({ value: 4 }),
        },
      }),
      fixtures.createNumberVariable({
        key: "Number/Medium",
        scopes,
        valuesByMode: {
          regular: fixtures.createNumberValue({ value: 16 }),
          condensed: fixtures.createNumberValue({ value: 12 }),
        },
      }),
    ];
  }

  it("should export all-numbers numbers", async () => {
    const variables = createNumberVariables(["all-numbers"]);
    vi.mocked(loadVariables).mockResolvedValue(variables);

    const result = await exportTailwind(config);
    expect(result).toMatchInlineSnapshot(`
      "import plugin from "tailwindcss/plugin.js";

      const figConfig = {
        "figma:all-numbers": {
          "small": "var(--number-small, 0.5rem)",
          "medium": "var(--number-medium, 1rem)"
        }
      };

      const twConfig = {
        ...figConfig,
        "extends": {
          "spacing": ({ theme }) => ({ ...theme("figma:all-numbers") }),
        },
      };

      const cssConfig = {
        ":root, .number-regular": {
          "--number-small": "0.5rem",
          "--number-medium": "1rem"
        },
        ".number-condensed": {
          "--number-small": "0.25rem",
          "--number-medium": "0.75rem"
        }
      };

      const fig2twPlugin = plugin(
        ({ addBase }) => addBase(cssConfig),
        { theme: twConfig }
      );

      export default fig2twPlugin;
      "
    `);
  });

  it("should export radius numbers", async () => {
    const variables = createNumberVariables(["radius"]);
    vi.mocked(loadVariables).mockResolvedValue(variables);

    const result = await exportTailwind(config);
    expect(result).toMatchInlineSnapshot(`
      "import plugin from "tailwindcss/plugin.js";

      const figConfig = {
        "figma:radius": {
          "small": "var(--number-small, 0.5rem)",
          "medium": "var(--number-medium, 1rem)"
        }
      };

      const twConfig = {
        ...figConfig,
        "extends": {
        },
        "borderRadius": ({ theme }) => ({ ...theme("figma:radius") }),
      };

      const cssConfig = {
        ":root, .number-regular": {
          "--number-small": "0.5rem",
          "--number-medium": "1rem"
        },
        ".number-condensed": {
          "--number-small": "0.25rem",
          "--number-medium": "0.75rem"
        }
      };

      const fig2twPlugin = plugin(
        ({ addBase }) => addBase(cssConfig),
        { theme: twConfig }
      );

      export default fig2twPlugin;
      "
    `);
  });

  it("should export gap numbers", async () => {
    const variables = createNumberVariables(["gap"]);
    vi.mocked(loadVariables).mockResolvedValue(variables);

    const result = await exportTailwind(config);
    expect(result).toMatchInlineSnapshot(`
      "import plugin from "tailwindcss/plugin.js";

      const figConfig = {
        "figma:gap": {
          "small": "var(--number-small, 0.5rem)",
          "medium": "var(--number-medium, 1rem)"
        }
      };

      const twConfig = {
        ...figConfig,
        "extends": {
          "margin": ({ theme }) => ({ ...theme("figma:gap") }),
          "inset": ({ theme }) => ({ ...theme("figma:gap") }),
        },
        "padding": ({ theme }) => ({ ...theme("spacing"), ...theme("figma:gap") }),
        "gap": ({ theme }) => ({ ...theme("spacing"), ...theme("figma:gap") }),
        "space": ({ theme }) => ({ ...theme("spacing"), ...theme("figma:gap") }),
        "scrollMargin": ({ theme }) => ({ ...theme("spacing"), ...theme("figma:gap") }),
        "scrollPadding": ({ theme }) => ({ ...theme("spacing"), ...theme("figma:gap") }),
        "borderSpacing": ({ theme }) => ({ ...theme("spacing"), ...theme("figma:gap") }),
      };

      const cssConfig = {
        ":root, .number-regular": {
          "--number-small": "0.5rem",
          "--number-medium": "1rem"
        },
        ".number-condensed": {
          "--number-small": "0.25rem",
          "--number-medium": "0.75rem"
        }
      };

      const fig2twPlugin = plugin(
        ({ addBase }) => addBase(cssConfig),
        { theme: twConfig }
      );

      export default fig2twPlugin;
      "
    `);
  });

  it("should export stroke-width numbers", async () => {
    const variables = createNumberVariables(["stroke-width"]);
    vi.mocked(loadVariables).mockResolvedValue(variables);

    const result = await exportTailwind(config);
    expect(result).toMatchInlineSnapshot(`
      "import plugin from "tailwindcss/plugin.js";

      const figConfig = {
        "figma:stroke-width": {
          "small": "var(--number-small, 8px)",
          "medium": "var(--number-medium, 16px)"
        }
      };

      const twConfig = {
        ...figConfig,
        "extends": {
        },
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
      };

      const cssConfig = {
        ":root, .number-regular": {
          "--number-small": "8px",
          "--number-medium": "16px"
        },
        ".number-condensed": {
          "--number-small": "4px",
          "--number-medium": "12px"
        }
      };

      const fig2twPlugin = plugin(
        ({ addBase }) => addBase(cssConfig),
        { theme: twConfig }
      );

      export default fig2twPlugin;
      "
    `);
  });

  it("should export size numbers", async () => {
    const variables = createNumberVariables(["size"]);
    vi.mocked(loadVariables).mockResolvedValue(variables);

    const result = await exportTailwind(config);
    expect(result).toMatchInlineSnapshot(`
      "import plugin from "tailwindcss/plugin.js";

      const figConfig = {
        "figma:size": {
          "small": "var(--number-small, 0.5rem)",
          "medium": "var(--number-medium, 1rem)"
        }
      };

      const twConfig = {
        ...figConfig,
        "extends": {
          "size": ({ theme }) => ({ ...theme("figma:size") }),
          "width": ({ theme }) => ({ ...theme("figma:size") }),
          "minWidth": ({ theme }) => ({ ...theme("figma:size") }),
          "maxWidth": ({ theme }) => ({ ...theme("figma:size") }),
          "height": ({ theme }) => ({ ...theme("figma:size") }),
          "minHeight": ({ theme }) => ({ ...theme("figma:size") }),
          "maxHeight": ({ theme }) => ({ ...theme("figma:size") }),
        },
      };

      const cssConfig = {
        ":root, .number-regular": {
          "--number-small": "0.5rem",
          "--number-medium": "1rem"
        },
        ".number-condensed": {
          "--number-small": "0.25rem",
          "--number-medium": "0.75rem"
        }
      };

      const fig2twPlugin = plugin(
        ({ addBase }) => addBase(cssConfig),
        { theme: twConfig }
      );

      export default fig2twPlugin;
      "
    `);
  });
});

describe("exportTailwind (typography)", () => {
  const config = fixtures.createConfig();

  it("should export font-size simple config", async () => {
    vi.mocked(loadVariables).mockResolvedValue([
      fixtures.createNumberVariable({
        key: "Number/Title",
        scopes: ["font-size"],
        valuesByMode: {
          regular: fixtures.createNumberValue({ value: 36 }),
        },
      }),
    ]);

    const result = await exportTailwind(config);
    expect(result).toMatchInlineSnapshot(`
      "import plugin from "tailwindcss/plugin.js";

      const figConfig = {
        "figma:font-size": {
          "title": "var(--number-title, 2.25rem)"
        }
      };

      const twConfig = {
        ...figConfig,
        "extends": {
        },
        "fontSize": ({ theme }) => ({ ...theme("figma:font-size") }),
      };

      const cssConfig = {
        ":root, .number-regular": {
          "--number-title": "2.25rem"
        }
      };

      const fig2twPlugin = plugin(
        ({ addBase }) => addBase(cssConfig),
        { theme: twConfig }
      );

      export default fig2twPlugin;
      "
    `);
  });

  it("should export font-size array config", async () => {
    vi.mocked(loadVariables).mockResolvedValue([
      fixtures.createNumberVariable({
        key: "Number/Title/Font Size",
        scopes: ["font-size"],
        valuesByMode: {
          regular: fixtures.createNumberValue({ value: 36 }),
        },
      }),
      fixtures.createNumberVariable({
        key: "Number/Title/Line Height",
        scopes: ["line-height"],
        valuesByMode: {
          regular: fixtures.createNumberValue({ value: 42 }),
        },
      }),
    ]);

    const result = await exportTailwind(config);
    expect(result).toMatchInlineSnapshot(`
      "import plugin from "tailwindcss/plugin.js";

      const figConfig = {
        "figma:font-size": {
          "title": [
            "var(--number-title-font-size, 2.25rem)",
            "var(--number-title-line-height, 2.625rem)"
          ]
        }
      };

      const twConfig = {
        ...figConfig,
        "extends": {
        },
        "fontSize": ({ theme }) => ({ ...theme("figma:font-size") }),
      };

      const cssConfig = {
        ":root, .number-regular": {
          "--number-title-font-size": "2.25rem",
          "--number-title-line-height": "2.625rem"
        }
      };

      const fig2twPlugin = plugin(
        ({ addBase }) => addBase(cssConfig),
        { theme: twConfig }
      );

      export default fig2twPlugin;
      "
    `);
  });

  it("should export font-size object config (font-size, line-height, letter-spacing)", async () => {
    vi.mocked(loadVariables).mockResolvedValue([
      fixtures.createNumberVariable({
        key: "Number/Title/Font Size",
        scopes: ["font-size"],
        valuesByMode: {
          regular: fixtures.createNumberValue({ value: 36 }),
        },
      }),
      fixtures.createNumberVariable({
        key: "Number/Title/Line Height",
        scopes: ["line-height"],
        valuesByMode: {
          regular: fixtures.createNumberValue({ value: 42 }),
        },
      }),
      fixtures.createNumberVariable({
        key: "Number/Title/Letter Spacing",
        scopes: ["letter-spacing"],
        valuesByMode: {
          regular: fixtures.createNumberValue({ value: 2 }),
        },
      }),
    ]);

    const result = await exportTailwind(config);
    expect(result).toMatchInlineSnapshot(`
      "import plugin from "tailwindcss/plugin.js";

      const figConfig = {
        "figma:font-size": {
          "title": [
            "var(--number-title-font-size, 2.25rem)",
            {
              "lineHeight": "var(--number-title-line-height, 2.625rem)",
              "letterSpacing": "var(--number-title-letter-spacing, 2px)"
            }
          ]
        }
      };

      const twConfig = {
        ...figConfig,
        "extends": {
        },
        "fontSize": ({ theme }) => ({ ...theme("figma:font-size") }),
      };

      const cssConfig = {
        ":root, .number-regular": {
          "--number-title-font-size": "2.25rem",
          "--number-title-line-height": "2.625rem",
          "--number-title-letter-spacing": "2px"
        }
      };

      const fig2twPlugin = plugin(
        ({ addBase }) => addBase(cssConfig),
        { theme: twConfig }
      );

      export default fig2twPlugin;
      "
    `);
  });

  it("should export font-size object config (font-size, font-weight)", async () => {
    vi.mocked(loadVariables).mockResolvedValue([
      fixtures.createNumberVariable({
        key: "Number/Title/Font Size",
        scopes: ["font-size"],
        valuesByMode: {
          regular: fixtures.createNumberValue({ value: 36 }),
        },
      }),
      fixtures.createNumberVariable({
        key: "Number/Title/Font Weight",
        scopes: ["font-weight"],
        valuesByMode: {
          regular: fixtures.createNumberValue({ value: 500 }),
        },
      }),
    ]);

    const result = await exportTailwind(config);
    expect(result).toMatchInlineSnapshot(`
      "import plugin from "tailwindcss/plugin.js";

      const figConfig = {
        "figma:font-size": {
          "title": [
            "var(--number-title-font-size, 2.25rem)",
            {
              "fontWeight": "var(--number-title-font-weight, 500)"
            }
          ]
        }
      };

      const twConfig = {
        ...figConfig,
        "extends": {
        },
        "fontSize": ({ theme }) => ({ ...theme("figma:font-size") }),
      };

      const cssConfig = {
        ":root, .number-regular": {
          "--number-title-font-size": "2.25rem",
          "--number-title-font-weight": "500"
        }
      };

      const fig2twPlugin = plugin(
        ({ addBase }) => addBase(cssConfig),
        { theme: twConfig }
      );

      export default fig2twPlugin;
      "
    `);
  });

  it("should export font-size object config (font-size, line-height, letter-spacing, font-weight)", async () => {
    vi.mocked(loadVariables).mockResolvedValue([
      fixtures.createNumberVariable({
        key: "Number/Title/Font Size",
        scopes: ["font-size"],
        valuesByMode: {
          regular: fixtures.createNumberValue({ value: 36 }),
        },
      }),
      fixtures.createNumberVariable({
        key: "Number/Title/Line Height",
        scopes: ["line-height"],
        valuesByMode: {
          regular: fixtures.createNumberValue({ value: 42 }),
        },
      }),
      fixtures.createNumberVariable({
        key: "Number/Title/Letter Spacing",
        scopes: ["letter-spacing"],
        valuesByMode: {
          regular: fixtures.createNumberValue({ value: 3 }),
        },
      }),
      fixtures.createNumberVariable({
        key: "Number/Title/Font Weight",
        scopes: ["font-weight"],
        valuesByMode: {
          regular: fixtures.createNumberValue({ value: 500 }),
        },
      }),
    ]);

    const result = await exportTailwind(config);
    expect(result).toMatchInlineSnapshot(`
      "import plugin from "tailwindcss/plugin.js";

      const figConfig = {
        "figma:font-size": {
          "title": [
            "var(--number-title-font-size, 2.25rem)",
            {
              "lineHeight": "var(--number-title-line-height, 2.625rem)",
              "letterSpacing": "var(--number-title-letter-spacing, 3px)",
              "fontWeight": "var(--number-title-font-weight, 500)"
            }
          ]
        }
      };

      const twConfig = {
        ...figConfig,
        "extends": {
        },
        "fontSize": ({ theme }) => ({ ...theme("figma:font-size") }),
      };

      const cssConfig = {
        ":root, .number-regular": {
          "--number-title-font-size": "2.25rem",
          "--number-title-line-height": "2.625rem",
          "--number-title-letter-spacing": "3px",
          "--number-title-font-weight": "500"
        }
      };

      const fig2twPlugin = plugin(
        ({ addBase }) => addBase(cssConfig),
        { theme: twConfig }
      );

      export default fig2twPlugin;
      "
    `);
  });

  it("should export line-height", async () => {
    vi.mocked(loadVariables).mockResolvedValue([
      fixtures.createNumberVariable({
        key: "Number/Title",
        scopes: ["line-height"],
        valuesByMode: {
          regular: fixtures.createNumberValue({ value: 36 }),
        },
      }),
    ]);

    const result = await exportTailwind(config);
    expect(result).toMatchInlineSnapshot(`
      "import plugin from "tailwindcss/plugin.js";

      const figConfig = {
        "figma:line-height": {
          "title": "var(--number-title, 2.25rem)"
        }
      };

      const twConfig = {
        ...figConfig,
        "extends": {
        },
        "lineHeight": ({ theme }) => ({ ...theme("figma:line-height") }),
      };

      const cssConfig = {
        ":root, .number-regular": {
          "--number-title": "2.25rem"
        }
      };

      const fig2twPlugin = plugin(
        ({ addBase }) => addBase(cssConfig),
        { theme: twConfig }
      );

      export default fig2twPlugin;
      "
    `);
  });

  it("should export letter-spacing", async () => {
    vi.mocked(loadVariables).mockResolvedValue([
      fixtures.createNumberVariable({
        key: "Number/Title",
        scopes: ["letter-spacing"],
        valuesByMode: {
          regular: fixtures.createNumberValue({ value: 2 }),
        },
      }),
    ]);

    const result = await exportTailwind(config);
    expect(result).toMatchInlineSnapshot(`
      "import plugin from "tailwindcss/plugin.js";

      const figConfig = {
        "figma:letter-spacing": {
          "title": "var(--number-title, 2px)"
        }
      };

      const twConfig = {
        ...figConfig,
        "extends": {
        },
        "letterSpacing": ({ theme }) => ({ ...theme("figma:letter-spacing") }),
      };

      const cssConfig = {
        ":root, .number-regular": {
          "--number-title": "2px"
        }
      };

      const fig2twPlugin = plugin(
        ({ addBase }) => addBase(cssConfig),
        { theme: twConfig }
      );

      export default fig2twPlugin;
      "
    `);
  });

  it("should export font-weight", async () => {
    vi.mocked(loadVariables).mockResolvedValue([
      fixtures.createNumberVariable({
        key: "Number/Title",
        scopes: ["font-weight"],
        valuesByMode: {
          regular: fixtures.createNumberValue({ value: 500 }),
        },
      }),
    ]);

    const result = await exportTailwind(config);
    expect(result).toMatchInlineSnapshot(`
      "import plugin from "tailwindcss/plugin.js";

      const figConfig = {
        "figma:font-weight": {
          "title": "var(--number-title, 500)"
        }
      };

      const twConfig = {
        ...figConfig,
        "extends": {
        },
        "fontWeight": ({ theme }) => ({ ...theme("figma:font-weight") }),
      };

      const cssConfig = {
        ":root, .number-regular": {
          "--number-title": "500"
        }
      };

      const fig2twPlugin = plugin(
        ({ addBase }) => addBase(cssConfig),
        { theme: twConfig }
      );

      export default fig2twPlugin;
      "
    `);
  });

  it("should export font-family", async () => {
    vi.mocked(loadVariables).mockResolvedValue([
      fixtures.createStringVariable({
        key: "Number/Title",
        scopes: ["font-family"],
        valuesByMode: {
          regular: fixtures.createStringValue({ value: "Comic Sans" }),
        },
      }),
    ]);

    const result = await exportTailwind(config);
    expect(result).toMatchInlineSnapshot(`
      "import plugin from "tailwindcss/plugin.js";

      const figConfig = {
        "figma:font-family": {
          "title": "var(--number-title, \\"Comic Sans\\")"
        }
      };

      const twConfig = {
        ...figConfig,
        "extends": {
        },
        "fontFamily": ({ theme }) => ({ ...theme("figma:font-family") }),
      };

      const cssConfig = {
        ":root, .number-regular": {
          "--number-title": "\\"Comic Sans\\""
        }
      };

      const fig2twPlugin = plugin(
        ({ addBase }) => addBase(cssConfig),
        { theme: twConfig }
      );

      export default fig2twPlugin;
      "
    `);
  });
});
