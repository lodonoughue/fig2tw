/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it } from "vitest";
import { buildObject, deepMerge } from "./objects.js";

describe("deepMerge", () => {
  it("should merge two objects without conflicting properties", () => {
    const obj1 = {
      foo: { foo1: "foo 1" },
      bar: "bar",
    };

    const obj2 = {
      foo: { foo2: 2 },
      baz: { bez1: { biz: "biz biz" } },
    };

    const obj3 = {
      baz: {
        bez1: { boz: { buz: "buz" } },
        bez2: "bez",
      },
    };

    const result = deepMerge<any>([obj1, obj2, obj3]);
    expect(result).toStrictEqual({
      foo: { foo1: "foo 1", foo2: 2 },
      bar: "bar",
      baz: {
        bez1: { biz: "biz biz", boz: { buz: "buz" } },
        bez2: "bez",
      },
    });
  });

  it("should throw when a value is overriden", () => {
    const obj1 = {
      foo: { foo1: "foo 1" },
      bar: "bar",
    };

    const obj2 = {
      foo: { foo2: 2 },
      bar: "override",
    };

    expect(() => deepMerge<any>([obj1, obj2])).toThrow(
      "fig2tw: a value is already assigned",
    );
  });

  it("should throw when an object is assigned to a value", () => {
    const obj1 = {
      foo: { foo1: "foo 1" },
      bar: "bar",
    };

    const obj2 = {
      foo: { foo2: 2 },
      bar: { bar1: "bar1" },
    };

    expect(() => deepMerge<any>([obj1, obj2])).toThrow(
      "fig2tw: a value is already assigned",
    );
  });

  it("should throw when a value is assigned to an object", () => {
    const obj1 = {
      foo: { foo1: "foo 1" },
      bar: { bar1: "bar1" },
    };

    const obj2 = {
      foo: { foo2: 2 },
      bar: "bar",
    };

    expect(() => deepMerge<any>([obj1, obj2])).toThrow(
      "fig2tw: a value is already assigned",
    );
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
