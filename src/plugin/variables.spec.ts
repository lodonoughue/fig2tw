import { describe, expect, it, vi } from "vitest";
import { fixtures } from "@plugin/fixtures";
import { getFigmaVariables } from "@plugin/figma";
import {
  isSupportedByCss,
  isSupportedByJson,
  loadVariables,
} from "./variables";
import { chain } from "lodash";

vi.mock("@plugin/figma", async importOriginal => {
  const original = await importOriginal<typeof import("@plugin/figma")>();
  vi.spyOn(original, "getFigmaVariables");
  return original;
});

describe("isSupportedByCss", () => {
  it.each([
    { variable: fixtures.createColorVariable(), expected: true },
    { variable: fixtures.createNumberVariable(), expected: true },
    { variable: fixtures.createStringVariable(), expected: true },
    { variable: fixtures.createBooleanVariable(), expected: false },
    {
      variable: fixtures.createNumberVariable({ type: "never" as never }),
      expected: false,
    },
  ])(
    "should return $expected for $variable.type variable",
    ({ variable, expected }) => {
      expect(isSupportedByCss(variable)).toBe(expected);
    },
  );
});

describe("isSupportedByJson", () => {
  it.each([
    { resolvedType: "COLOR", expected: true },
    { resolvedType: "FLOAT", expected: true },
    { resolvedType: "STRING", expected: true },
    { resolvedType: "BOOLEAN", expected: true },
    { resolvedType: "NEVER" as never, expected: false },
  ] as const)(
    "should return $expected for $resolvedType variable",
    ({ resolvedType, expected }) => {
      const variable = fixtures.createFigmaVariable({ resolvedType });
      expect(isSupportedByJson(variable)).toBe(expected);
    },
  );
});

describe("loadVariables", () => {
  it("should ignore unsupported variables", async () => {
    const collection = fixtures.createFigmaCollection();
    const variable = fixtures.createFigmaVariable({
      resolvedType: "NEVER" as never,
      collection,
    });
    const mockedValue = { collections: [collection], variables: [variable] };
    vi.mocked(getFigmaVariables).mockReturnValue(Promise.resolve(mockedValue));

    const result = await loadVariables();
    expect(result).toHaveLength(0);
  });

  it("should return variables with expected keys", async () => {
    const collection = fixtures.createFigmaCollection({
      name: "Collection Foo",
    });
    const variables = fixtures.createFigmaVariables([
      { name: "Color", collection, resolvedType: "COLOR" },
      { name: "String", collection, resolvedType: "STRING" },
      { name: "Number", collection, resolvedType: "FLOAT" },
      { name: "Boolean", collection, resolvedType: "BOOLEAN" },
    ]);
    const mockedValue = { collections: [collection], variables };
    vi.mocked(getFigmaVariables).mockReturnValue(Promise.resolve(mockedValue));

    const result = await loadVariables();
    expect(result.map(it => it.key)).toEqual([
      "Collection Foo/Color",
      "Collection Foo/String",
      "Collection Foo/Number",
      "Collection Foo/Boolean",
    ]);
  });

  it("should return variables with expected names", async () => {
    const collection = fixtures.createFigmaCollection({
      name: "Collection Bar",
    });
    const variables = fixtures.createFigmaVariables([
      { name: "Bar Color", collection, resolvedType: "COLOR" },
      { name: "Bar String", collection, resolvedType: "STRING" },
      { name: "Bar Number", collection, resolvedType: "FLOAT" },
      { name: "Bar Boolean", collection, resolvedType: "BOOLEAN" },
    ]);
    const mockedValue = { collections: [collection], variables };
    vi.mocked(getFigmaVariables).mockReturnValue(Promise.resolve(mockedValue));

    const result = await loadVariables();
    expect(result.map(it => it.name)).toEqual([
      "Bar Color",
      "Bar String",
      "Bar Number",
      "Bar Boolean",
    ]);
  });

  it("should return variables with expected types", async () => {
    const collection = fixtures.createFigmaCollection();
    const variables = fixtures.createFigmaVariables([
      { collection, resolvedType: "COLOR" },
      { collection, resolvedType: "STRING" },
      { collection, resolvedType: "FLOAT" },
      { collection, resolvedType: "BOOLEAN" },
    ]);
    const mockedValue = { collections: [collection], variables };
    vi.mocked(getFigmaVariables).mockReturnValue(Promise.resolve(mockedValue));

    const result = await loadVariables();
    expect(result.map(it => it.type)).toEqual([
      "color",
      "string",
      "number",
      "boolean",
    ]);
  });

  it("should return collection with expected name", async () => {
    const collection = fixtures.createFigmaCollection({
      name: "Collection Baz",
    });
    const variable = fixtures.createFigmaVariable({ collection });
    const mockedValue = { collections: [collection], variables: [variable] };
    vi.mocked(getFigmaVariables).mockReturnValue(Promise.resolve(mockedValue));

    const [result] = await loadVariables();
    expect(result.collection.name).toBe("Collection Baz");
  });

  it("should return collection with expected modes", async () => {
    const collection = fixtures.createFigmaCollection({
      modeNames: ["Foo", "Bar", "Baz"],
    });
    const variable = fixtures.createFigmaVariable({ collection });
    const mockedValue = { collections: [collection], variables: [variable] };
    vi.mocked(getFigmaVariables).mockReturnValue(Promise.resolve(mockedValue));

    const [result] = await loadVariables();
    expect(result.collection.modes).toEqual(["Foo", "Bar", "Baz"]);
  });

  it.each([["foo"], ["bar"], ["baz"]] as const)(
    "should return collection with expected default mode (%s)",
    async defaultModeId => {
      const modes = { foo: "Foo", bar: "Bar", baz: "Baz" };
      const collection = fixtures.createFigmaCollection({
        defaultModeId,
        modes: chain(modes)
          .entries()
          .map(([modeId, name]) => ({ modeId, name }))
          .value(),
      });
      const variable = fixtures.createFigmaVariable({ collection });
      const mockedValue = { collections: [collection], variables: [variable] };
      vi.mocked(getFigmaVariables).mockReturnValue(
        Promise.resolve(mockedValue),
      );

      const [result] = await loadVariables();
      expect(result.collection.defaultMode).toEqual(modes[defaultModeId]);
    },
  );

  it.each([
    {
      resolvedType: "COLOR",
      scopes: ["ALL_SCOPES"],
      expected: ["all-colors"],
    },
    {
      resolvedType: "COLOR",
      scopes: ["ALL_FILLS"],
      expected: ["fill-color", "text-color"],
    },
    {
      resolvedType: "COLOR",
      scopes: ["FRAME_FILL"],
      expected: ["fill-color"],
    },
    {
      resolvedType: "COLOR",
      scopes: ["SHAPE_FILL"],
      expected: ["fill-color"],
    },
    {
      resolvedType: "COLOR",
      scopes: ["TEXT_FILL"],
      expected: ["text-color"],
    },
    {
      resolvedType: "COLOR",
      scopes: ["STROKE_COLOR"],
      expected: ["stroke-color"],
    },
    {
      resolvedType: "COLOR",
      scopes: ["EFFECT_COLOR"],
      expected: ["effect-color"],
    },
    {
      resolvedType: "COLOR",
      scopes: ["EFFECT_COLOR"],
      expected: ["effect-color"],
    },
    {
      resolvedType: "COLOR",
      scopes: ["EFFECT_COLOR"],
      expected: ["effect-color"],
    },
    {
      resolvedType: "FLOAT",
      scopes: ["ALL_SCOPES"],
      expected: ["all-numbers"],
    },
    {
      resolvedType: "FLOAT",
      scopes: ["CORNER_RADIUS"],
      expected: ["radius"],
    },
    {
      resolvedType: "FLOAT",
      scopes: ["WIDTH_HEIGHT"],
      expected: ["size"],
    },
    {
      resolvedType: "FLOAT",
      scopes: ["GAP"],
      expected: ["gap"],
    },
    {
      resolvedType: "FLOAT",
      scopes: ["STROKE_FLOAT"],
      expected: ["stroke-width"],
    },
    {
      resolvedType: "FLOAT",
      scopes: ["FONT_SIZE"],
      expected: ["font-size"],
    },
    {
      resolvedType: "FLOAT",
      scopes: ["LINE_HEIGHT"],
      expected: ["line-height"],
    },
    {
      resolvedType: "FLOAT",
      scopes: ["LETTER_SPACING"],
      expected: ["letter-spacing"],
    },
    {
      resolvedType: "FLOAT",
      scopes: ["FONT_WEIGHT"],
      expected: ["font-weight"],
    },
    {
      resolvedType: "STRING",
      scopes: ["ALL_SCOPES"],
      expected: ["all-strings"],
    },
    {
      resolvedType: "STRING",
      scopes: ["FONT_FAMILY"],
      expected: ["font-family"],
    },
    {
      resolvedType: "BOOLEAN",
      scopes: ["ALL_SCOPES"],
      expected: ["all-booleans"],
    },
  ] as const)(
    "should return $resolvedType variable with expected scope $expected from figma scopes $scopes",
    async ({ resolvedType, scopes, expected }) => {
      const collection = fixtures.createFigmaCollection();
      const variable = fixtures.createFigmaVariable({
        resolvedType,
        collection,
        scopes: [...scopes],
      });
      const mockedValue = { collections: [collection], variables: [variable] };
      vi.mocked(getFigmaVariables).mockReturnValue(
        Promise.resolve(mockedValue),
      );

      const [result] = await loadVariables();
      expect(result.scopes).toEqual(expected);
    },
  );

  it.each([
    {
      resolvedType: "COLOR",
      scopes: ["ALL_FILLS", "FRAME_FILL", "SHAPE_FILL", "TEXT_FILL"],
      expected: ["fill-color", "text-color"],
    },
  ] as const)(
    "should return $resolvedType variable with no unique scopes when figma scopes are overlapping ($scopes)",
    async ({ resolvedType, scopes, expected }) => {
      const collection = fixtures.createFigmaCollection();
      const variable = fixtures.createFigmaVariable({
        resolvedType,
        collection,
        scopes: [...scopes],
      });
      const mockedValue = { collections: [collection], variables: [variable] };
      vi.mocked(getFigmaVariables).mockReturnValue(
        Promise.resolve(mockedValue),
      );

      const [result] = await loadVariables();
      expect(result.scopes).toEqual(expected);
    },
  );

  it.each([["COLOR"], ["FLOAT"], ["STRING"], ["BOOLEAN"]] as const)(
    "should return %s variable with no scopes when figma scope is not supported",
    async resolvedType => {
      const collection = fixtures.createFigmaCollection();
      const variable = fixtures.createFigmaVariable({
        resolvedType,
        collection,
        scopes: ["NEVER" as never],
      });
      const mockedValue = { collections: [collection], variables: [variable] };
      vi.mocked(getFigmaVariables).mockReturnValue(
        Promise.resolve(mockedValue),
      );

      const [result] = await loadVariables();
      expect(result.scopes).toEqual([]);
    },
  );

  it.each([["COLOR"], ["FLOAT"], ["STRING"], ["BOOLEAN"]] as const)(
    "should return %s variable with no scopes when there's no figma scope defined",
    async resolvedType => {
      const collection = fixtures.createFigmaCollection();
      const variable = fixtures.createFigmaVariable({
        resolvedType,
        collection,
        scopes: [],
      });
      const mockedValue = { collections: [collection], variables: [variable] };
      vi.mocked(getFigmaVariables).mockReturnValue(
        Promise.resolve(mockedValue),
      );

      const [result] = await loadVariables();
      expect(result.scopes).toEqual([]);
    },
  );

  it.each([
    {
      value: { r: 1, g: 0, b: 0 },
      otherValue: { r: 0, g: 1, b: 0 },
      expected: fixtures.createColorValue({ value: { rgba: [255, 0, 0, 1] } }),
    },
    {
      value: 42,
      otherValue: 5,
      expected: fixtures.createNumberValue({ value: 42 }),
    },
    {
      value: "foo",
      otherValue: "bar",
      expected: fixtures.createStringValue({ value: "foo" }),
    },
    {
      value: false,
      otherValue: true,
      expected: fixtures.createBooleanValue({ value: false }),
    },
  ])(
    "should return $expected.type variable with expected default value",
    async ({ value, otherValue, expected }) => {
      const collection = fixtures.createFigmaCollection({
        defaultModeId: "bar",
        modeIds: ["foo", "bar", "baz"],
      });
      const variable = fixtures.createFigmaVariable({
        collection,
        valuesByMode: {
          foo: otherValue,
          bar: value,
          baz: otherValue,
        },
      });
      const mockedValue = { collections: [collection], variables: [variable] };
      vi.mocked(getFigmaVariables).mockReturnValue(
        Promise.resolve(mockedValue),
      );

      const [result] = await loadVariables();
      expect(result.defaultValue).toEqual(expected);
    },
  );

  it("should return variable with alias target as default value", async () => {
    const generateId = fixtures.createIdGenerator();
    const collection = fixtures.createFigmaCollection({ generateId });
    const variables = fixtures.createFigmaVariables([
      {
        generateId,
        collection,
        value: { type: "VARIABLE_ALIAS", id: "target" },
      },
      { id: "target", collection, value: "Alias Target" },
    ]);
    const mockedValue = { collections: [collection], variables };
    vi.mocked(getFigmaVariables).mockReturnValue(Promise.resolve(mockedValue));

    const [result] = await loadVariables();
    expect(result.defaultValue.value).toEqual("Alias Target");
  });

  it("should return variable with alias target as default value", async () => {
    const collection = fixtures.createFigmaCollection();
    const variables = fixtures.createFigmaVariables([
      {
        name: "under-test",
        collection,
        value: { type: "VARIABLE_ALIAS", id: "target" },
      },
      { id: "target", collection, value: "Alias Target" },
    ]);
    const mockedValue = { collections: [collection], variables };
    vi.mocked(getFigmaVariables).mockReturnValue(Promise.resolve(mockedValue));

    const result = (await loadVariables()).find(it => it.name === "under-test");
    expect(result?.defaultValue.value).toEqual("Alias Target");
  });

  it("should return variable with alias target as default value when there's multiple levels of alias", async () => {
    const collection = fixtures.createFigmaCollection();
    const variables = fixtures.createFigmaVariables([
      {
        name: "under-test",
        collection,
        value: { type: "VARIABLE_ALIAS", id: "first-target" },
      },
      {
        id: "first-target",
        collection,
        value: { type: "VARIABLE_ALIAS", id: "second-target" },
      },
      { id: "second-target", collection, value: "Alias Target" },
    ]);
    const mockedValue = { collections: [collection], variables };
    vi.mocked(getFigmaVariables).mockReturnValue(Promise.resolve(mockedValue));

    const result = (await loadVariables()).find(it => it.name === "under-test");
    expect(result?.defaultValue.value).toEqual("Alias Target");
  });

  it("should return variable with alias target as default value when alias target is in another collection", async () => {
    const generateId = fixtures.createIdGenerator();
    const aliasCollection = fixtures.createFigmaCollection({
      generateId,
      modes: [{ modeId: "foo", name: "Foo" }],
    });
    const targetCollection = fixtures.createFigmaCollection({
      generateId,
      defaultModeId: "baz",
      modes: [
        { modeId: "bar", name: "Bar" },
        { modeId: "baz", name: "Baz" },
      ],
    });
    const variables = fixtures.createFigmaVariables([
      {
        name: "under-test",
        collection: aliasCollection,
        value: { type: "VARIABLE_ALIAS", id: "target" },
      },
      {
        id: "target",
        collection: targetCollection,
        valuesByMode: {
          bar: "Other Value",
          baz: "Alias Target",
        },
      },
    ]);
    const mockedValue = {
      collections: [aliasCollection, targetCollection],
      variables,
    };
    vi.mocked(getFigmaVariables).mockReturnValue(Promise.resolve(mockedValue));

    const result = (await loadVariables()).find(it => it.name === "under-test");
    expect(result?.defaultValue.value).toEqual("Alias Target");
  });

  it("should detect alias cycles", async () => {
    const collection = fixtures.createFigmaCollection();
    const variables = fixtures.createFigmaVariables([
      {
        id: "under-test",
        name: "under-test",
        collection,
        value: { type: "VARIABLE_ALIAS", id: "first-target" },
      },
      {
        id: "first-target",
        collection,
        value: { type: "VARIABLE_ALIAS", id: "second-target" },
      },
      {
        id: "second-target",
        collection,
        value: { type: "VARIABLE_ALIAS", id: "under-test" },
      },
    ]);
    const mockedValue = { collections: [collection], variables };
    vi.mocked(getFigmaVariables).mockReturnValue(Promise.resolve(mockedValue));

    await expect(async () => await loadVariables()).rejects.toThrow(
      "fig2tw: Cycle detected:",
    );
  });

  it.each([
    { value: { r: 1, g: 0, b: 0 }, expectedType: "color" },
    { value: "Foo Bar Baz", expectedType: "string" },
    { value: 42, expectedType: "number" },
    { value: false, expectedType: "boolean" },
    { value: { type: "VARIABLE_ALIAS", id: "target" }, expectedType: "alias" },
  ] as const)(
    "should return values with expected type $expectedType",
    async ({ value, expectedType }) => {
      const generateId = fixtures.createIdGenerator();
      const collection = fixtures.createFigmaCollection({
        generateId,
        modeNames: ["Foo"],
      });
      const variables = fixtures.createFigmaVariables([
        { generateId, collection, value },
        { id: "target", collection, value: "Alias Target" },
      ]);
      const mockedValue = { collections: [collection], variables };
      vi.mocked(getFigmaVariables).mockReturnValue(
        Promise.resolve(mockedValue),
      );

      const [result] = await loadVariables();
      expect(result.valuesByMode.Foo.type).toBe(expectedType);
    },
  );

  it.each([
    {
      value: { r: 1, g: 0, b: 0 },
      expected: { rgba: [255, 0, 0, 1], hex: "#ff0000" },
    },
    {
      value: { r: 0, g: 0.5, b: 0 },
      expected: { rgba: [0, 128, 0, 1], hex: "#008000" },
    },
    {
      value: { r: 0, g: 0, b: 1 },
      expected: { rgba: [0, 0, 255, 1], hex: "#0000ff" },
    },
    {
      value: { r: 1, g: 1, b: 1 },
      expected: { rgba: [255, 255, 255, 1], hex: "#ffffff" },
    },
    {
      value: { r: 0, g: 0, b: 0, a: 0 },
      expected: { rgba: [0, 0, 0, 0], hex: "#00000000" },
    },
    { value: 42, expected: 42 },
    { value: "Foo Bar Baz", expected: "Foo Bar Baz" },
    { value: true, expected: true },
    { value: false, expected: false },
    {
      value: { type: "VARIABLE_ALIAS", id: "target" },
      expected: { key: "Collection/Aliased" },
    },
  ] as const)(
    "should return values with expected inner value ($expected)",
    async ({ value, expected }) => {
      const generateId = fixtures.createIdGenerator();
      const collection = fixtures.createFigmaCollection({
        generateId,
        name: "Collection",
        modeNames: ["Foo"],
      });
      const variables = fixtures.createFigmaVariables([
        { generateId, collection, value },
        { id: "target", name: "Aliased", collection, value: "Alias Target" },
      ]);
      const mockedValue = { collections: [collection], variables };
      vi.mocked(getFigmaVariables).mockReturnValue(
        Promise.resolve(mockedValue),
      );

      const [result] = await loadVariables();
      expect(result.valuesByMode.Foo.value).toEqual(expected);
    },
  );

  it("should return valuesByMode with expected keys", async () => {
    const collection = fixtures.createFigmaCollection({
      modeNames: ["Foo", "Bar", "Baz"],
    });
    const variables = fixtures.createFigmaVariables([{ collection }]);
    const mockedValue = { collections: [collection], variables };
    vi.mocked(getFigmaVariables).mockReturnValue(Promise.resolve(mockedValue));

    const [result] = await loadVariables();
    expect(Object.keys(result.valuesByMode)).toEqual(["Foo", "Bar", "Baz"]);
  });
});
