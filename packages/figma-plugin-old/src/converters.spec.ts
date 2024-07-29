import { describe, expect, it } from "vitest";
import { asBoolean, asColor, asNumber, asString } from "./converters.js";
import { ColorValue } from "@fig2tw/shared";

type Color = ColorValue["value"];

describe("asBoolean", () => {
  it.each([[undefined], ["foo"], [42], [{}]])(
    "should throw if provided value (%s) is not a boolean",
    value => expect(() => asBoolean(value as never)).toThrow("fig2tw:"),
  );
  it.each([[true], [false]])(
    "should return the boolean when provided value (%s) is valid",
    value => expect(asBoolean(value)).toBe(value),
  );
});

describe("asString", () => {
  it.each([[undefined], [true], [42], [{}]])(
    "should throw if provided value (%s) is not a string",
    value => expect(() => asString(value as never)).toThrow("fig2tw:"),
  );
  it("should return the string when provided value is valid", () =>
    expect(asString("foo")).toBe("foo"));
});

describe("asNumber", () => {
  it.each([[undefined], [true], ["foo"], [{}]])(
    "should throw if provided value (%s) is not a number",
    value => expect(() => asNumber(value as never)).toThrow("fig2tw:"),
  );
  it("should return the number when provided value is valid", () =>
    expect(asNumber(42)).toBe(42));
});

describe("asColor", () => {
  it.each([[undefined], [true], [42], ["foo"], [{}]])(
    "should throw if provided value (%s) is not a color",
    value => expect(() => asColor(value as never)).toThrow("fig2tw:"),
  );
  it("should convert the RGBA figma color into a fig2tw color", () => {
    const figmaColor = { r: 0, g: 0.5, b: 1, a: 0.3 } satisfies RGBA;
    const fig2twColor = { r: 0, g: 128, b: 255, a: 0.3 } satisfies Color;
    expect(asColor(figmaColor)).toStrictEqual(fig2twColor);
  });
  it("should convert the RGBA figma color into a fig2tw color", () => {
    const figmaColor = { r: 0, g: 0.5, b: 1 } satisfies RGB;
    const fig2twColor = { r: 0, g: 128, b: 255, a: 1 } satisfies Color;
    expect(asColor(figmaColor)).toStrictEqual(fig2twColor);
  });
});
