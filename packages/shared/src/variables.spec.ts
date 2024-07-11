import { describe, expect, it } from "vitest";
import {
  Variable,
  VariableObject,
  forEachVariableArray,
  valueOf,
} from "./variables.js";

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
    const obj = {
      foo: { bar: [valueOf([], "col", "mode", "a")] },
      baz: [valueOf([], "col", "mode", "b")],
    };

    const result = [] as { path: string[]; value: Variable<string>[] }[];
    forEachVariableArray(obj, (path, value) => result.push({ path, value }));

    expect(result).toStrictEqual([
      { path: ["foo", "bar"], value: obj.foo.bar },
      { path: ["baz"], value: obj.baz },
    ]);
  });
});
