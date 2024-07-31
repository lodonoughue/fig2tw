import { describe, expect, it } from "vitest";
import { fig2twPlugin } from "./plugin.js";
import { fixtures, pick } from "@fig2tw/shared";
import {
  formatOptionsOf,
  toTwColorValue,
  toTwNumberValue,
  toTwStringValue,
} from "./formatters.js";

describe("fig2twPlugin", () => {
  describe("colors", () => {
    it("should configure colors based on color selection", () => {
      const options = formatOptionsOf();
      const result = fig2twPlugin({
        variables: fixtures.variables,
        colors: it => it.colors,
      });

      expect(result.config?.theme).not.toBeUndefined();
      expect(result.config?.theme).toStrictEqual({
        extend: {},
        colors: {
          red: toTwColorValue("--colors-red", options),
          blue: toTwColorValue("--colors-blue", options),
        },
      });
    });
  });

  describe("spacing", () => {
    it("should configure spacing based on spacing selection", () => {
      const options = formatOptionsOf();
      const result = fig2twPlugin({
        variables: fixtures.variables,
        spacing: it => it.numbers,
      });

      expect(result.config?.theme).not.toBeUndefined();
      expect(result.config?.theme).toStrictEqual({
        extend: {
          spacing: {
            three: toTwNumberValue("--numbers-three", options),
            five: toTwNumberValue("--numbers-five", options),
          },
        },
      });
    });
  });

  describe("borderRadius", () => {
    it("should configure borderRadius based on borderRadius selection", () => {
      const options = formatOptionsOf();
      const result = fig2twPlugin({
        variables: fixtures.variables,
        borderRadius: it => it.numbers,
      });

      expect(result.config?.theme).not.toBeUndefined();
      expect(result.config?.theme).toStrictEqual({
        extend: {},
        borderRadius: {
          three: toTwNumberValue("--numbers-three", options),
          five: toTwNumberValue("--numbers-five", options),
        },
      });
    });
  });

  describe("fontFamily", () => {
    it("should configure fontFamily based on fontFamily selection", () => {
      const options = formatOptionsOf();
      const result = fig2twPlugin({
        variables: fixtures.variables,
        fontFamily: it => it.strings,
      });

      expect(result.config?.theme).not.toBeUndefined();
      expect(result.config?.theme).toStrictEqual({
        extend: {},
        fontFamily: {
          foo: toTwStringValue("--strings-foo", options),
          bar: toTwStringValue("--strings-bar", options),
        },
      });
    });
  });

  describe("fontSize", () => {
    it("should configure fontSize based on fontSize selection", () => {
      const options = formatOptionsOf();
      const result = fig2twPlugin({
        variables: fixtures.variables,
        fontSize: it => it.numbers,
      });

      expect(result.config?.theme).not.toBeUndefined();
      expect(result.config?.theme).toStrictEqual({
        extend: {},
        fontSize: {
          three: toTwNumberValue("--numbers-three", options),
          five: toTwNumberValue("--numbers-five", options),
        },
      });
    });

    it("should configure fontSize based on fontSize and lineHeight selection", () => {
      const options = formatOptionsOf();
      const styles = ["heading", "body"] as const;
      const result = fig2twPlugin({
        variables: fixtures.variables,
        fontSize: it => pick(it.fonts, styles, p => p.fontSize),
        lineHeight: it => pick(it.fonts, styles, p => p.lineHeight),
      });

      expect(result.config?.theme).not.toBeUndefined();
      expect(result.config?.theme).toStrictEqual({
        extend: {},
        fontSize: {
          heading: [
            toTwNumberValue("--fonts-heading-fontsize", options),
            toTwNumberValue("--fonts-heading-lineheight", options),
          ],
          body: [
            toTwNumberValue("--fonts-body-fontsize", options),
            toTwNumberValue("--fonts-body-lineheight", options),
          ],
        },
      });
    });

    it("should configure fontSize based on fontSize, lineHeight, letterSpacing and fontWeight selection", () => {
      const options = formatOptionsOf();
      const styles = ["heading", "body"] as const;
      const result = fig2twPlugin({
        variables: fixtures.variables,
        fontSize: it => pick(it.fonts, styles, p => p.fontSize),
        lineHeight: it => pick(it.fonts, styles, p => p.lineHeight),
        letterSpacing: it => pick(it.fonts, styles, p => p.letterSpacing),
        fontWeight: it => pick(it.fonts, styles, p => p.fontWeight),
      });

      expect(result.config?.theme).not.toBeUndefined();
      expect(result.config?.theme).toStrictEqual({
        extend: {},
        fontSize: {
          heading: [
            toTwNumberValue("--fonts-heading-fontsize", options),
            {
              lineHeight: toTwNumberValue(
                "--fonts-heading-lineheight",
                options,
              ),
              fontWeight: toTwNumberValue(
                "--fonts-heading-fontweight",
                options,
              ),
              letterSpacing: toTwNumberValue(
                "--fonts-heading-letterspacing",
                options,
              ),
            },
          ],
          body: [
            toTwNumberValue("--fonts-body-fontsize", options),
            {
              lineHeight: toTwNumberValue("--fonts-body-lineheight", options),
              fontWeight: toTwNumberValue("--fonts-body-fontweight", options),
              letterSpacing: toTwNumberValue(
                "--fonts-body-letterspacing",
                options,
              ),
            },
          ],
        },
      });
    });
  });

  describe("lineHeight", () => {
    it("should configure lineHeight based on lineHeight selection", () => {
      const options = formatOptionsOf();
      const result = fig2twPlugin({
        variables: fixtures.variables,
        lineHeight: it => it.numbers,
      });

      expect(result.config?.theme).not.toBeUndefined();
      expect(result.config?.theme).toStrictEqual({
        extend: {},
        lineHeight: {
          three: toTwNumberValue("--numbers-three", options),
          five: toTwNumberValue("--numbers-five", options),
        },
      });
    });

    it("should configure lineHeight only when not defined in fontSize", () => {
      const options = formatOptionsOf();
      const result = fig2twPlugin({
        variables: fixtures.variables,
        fontSize: it => pick(it.fonts, ["heading"], it => it.fontSize),
        lineHeight: it =>
          pick(it.fonts, ["heading", "body"], it => it.lineHeight),
      });

      expect(result.config?.theme).not.toBeUndefined();
      expect(result.config?.theme).toStrictEqual({
        extend: {},
        fontSize: {
          heading: expect.anything(),
        },
        lineHeight: {
          body: toTwNumberValue("--fonts-body-lineheight", options),
        },
      });
    });
  });

  describe("fontWeight", () => {
    it("should configure fontWeight based on fontWeight selection", () => {
      const options = formatOptionsOf();
      const result = fig2twPlugin({
        variables: fixtures.variables,
        fontWeight: it => it.numbers,
      });

      expect(result.config?.theme).not.toBeUndefined();
      expect(result.config?.theme).toStrictEqual({
        extend: {},
        fontWeight: {
          three: toTwNumberValue("--numbers-three", options),
          five: toTwNumberValue("--numbers-five", options),
        },
      });
    });

    it("should configure fontWeight only when not defined in fontSize", () => {
      const options = formatOptionsOf();
      const result = fig2twPlugin({
        variables: fixtures.variables,
        fontSize: it => pick(it.fonts, ["heading"], it => it.fontSize),
        fontWeight: it =>
          pick(it.fonts, ["heading", "body"], it => it.fontWeight),
      });

      expect(result.config?.theme).not.toBeUndefined();
      expect(result.config?.theme).toStrictEqual({
        extend: {},
        fontSize: {
          heading: expect.anything(),
        },
        fontWeight: {
          body: toTwNumberValue("--fonts-body-fontweight", options),
        },
      });
    });
  });

  it("should configure letterSpacing only when not defined in fontSize", () => {
    const options = formatOptionsOf();
    const result = fig2twPlugin({
      variables: fixtures.variables,
      fontSize: it => pick(it.fonts, ["heading"], it => it.fontSize),
      letterSpacing: it =>
        pick(it.fonts, ["heading", "body"], it => it.letterSpacing),
    });

    expect(result.config?.theme).not.toBeUndefined();
    expect(result.config?.theme).toStrictEqual({
      extend: {},
      fontSize: {
        heading: expect.anything(),
      },
      letterSpacing: {
        body: toTwNumberValue("--fonts-body-letterspacing", options),
      },
    });
  });

  describe("screens", () => {
    it("should configure screens based on screens selection", () => {
      const options = formatOptionsOf();
      const result = fig2twPlugin({
        variables: fixtures.variables,
        screens: it => it.numbers,
      });

      expect(result.config?.theme).not.toBeUndefined();
      expect(result.config?.theme).toStrictEqual({
        extend: {},
        screens: {
          three: toTwNumberValue("--numbers-three", options),
          five: toTwNumberValue("--numbers-five", options),
        },
      });
    });
  });
});
