import { describe, expect, it } from "vitest";
import { fail, assert } from "./assert";

describe("fail", () => {
  it.each([
    { input: [], expectedMessage: "fig2tw:" },
    { input: ["foo bar"], expectedMessage: "fig2tw: foo bar" },
    { input: ["foo bar", "baz"], expectedMessage: "fig2tw: foo bar baz" },
  ])("should throw $expectedMessage", ({ input, expectedMessage }) => {
    expect(() => fail(...input)).toThrow(expectedMessage);
  });
});

describe("assert", () => {
  it.each([[true], [{}], ["foo"], [1]])(
    "should not throw when value is truthy (%s)",
    value => {
      expect(() => assert(value)).not.toThrow();
    },
  );

  it.each([[false], [0], [null], [undefined], [""], [0]])(
    "should throw when value is falsy (%s)",
    value => {
      expect(() => assert(value)).toThrow("fig2tw:");
    },
  );
});
