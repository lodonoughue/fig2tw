/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it } from "vitest";
import { buildObject, deepMerge } from "./objects.js";
import { fixtures } from "./fixtures.js";
import { VariableObject } from "./variables.js";

describe("deepMerge", () => {
  it("should merge two objects without conflicting properties", () => {
    const expectedResult = fixtures.pickCollections(["types", "recursive"]);
    const { types, recursive } = expectedResult;
    const { firsts, ...rest } = recursive;

    const result = deepMerge<VariableObject>([
      { types },
      { recursive: { firsts } },
      { recursive: rest },
    ]);
    expect(result).toStrictEqual(expectedResult);
  });

  it("should throw when a value is overriden", () => {
    const { types } = fixtures.pickCollections(["types"]);
    const { color } = types;

    expect(() =>
      deepMerge<VariableObject>([{ types }, { types: { color } }]),
    ).toThrow("fig2tw: a value is already assigned");
  });

  it("should throw when an object is assigned to a value", () => {
    const { types } = fixtures.pickCollections(["types"]);
    const { color } = types;

    expect(() =>
      deepMerge<VariableObject>([{ types: color }, { types }]),
    ).toThrow("fig2tw: a value is already assigned");
  });

  it("should throw when a value is assigned to an object", () => {
    const { types } = fixtures.pickCollections(["types"]);
    const { color } = types;

    expect(() =>
      deepMerge<VariableObject>([{ types }, { types: color }]),
    ).toThrow("fig2tw: a value is already assigned");
  });

  it("should return an empty object when object is undefined", () => {
    const result = deepMerge([undefined]);
    expect(result).toStrictEqual({});
  });
});

describe("buildObject", () => {
  it("should return expected object", () => {
    const entries = [
      { key: "foo", value: "foo-value" },
      { key: "bar", value: "bar-value" },
      { key: "baz", value: "baz-value" },
    ];
    const result = buildObject(
      entries,
      it => it.key,
      it => it.value,
    );
    expect(result).toStrictEqual({
      foo: "foo-value",
      bar: "bar-value",
      baz: "baz-value",
    });
  });

  it("should return expected multi-level object", () => {
    const entries = [
      { key: ["foo"], value: "foo-value" },
      { key: ["bar", "baz"], value: "bar-baz-value" },
    ];
    const result = buildObject(
      entries,
      it => it.key,
      it => it.value,
    );
    expect(result).toStrictEqual({
      foo: "foo-value",
      bar: {
        baz: "bar-baz-value",
      },
    });
  });

  it("should throw when trying to assign a value that already exists", () => {
    const entries = [
      { key: "foo", value: "foo-value" },
      { key: "foo", value: "override" },
    ];
    expect(() =>
      buildObject(
        entries,
        it => it.key,
        it => it.value,
      ),
    ).toThrow("fig2tw: duplicate key");
  });

  it("should throw when trying to assign a value to an object", () => {
    const entries = [
      { key: ["foo", "bar"], value: "foo-value" },
      { key: ["foo", "bar", "baz"], value: "object-value clash" },
    ];

    expect(() =>
      buildObject(
        entries,
        it => it.key,
        it => it.value,
      ),
    ).toThrow("fig2tw: cannot assign an object to an already assigned value");
  });
});
