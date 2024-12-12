import { describe, expect, it } from "vitest";
import {
  isAliasValue,
  isColorValue,
  isColorVariable,
  isNumberValue,
  isNumberVariable,
  isStringValue,
  isStringVariable,
  toColorHexPart,
  toColorRgbaPart,
} from "./variables";
import { variableFixtures } from "./variables.fixtures";

const fixtures = { ...variableFixtures };

describe.each([
  { fnType: "alias", fn: isAliasValue },
  { fnType: "color", fn: isColorValue },
  { fnType: "number", fn: isNumberValue },
  { fnType: "string", fn: isStringValue },
])("$fn", ({ fnType, fn }) => {
  const values = [
    { valueType: "alias", value: fixtures.createAliasValue() },
    { valueType: "color", value: fixtures.createColorValue() },
    { valueType: "number", value: fixtures.createNumberValue() },
    { valueType: "string", value: fixtures.createStringValue() },
  ];

  it.each(values.map(it => ({ ...it, expected: it.valueType === fnType })))(
    "should return $expected for $valueType variables",
    ({ value, expected }) => {
      const result = fn(value);
      expect(result).toBe(expected);
    },
  );
});

describe.each([
  { fnType: "color", fn: isColorVariable },
  { fnType: "number", fn: isNumberVariable },
  { fnType: "string", fn: isStringVariable },
])("$fn", ({ fnType, fn }) => {
  const values = [
    { variableType: "color", variable: fixtures.createColorVariable() },
    { variableType: "number", variable: fixtures.createNumberVariable() },
    { variableType: "string", variable: fixtures.createStringVariable() },
  ];

  it.each(values.map(it => ({ ...it, expected: it.variableType === fnType })))(
    "should return $expected for $variableType variables",
    ({ variable, expected }) => {
      const result = fn(variable);
      expect(result).toBe(expected);
    },
  );
});

describe("toColorHexPart", () => {
  it.each([
    { value: 0, expected: "00" },
    { value: 0.125, expected: "20" },
    { value: 0.25, expected: "40" },
    { value: 0.333333, expected: "55" },
    { value: 0.5, expected: "80" },
    { value: 0.666666, expected: "aa" },
    { value: 0.75, expected: "bf" },
    { value: 0.875, expected: "df" },
    { value: 1, expected: "ff" },
  ])("should return $expected", ({ value, expected }) => {
    const result = toColorHexPart(value);
    expect(result).toBe(expected);
  });
});

describe("toColorRgbaPart", () => {
  it.each([
    { value: 0, expected: 0 },
    { value: 0.125, expected: 32 },
    { value: 0.25, expected: 64 },
    { value: 0.333333, expected: 85 },
    { value: 0.5, expected: 128 },
    { value: 0.666666, expected: 170 },
    { value: 0.75, expected: 191 },
    { value: 0.875, expected: 223 },
    { value: 1, expected: 255 },
  ])("should return $expected", ({ value, expected }) => {
    const result = toColorRgbaPart(value);
    expect(result).toBe(expected);
  });
});
