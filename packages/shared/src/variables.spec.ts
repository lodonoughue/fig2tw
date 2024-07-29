import { describe, expect, it } from "vitest";
import {
  Variable,
  VariableObject,
  forEachVariableArray,
  getCollection,
  isBooleanVariable,
  isColorVariable,
  isNumberVariable,
  isRefVariable,
  isStringVariable,
  isValueVariable,
  refOf,
  valueOf,
} from "./variables.js";
import { fixtures } from "./fixtures.js";

describe("forEachVariable", () => {
  it.each([[null], [undefined], ["foo"], [42], [false]])(
    "should throw if the object contains illegal variables",
    illegalValue => {
      const struct = {
        foo: [],
        bar: illegalValue,
      } as unknown as VariableObject;
      expect(() => forEachVariableArray(struct, () => {})).toThrow(
        "fig2tw: cannot iterate on variables",
      );
    },
  );

  it("should iterate on each value array regardless of their struct level", () => {
    const selection = fixtures.pickCollections(["colors", "recursive"]);

    const result = [] as Variable<string>[][];
    forEachVariableArray(selection, (_, value) => result.push(value));

    expect(new Set(result)).toStrictEqual(
      new Set([
        ...Object.values(selection.colors),
        ...Object.values(selection.recursive.firsts),
        ...Object.values(selection.recursive.seconds),
      ]),
    );
  });
});

describe("valueOf", () => {
  it.each([
    ["string", fixtures.singleFoo],
    ["number", fixtures.regularThree],
    ["boolean", fixtures.regularTruthy],
    ["color", fixtures.lightRed],
  ] as const)("should return expected value %s", (type, value) => {
    // Needs to cast to any to make it work with overloads.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = valueOf(["foo", "bar"], "baz", value as any);
    expect(result).toStrictEqual({
      path: ["foo", "bar"],
      mode: "baz",
      type,
      value,
    });
  });

  it("should throw if value type is unknown", () => {
    expect(() =>
      // Needs to cast to any to make it work with allowed overloads.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      valueOf(["foo", "bar"], "baz", (() => {}) as any),
    ).toThrow("cannot make a value of type");
  });
});

describe("refOf", () => {
  it.each([["string"], ["number"], ["boolean"], ["color"]] as const)(
    "should return expected ref of %s",
    type => {
      const result = refOf(["foo", "bar"], "baz", type, ["ref", "to"]);
      expect(result).toStrictEqual({
        path: ["foo", "bar"],
        mode: "baz",
        type,
        ref: ["ref", "to"],
      });
    },
  );
});

describe.each([
  { fnType: "color", fn: isColorVariable },
  { fnType: "string", fn: isStringVariable },
  { fnType: "boolean", fn: isBooleanVariable },
  { fnType: "number", fn: isNumberVariable },
])("$fn", ({ fnType, fn }) => {
  const variables = [
    { varType: "color", variable: fixtures.lightRedVar },
    { varType: "color", variable: fixtures.redRefVar },
    { varType: "string", variable: fixtures.singleFooVar },
    { varType: "string", variable: fixtures.fooRefVar },
    { varType: "boolean", variable: fixtures.regularTruthyVar },
    { varType: "boolean", variable: fixtures.truthyRefVar },
    { varType: "number", variable: fixtures.regularThreeVar },
    { varType: "number", variable: fixtures.threeRefVar },
  ];

  it.each(variables.filter(({ varType }) => varType === fnType))(
    "should return true when evaluating a variable of type $varType",
    ({ variable }) => {
      const result = fn(variable);
      expect(result).toBe(true);
    },
  );

  it.each(variables.filter(({ varType }) => varType !== fnType))(
    "should return false when evaluating a variable of type $varType",
    ({ variable }) => {
      const result = fn(variable);
      expect(result).toBe(false);
    },
  );
});

describe.each([
  { fnType: "value", fn: isValueVariable },
  { fnType: "ref", fn: isRefVariable },
])("$fn", ({ fnType, fn }) => {
  const variables = [
    { variableType: "value", variable: fixtures.colorVar },
    { variableType: "value", variable: fixtures.stringVar },
    { variableType: "value", variable: fixtures.booleanVar },
    { variableType: "value", variable: fixtures.numberVar },
    { variableType: "ref", variable: fixtures.redRefVar },
    { variableType: "ref", variable: fixtures.fooRefVar },
    { variableType: "ref", variable: fixtures.truthyRefVar },
    { variableType: "ref", variable: fixtures.threeRefVar },
  ];

  it.each(variables.filter(({ variableType }) => variableType === fnType))(
    "should return true when variable is $variableType",
    ({ variable }) => {
      const result = fn(variable);
      expect(result).toBe(true);
    },
  );

  it.each(variables.filter(({ variableType }) => variableType !== fnType))(
    "should return false when variable is $variableType",
    ({ variable }) => {
      const result = fn(variable);
      expect(result).toBe(false);
    },
  );
});

describe("getCollection", () => {
  it.each([
    { variable: fixtures.lightRedVar, collection: "colors" },
    { variable: fixtures.singleFooVar, collection: "strings" },
    { variable: fixtures.regularTruthyVar, collection: "booleans" },
    { variable: fixtures.regularThreeVar, collection: "numbers" },
  ])(
    "should return the first element in path ($collection)",
    ({ variable, collection }) => {
      const result = getCollection(variable);
      expect(result).toBe(collection);
    },
  );

  it("should throw when path is empty", () => {
    const variable = valueOf([], "mode", "foo");
    expect(() => getCollection(variable)).toThrow(
      "variable must have at least one element in path",
    );
  });
});
