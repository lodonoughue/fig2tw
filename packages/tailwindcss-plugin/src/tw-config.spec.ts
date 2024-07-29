import { describe, expect, it } from "vitest";
import { pluginOptionsOf } from "./plugin.js";
import { fixtures } from "@fig2tw/shared";
import { buildTwConfig } from "./tw-config.js";

const toTwColorValue = () => "var(--mocked-color-var)";
const toTwStringValue = () => "var(--mocked-string-var)";
const toTwBooleanValue = () => "var(--mocked-boolean-var)";
const toTwNumberValue = () => "var(--mocked-number-var)";

const opts = pluginOptionsOf({
  formatters: {
    toTwColorValue,
    toTwStringValue,
    toTwBooleanValue,
    toTwNumberValue,
  },
});

describe("buildTwConfig", () => {
  it("should return expected tw config", () => {
    const selection = fixtures.pickCollections([
      "colors",
      "strings",
      "numbers",
      "booleans",
      "refs",
    ]);

    const result = buildTwConfig("unknown", selection, opts);
    expect(result).toStrictEqual({
      "colors-red": "var(--mocked-color-var)",
      "colors-blue": "var(--mocked-color-var)",
      "refs-colors": "var(--mocked-color-var)",
      "strings-foo": "var(--mocked-string-var)",
      "strings-bar": "var(--mocked-string-var)",
      "refs-strings": "var(--mocked-string-var)",
      "numbers-three": "var(--mocked-number-var)",
      "numbers-five": "var(--mocked-number-var)",
      "refs-numbers": "var(--mocked-number-var)",
      "booleans-truthy": "var(--mocked-boolean-var)",
      "booleans-falsy": "var(--mocked-boolean-var)",
      "refs-booleans": "var(--mocked-boolean-var)",
      "refs-refs": expect.any(String),
    });
  });

  it("should throw when formatting faulty variable", () => {
    const selection = fixtures.pickCollections(["faulty"]);

    expect(() => buildTwConfig("unknown", selection, opts)).toThrow(
      "cannot format tailwwindcss value of type",
    );
  });
});
