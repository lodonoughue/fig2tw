import { describe, expect, it, vi } from "vitest";
import { withArgs } from "./utils";

describe("withArgs", () => {
  it.each([
    { staticArgs: [], restArgs: ["foo", "bar", "baz"] },
    { staticArgs: ["foo"], restArgs: ["bar", "baz"] },
    { staticArgs: ["foo", "bar"], restArgs: ["baz"] },
    { staticArgs: ["foo", "bar", "baz"], restArgs: [] },
  ])(
    "should return a function with built-in args $staticArgs",
    ({ staticArgs, restArgs }) => {
      const underTest = vi.fn();
      const result = withArgs(underTest, ...staticArgs);
      result(...restArgs);
      expect(underTest).toHaveBeenCalledWith(...staticArgs, ...restArgs);
    },
  );
});
