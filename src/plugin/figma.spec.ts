import { beforeAll, describe, expect, it, vi } from "vitest";
import {
  findDefaultValue,
  findModeById,
  findVariableById,
  getDefaultMode,
  getFigmaVariables,
  isFigmaBooleanValue,
  isFigmaColorValue,
  isFigmaNumberValue,
  isFigmaStringValue,
  isFigmaVariableAlias,
} from "./figma";
import { figmaFixtures } from "./figma.fixtures";

const fixtures = { ...figmaFixtures };

const getLocalVariables = vi.fn().mockReturnValue([]);
const getLocalVariableCollections = vi.fn().mockReturnValue([]);

beforeAll(() => {
  const variables = {
    getLocalVariablesAsync() {
      return Promise.resolve(getLocalVariables());
    },
    getLocalVariableCollectionsAsync() {
      return Promise.resolve(getLocalVariableCollections());
    },
  };
  vi.stubGlobal("figma", { variables });
  return () => vi.unstubAllGlobals();
});

describe("getFigmaVariables", () => {
  it("should return variables and collections from figma", async () => {
    const collections = fixtures.createFigmaCollections([{ key: "buz" }]);
    const variables = fixtures.createFigmaVariables([
      { key: "foo" },
      { key: "bar" },
      { key: "baz" },
    ]);

    getLocalVariables.mockReturnValue(variables);
    getLocalVariableCollections.mockReturnValue(collections);

    const result = await getFigmaVariables();

    expect(result.variables).toBe(variables);
    expect(result.collections).toBe(collections);
  });
});

describe("findDefaultValue", () => {
  const numberCollection = fixtures.createFigmaCollection({
    id: "number-collection",
    defaultModeId: "one",
    modeIds: ["one", "two", "three"],
  });

  const stringCollection = fixtures.createFigmaCollection({
    id: "string-collection",
    defaultModeId: "bar",
    modeIds: ["foo", "bar", "baz"],
  });

  const colorCollection = fixtures.createFigmaCollection({
    id: "color-collection",
    defaultModeId: "blue",
    modeIds: ["red", "green", "blue"],
  });

  const evenVariable = fixtures.createFigmaVariable({
    id: "even",
    collection: numberCollection,
    valuesByMode: { one: 2, two: 4, three: 6 },
  });

  const abcVariable = fixtures.createFigmaVariable({
    id: "abc",
    collection: stringCollection,
    valuesByMode: { foo: "a", bar: "b", baz: "c" },
  });

  const colorVariable = fixtures.createFigmaVariable({
    id: "color",
    collection: colorCollection,
    valuesByMode: { red: "red", green: "green", blue: "blue" },
  });

  it.each([
    { collection: numberCollection, variable: evenVariable, value: 2 },
    { collection: stringCollection, variable: abcVariable, value: "b" },
    { collection: colorCollection, variable: colorVariable, value: "blue" },
  ])(
    "should return a value based on the default collection mode (variable=$variable.id)",
    ({ collection, variable, value }) => {
      const result = findDefaultValue([collection], [variable], variable);
      expect(result).toBe(value);
    },
  );

  it.each([
    {
      position: "start",
      collections: [numberCollection, stringCollection, colorCollection],
    },
    {
      position: "center",
      collections: [stringCollection, numberCollection, colorCollection],
    },
    {
      position: "end",
      collections: [stringCollection, colorCollection, numberCollection],
    },
  ])(
    "should handle multiple collections (position=$position)",
    ({ collections }) => {
      const result = findDefaultValue(
        collections,
        [evenVariable],
        evenVariable,
      );
      expect(result).toBe(2);
    },
  );

  it("should throw when collection is not found", () => {
    expect(() =>
      findDefaultValue([numberCollection], [abcVariable], abcVariable),
    ).toThrow("Could not resolve collection with id string-collection");
  });

  it("should resolve aliases within the same collection", () => {
    const aliasVariable = fixtures.createFigmaVariable({
      collection: numberCollection,
      value: fixtures.createFigmaVariableAlias(evenVariable),
    });

    const result = findDefaultValue(
      [numberCollection],
      [evenVariable, aliasVariable],
      aliasVariable,
    );

    expect(result).toBe(2);
  });

  it("should resolve aliases across collections", () => {
    const aliasVariable = fixtures.createFigmaVariable({
      collection: stringCollection,
      value: fixtures.createFigmaVariableAlias(evenVariable),
    });

    const result = findDefaultValue(
      [numberCollection, stringCollection],
      [evenVariable, aliasVariable],
      aliasVariable,
    );

    expect(result).toBe(2);
  });
});

describe("findModeById", () => {
  const oneMode = fixtures.createFigmaMode({ modeId: "one" });
  const twoMode = fixtures.createFigmaMode({ modeId: "two" });
  const abcMode = fixtures.createFigmaMode({ modeId: "abc" });
  const defMode = fixtures.createFigmaMode({ modeId: "def" });

  const fooCollection = fixtures.createFigmaCollection({
    id: "foo",
    modes: [oneMode, twoMode],
  });

  const barCollection = fixtures.createFigmaCollection({
    id: "bar",
    modes: [abcMode, defMode],
  });

  it.each([
    { collectionId: "foo", modeId: "one", expected: oneMode },
    { collectionId: "foo", modeId: "two", expected: twoMode },
    { collectionId: "bar", modeId: "abc", expected: abcMode },
    { collectionId: "bar", modeId: "def", expected: defMode },
  ])(
    "should find a mode by id ($modeId)",
    ({ collectionId, modeId, expected }) => {
      const result = findModeById(
        [fooCollection, barCollection],
        collectionId,
        modeId,
      );
      expect(result).toBe(expected);
    },
  );

  it("should throw when collection is not found", () => {
    expect(() => findModeById([fooCollection], "bar", "one")).toThrow(
      "Could not resolve collection with id bar",
    );
  });

  it("should throw when mode is not found", () => {
    expect(() => findModeById([fooCollection], "foo", "four")).toThrow(
      "Mode could not be resolved: four",
    );
  });
});

describe("getDefaultMode", () => {
  const one = fixtures.createFigmaMode({ modeId: "one" });
  const two = fixtures.createFigmaMode({ modeId: "two" });
  const abc = fixtures.createFigmaMode({ modeId: "abc" });
  const def = fixtures.createFigmaMode({ modeId: "def" });

  const fooCollection = fixtures.createFigmaCollection({
    defaultModeId: "one",
    modes: [one, two],
  });

  const barCollection = fixtures.createFigmaCollection({
    defaultModeId: "def",
    modes: [abc, def],
  });

  it.each([
    { collection: fooCollection, expected: one },
    { collection: barCollection, expected: def },
  ])(
    "should find the default mode ($expected.modeId)",
    ({ collection, expected }) => {
      const result = getDefaultMode(collection);
      expect(result).toBe(expected);
    },
  );
});

describe("findVariableById", () => {
  const foo = fixtures.createFigmaVariable({ id: "foo" });
  const bar = fixtures.createFigmaVariable({ id: "bar" });
  const baz = fixtures.createFigmaVariable({ id: "baz" });

  it.each([
    { id: "foo", expected: foo },
    { id: "bar", expected: bar },
    { id: "baz", expected: baz },
  ])("should find a variable by id ($id)", ({ id, expected }) => {
    const result = findVariableById([foo, bar, baz], id);
    expect(result).toBe(expected);
  });

  it("should throw when variable is not found", () => {
    expect(() => findVariableById([foo, bar, baz], "buz")).toThrow(
      "fig2tw: Variable could not be resolved",
    );
  });
});

describe.each([
  { fnType: "number", fn: isFigmaNumberValue },
  { fnType: "boolean", fn: isFigmaBooleanValue },
  { fnType: "string", fn: isFigmaStringValue },
  { fnType: "color", fn: isFigmaColorValue },
  { fnType: "alias", fn: isFigmaVariableAlias },
])("$fn", ({ fnType, fn }) => {
  const variables = [
    { type: "number", variable: 42 },
    { type: "boolean", variable: true },
    { type: "string", variable: "foo" },
    { type: "color", variable: fixtures.createFigmaRgbColor() },
    { type: "color", variable: fixtures.createFigmaRgbaColor() },
    { type: "alias", variable: fixtures.createFigmaVariableAlias() },
  ] as const;

  it.each(variables.map(it => ({ ...it, expected: it.type === fnType })))(
    "should return $expected for $type",
    ({ variable, expected }) => {
      const result = fn(variable);
      expect(result).toBe(expected);
    },
  );
});
