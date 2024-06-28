import { describe, expect, it } from "vitest";
import { forEachValueArray } from "./value.js";
import { AnyValue, ValueStruct, valueOf } from "@fig2tw/shared";

describe("forEachValue", () => {
  it.each([[null], [undefined], ["foo"], [42], [false]])(
    "should throw if the object contains illegal values",
    illegalValue => {
      const struct = { foo: [], bar: illegalValue } as unknown as ValueStruct;
      expect(() => forEachValueArray(struct, () => {})).toThrow(
        "fig2tw: cannot iterate on values",
      );
    },
  );

  it("should iterate on each value array regardless of their struct level", () => {
    const obj = {
      foo: { bar: [valueOf("col", "mode", "a")] },
      baz: [valueOf("col", "mode", "b")],
    };

    const result = [] as { path: string[]; value: AnyValue[] }[];
    forEachValueArray(obj, (path, value) => result.push({ path, value }));

    expect(result).toStrictEqual([
      { path: ["foo", "bar"], value: obj.foo.bar },
      { path: ["baz"], value: obj.baz },
    ]);
  });
});
