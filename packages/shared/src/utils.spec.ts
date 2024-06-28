import { describe, expect, it } from "vitest";
import { range, zip } from "./utils.js";

describe("zip", () => {
  it("should throw if arrays are not the same length", () => {
    const first = [1, 2];
    const second = ["one", "two", "three"];
    expect(() => zip(first, second)).toThrow("fig2tw:");
  });

  it("should zip array values at the same position into tuples", () => {
    const first = [1, 2, 3];
    const second = ["one", "two", "three"];
    const result = zip(first, second);
    expect(result).toStrictEqual([
      [1, "one"],
      [2, "two"],
      [3, "three"],
    ]);
  });
});

describe("range", () => {
  it("should generate a range of numbers between start and end", () => {
    expect(range(3, 7)).toStrictEqual([3, 4, 5, 6]);
  });
});
