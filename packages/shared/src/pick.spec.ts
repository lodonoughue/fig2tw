import { describe, expect, it } from "vitest";
import { RecursiveObject } from "./objects.js";
import { pick } from "./pick.js";

const object = {
  foo: { abc: 1, def: 11, hij: 21 },
  bar: { abc: 2, def: 12 },
  baz: { abc: 3, hij: 23 },
  buz: 4,
} satisfies RecursiveObject<number>;

describe("pick", () => {
  it("returns the picked object", () => {
    const result = pick(object, ["foo", "bar"], it => it.abc);
    expect(result).toStrictEqual({
      foo: 1,
      bar: 2,
    });
  });
});
