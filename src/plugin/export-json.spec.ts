import { fixtures } from "@common/fixtures";
import { describe, expect, it, vi } from "vitest";
import { loadVariables } from "./variables";
import { exportJson } from "./export-json";

vi.mock("@plugin/variables", async importOriginal => {
  const original = await importOriginal<typeof import("@plugin/variables")>();
  vi.spyOn(original, "loadVariables");
  return original;
});

describe.each([
  { config: fixtures.createConfig({ tabWidth: 4 }) },
  { config: fixtures.createConfig({ tabWidth: 2 }) },
])("exportJson (tabWidth=$config.tabWidth)", ({ config }) => {
  it("should export color variables", async () => {
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
      fixtures.createColorVariable({
        key: "Color/Tertiary",
        valuesByMode: {
          light: fixtures.createColorValue({ value: { hex: "#000080" } }),
          dark: fixtures.createColorValue({ value: { hex: "#0000c0" } }),
        },
      }),
      fixtures.createColorVariable({
        key: "Color/Alias",
        valuesByMode: {
          light: fixtures.createAliasValue({ value: { key: "Color/Primary" } }),
          dark: fixtures.createAliasValue({
            value: { key: "Color/Secondary" },
          }),
        },
      }),
    ]);

    const result = await exportJson(config);
    expect(result).toMatchSnapshot();
  });

  it("should export number variables", async () => {
    vi.mocked(loadVariables).mockResolvedValue([
      fixtures.createNumberVariable({
        key: "Number/Gap",
        scopes: ["gap"],
        valuesByMode: {
          regular: fixtures.createNumberValue({ value: 8 }),
          condensed: fixtures.createNumberValue({ value: 4 }),
        },
      }),
      fixtures.createNumberVariable({
        key: "Number/Radius",
        scopes: ["radius"],
        valuesByMode: {
          regular: fixtures.createNumberValue({ value: 16 }),
          condensed: fixtures.createNumberValue({ value: 12 }),
        },
      }),
      fixtures.createNumberVariable({
        key: "Number/Size",
        scopes: ["size"],
        valuesByMode: {
          regular: fixtures.createNumberValue({ value: 20 }),
          condensed: fixtures.createNumberValue({ value: 24 }),
        },
      }),
      fixtures.createNumberVariable({
        key: "Number/Alias",
        valuesByMode: {
          regular: fixtures.createAliasValue({
            value: { key: "Number/Radius" },
          }),
          condensed: fixtures.createAliasValue({
            value: { key: "Number/Size" },
          }),
        },
      }),
    ]);

    const result = await exportJson(config);
    expect(result).toMatchSnapshot();
  });

  it("should export string variables", async () => {
    vi.mocked(loadVariables).mockResolvedValue([
      fixtures.createStringVariable({
        key: "String/Font Family",
        scopes: ["font-family"],
        valuesByMode: {
          regular: fixtures.createStringValue({ value: "Arial" }),
          comic: fixtures.createStringValue({ value: "Comic Sans" }),
        },
      }),
      fixtures.createStringVariable({
        key: "String/Alias",
        valuesByMode: {
          regular: fixtures.createAliasValue({
            value: { key: "String/Target" },
          }),
          comic: fixtures.createAliasValue({ value: { key: "String/Target" } }),
        },
      }),
    ]);

    const result = await exportJson(config);
    expect(result).toMatchSnapshot();
  });

  it("should export boolean variables", async () => {
    vi.mocked(loadVariables).mockResolvedValue([
      fixtures.createBooleanVariable({
        key: "Boolean/Falsy",
        scopes: ["all-booleans"],
        valuesByMode: {
          true: fixtures.createBooleanValue({ value: false }),
          false: fixtures.createBooleanValue({ value: true }),
        },
      }),
      fixtures.createBooleanVariable({
        key: "Boolean/Alias",
        valuesByMode: {
          regular: fixtures.createAliasValue({
            value: { key: "Boolean/Target" },
          }),
          comic: fixtures.createAliasValue({
            value: { key: "Boolean/Target" },
          }),
        },
      }),
    ]);

    const result = await exportJson(config);
    expect(result).toMatchSnapshot();
  });
});
