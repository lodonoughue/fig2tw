/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it } from "vitest";
import { deepMerge } from "./object.js";

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
