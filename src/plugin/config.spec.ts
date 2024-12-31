import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { loadConfig, saveConfig } from "./config";
import { configFixtures } from "@common/config.fixtures";
import { Config } from "@common/config";

const fixtures = { ...configFixtures };

beforeAll(() => {
  const root = {
    getPluginData: vi.fn(),
    setPluginData: vi.fn(),
  };
  vi.stubGlobal("figma", { root });
  return () => vi.unstubAllGlobals();
});

describe("loadConfig", () => {
  it.each([
    { config: undefined },
    { config: null },
    { config: "" },
    { config: "{}" },
  ])(
    "should return the default config if no config is stored (config=$config)",
    ({ config }) => {
      vi.mocked(figma.root.getPluginData).mockReturnValue(config as string);

      const result = loadConfig();
      const expectedConfig = fixtures.createConfig();
      expect(result).toStrictEqual(expectedConfig);
    },
  );

  it.each([
    { desc: "tabWidth=2", config: fixtures.createConfig({ tabWidth: 2 }) },
    { desc: "tabWidth=4", config: fixtures.createConfig({ tabWidth: 4 }) },
    {
      desc: "rootSelector=:root",
      config: fixtures.createConfig({ rootSelector: ":root" }),
    },
    {
      desc: "rootSelector=html",
      config: fixtures.createConfig({ rootSelector: "html" }),
    },
  ])("should return the stored config ($desc)", ({ config }) => {
    vi.mocked(figma.root.getPluginData).mockReturnValue(JSON.stringify(config));

    const result = loadConfig();
    expect(result).toStrictEqual(config);
  });

  it.each([
    { config: { tabWidth: 4 } },
    { config: { rootSelector: "html" } },
    { config: { baseFontSize: 12 } },
    { config: { trimKeywords: ["foo", "bar"] } },
  ])(
    "should add missing config properties to partial config ($config)",
    ({ config }) => {
      vi.mocked(figma.root.getPluginData).mockReturnValue(
        JSON.stringify(config),
      );

      const result = loadConfig();

      const expectedConfig = fixtures.createConfig(config);
      expect(result).toStrictEqual(expectedConfig);
    },
  );

  it.each([
    { units: { "all-numbers": "none" } },
    { units: { "font-size": "em" } },
    { units: { "font-weight": "px" } },
    { units: { "foo-bar": "rem" } },
  ] as const)(
    "should add missing units to partial config ($units)",
    ({ units }) => {
      vi.mocked(figma.root.getPluginData).mockReturnValue(
        JSON.stringify({ units }),
      );

      const result = loadConfig();

      const expectedUnits = fixtures.createUnitsConfig(units);
      const expectedConfig = fixtures.createConfig({ units: expectedUnits });
      expect(result).toStrictEqual(expectedConfig);
    },
  );
});

describe("saveConfig", () => {
  beforeEach(() => {
    vi.mocked(figma.root.setPluginData).mockClear();
  });

  it("should save the config", () => {
    const config = fixtures.createConfig({ baseFontSize: 42 });

    saveConfig(config);

    expect(figma.root.setPluginData).toHaveBeenCalledWith(
      "config",
      JSON.stringify(config),
    );
  });

  it("should return the sanitized config", () => {
    const config = { baseFontSize: 42 } as Config;

    const result = saveConfig(config);

    expect(result).toStrictEqual(fixtures.createConfig(config));
  });
});
