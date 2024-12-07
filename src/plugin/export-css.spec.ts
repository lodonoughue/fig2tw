import { fixtures } from "@common/fixtures";
import { describe, expect, it, vi } from "vitest";
import { exportCss } from "./export-css";
import { loadVariables } from "./variables";

vi.mock("@plugin/variables", async importOriginal => {
  const original = await importOriginal<typeof import("@plugin/variables")>();
  vi.spyOn(original, "loadVariables");
  return original;
});

describe("exportCss", () => {
  it("should export color variables", async () => {
    const config = fixtures.createConfig({ rootSelector: ":root" });
    vi.mocked(loadVariables).mockResolvedValue([
      fixtures.createColorVariable({
        key: "Color/Primary",
        valuesByMode: {
          light: fixtures.createColorValue({ value: { hex: "#800000" } }),
          dark: fixtures.createColorValue({ value: { hex: "#c00000" } }),
        },
      }),
      fixtures.createColorVariable({
        key: "Color/Secondary",
        valuesByMode: {
          light: fixtures.createColorValue({ value: { hex: "#008000" } }),
          dark: fixtures.createColorValue({ value: { hex: "#00c000" } }),
        },
      }),
    ]);

    const result = await exportCss(config);
    expect(result).toMatchInlineSnapshot(`
      ":root, .color-light {
        --color-primary: #800000;
        --color-secondary: #008000;
      }
      .color-dark {
        --color-primary: #c00000;
        --color-secondary: #00c000;
      }"
    `);
  });

  it("should export string variables", async () => {
    const config = fixtures.createConfig({ rootSelector: "html" });
    vi.mocked(loadVariables).mockResolvedValue([
      fixtures.createStringVariable({
        key: "String/Font Family",
        valuesByMode: {
          regular: fixtures.createStringValue({ value: "Arial" }),
          comic: fixtures.createStringValue({ value: "Comic Sans" }),
        },
      }),
    ]);

    const result = await exportCss(config);
    expect(result).toMatchInlineSnapshot(`
      "html, .string-regular {
        --string-font-family: Arial;
      }
      .string-comic {
        --string-font-family: "Comic Sans";
      }"
    `);
  });

  it("should export number variables (em)", async () => {
    const config = fixtures.createConfig({
      baseFontSize: 12,
      units: fixtures.createUnitsConfig({ "all-numbers": "em" }),
    });
    vi.mocked(loadVariables).mockResolvedValue([
      fixtures.createNumberVariable({
        key: "Number/All Numbers",
        scopes: ["all-numbers"],
        valuesByMode: {
          regular: fixtures.createNumberValue({ value: 24 }),
          condensed: fixtures.createNumberValue({ value: 18 }),
        },
      }),
    ]);

    const result = await exportCss(config);
    expect(result).toMatchInlineSnapshot(`
      ":root, .number-regular {
        --number-all-numbers: 2em;
      }
      .number-condensed {
        --number-all-numbers: 1.5em;
      }"
    `);
  });

  it("should export number variables (rem)", async () => {
    const config = fixtures.createConfig({
      baseFontSize: 16,
      units: fixtures.createUnitsConfig({ "font-size": "rem" }),
    });
    vi.mocked(loadVariables).mockResolvedValue([
      fixtures.createNumberVariable({
        key: "Number/Font Size",
        scopes: ["font-size"],
        valuesByMode: {
          regular: fixtures.createNumberValue({ value: 16 }),
          condensed: fixtures.createNumberValue({ value: 12 }),
        },
      }),
    ]);

    const result = await exportCss(config);
    expect(result).toMatchInlineSnapshot(`
      ":root, .number-regular {
        --number-font-size: 1rem;
      }
      .number-condensed {
        --number-font-size: 0.75rem;
      }"
    `);
  });

  it("should export number variables (px)", async () => {
    const config = fixtures.createConfig({
      units: fixtures.createUnitsConfig({ radius: "px" }),
    });
    vi.mocked(loadVariables).mockResolvedValue([
      fixtures.createNumberVariable({
        key: "Number/Radius",
        scopes: ["radius"],
        valuesByMode: {
          regular: fixtures.createNumberValue({ value: 8 }),
          condensed: fixtures.createNumberValue({ value: 4 }),
        },
      }),
    ]);

    const result = await exportCss(config);
    expect(result).toMatchInlineSnapshot(`
      ":root, .number-regular {
        --number-radius: 8px;
      }
      .number-condensed {
        --number-radius: 4px;
      }"
    `);
  });

  it("should export number variables (no-unit)", async () => {
    const config = fixtures.createConfig({
      units: fixtures.createUnitsConfig({ "font-weight": "none" }),
    });
    vi.mocked(loadVariables).mockResolvedValue([
      fixtures.createNumberVariable({
        key: "Number/Font Weight",
        scopes: ["font-weight"],
        valuesByMode: {
          regular: fixtures.createNumberValue({ value: 500 }),
          condensed: fixtures.createNumberValue({ value: 600 }),
        },
      }),
    ]);

    const result = await exportCss(config);
    expect(result).toMatchInlineSnapshot(`
      ":root, .number-regular {
        --number-font-weight: 500;
      }
      .number-condensed {
        --number-font-weight: 600;
      }"
    `);
  });

  it("should not export boolean variables", async () => {
    const config = fixtures.createConfig();
    vi.mocked(loadVariables).mockResolvedValue([
      fixtures.createBooleanVariable({
        key: "Boolean/Falsy",
        valuesByMode: {
          regular: fixtures.createBooleanValue({ value: false }),
        },
      }),
    ]);

    const result = await exportCss(config);
    expect(result).toMatchInlineSnapshot(`""`);
  });

  it("should export alias values (with default value)", async () => {
    const config = fixtures.createConfig({ hasDefaultValues: true });
    vi.mocked(loadVariables).mockResolvedValue([
      fixtures.createColorVariable({
        key: "Color/Alias",
        defaultValue: fixtures.createColorValue({ value: { hex: "#ff0000" } }),
        valuesByMode: {
          light: fixtures.createAliasValue({ value: { key: "Color/Target" } }),
          dark: fixtures.createAliasValue({ value: { key: "Color/Target" } }),
        },
      }),
    ]);

    const result = await exportCss(config);
    expect(result).toMatchInlineSnapshot(`
      ":root, .color-light {
        --color-alias: var(--color-target, #ff0000);
      }
      .color-dark {
        --color-alias: var(--color-target, #ff0000);
      }"
    `);
  });

  it("should export alias values (without default value)", async () => {
    const config = fixtures.createConfig({ hasDefaultValues: false });
    vi.mocked(loadVariables).mockResolvedValue([
      fixtures.createColorVariable({
        key: "Color/Alias",
        defaultValue: fixtures.createColorValue({ value: { hex: "#ff0000" } }),
        valuesByMode: {
          light: fixtures.createAliasValue({ value: { key: "Color/Target" } }),
          dark: fixtures.createAliasValue({ value: { key: "Color/Target" } }),
        },
      }),
    ]);

    const result = await exportCss(config);
    expect(result).toMatchInlineSnapshot(`
      ":root, .color-light {
        --color-alias: var(--color-target);
      }
      .color-dark {
        --color-alias: var(--color-target);
      }"
    `);
  });

  it("should export all collections", async () => {
    const config = fixtures.createConfig({ hasDefaultValues: false });
    const colorCollection = fixtures.createCollection({
      name: "Color",
      modes: ["light", "dark"],
    });
    const numberCollection = fixtures.createCollection({
      name: "Number",
      modes: ["regular", "condensed"],
    });
    vi.mocked(loadVariables).mockResolvedValue([
      fixtures.createColorVariable({
        name: "Primary",
        collection: colorCollection,
        valuesByMode: {
          light: fixtures.createColorValue({ value: { hex: "#800000" } }),
          dark: fixtures.createColorValue({ value: { hex: "#c00000" } }),
        },
      }),
      fixtures.createNumberVariable({
        name: "Radius",
        collection: numberCollection,
        valuesByMode: {
          regular: fixtures.createNumberValue({ value: 42 }),
          condensed: fixtures.createNumberValue({ value: 24 }),
        },
      }),
    ]);

    const result = await exportCss(config);
    expect(result).toMatchInlineSnapshot(`
      ":root, .color-light {
        --color-primary: #800000;
      }
      .color-dark {
        --color-primary: #c00000;
      }
      :root, .number-regular {
        --number-radius: 2.625rem;
      }
      .number-condensed {
        --number-radius: 1.5rem;
      }"
    `);
  });
});
