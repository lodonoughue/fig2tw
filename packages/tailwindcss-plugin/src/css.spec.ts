import { ValueStruct, valueOf } from "@fig2tw/shared";
import { buildCssBundle } from "./css.js";
import { describe, expect, it } from "vitest";
import { FormatOptions } from "./format.js";
import { pluginOptionsOf } from "./plugin.js";

const opts = pluginOptionsOf();

describe("buildCssBundle", () => {
  it("should return an empty bundle if struct is empty", () => {
    const result = buildCssBundle("test", {}, opts);
    expect(result).toStrictEqual({});
  });

  it("should build expected css model", () => {
    const variables = {
      foo: [
        valueOf("Mode", "Light", "foo-light"),
        valueOf("Mode", "Dark", "foo-dark"),
      ],
      bar: {
        "Bar A": [
          valueOf("Mode", "Light", "bar-a-light"),
          valueOf("Mode", "Dark", "bar-a-dark"),
        ],
        "Bar B": [
          valueOf("Mode", "Light", "bar-b-light"),
          valueOf("Mode", "Dark", "bar-b-dark"),
        ],
      },
      baz: [valueOf("Size", "Regular", "baz-regular")],
    } satisfies ValueStruct;

    const result = buildCssBundle("test", variables, opts);
    expect(result).toStrictEqual({
      ":root, :root.mode__light": {
        "--test-foo": "foo-light",
        "--test-bar-bar-a": "bar-a-light",
        "--test-bar-bar-b": "bar-b-light",
      },
      ":root.mode__dark": {
        "--test-foo": "foo-dark",
        "--test-bar-bar-a": "bar-a-dark",
        "--test-bar-bar-b": "bar-b-dark",
      },
      ":root, :root.size__regular": {
        "--test-baz": "baz-regular",
      },
    });
  });

  it("should use formatters from options", () => {
    const variables = {
      foo: [valueOf("foo", "bar", 42)],
      bar: [valueOf("foo", "bar", "value")],
      baz: [valueOf("foo", "bar", true)],
      buz: [valueOf("foo", "bar", { r: 0, g: 0, b: 0, a: 0 })],
    };

    const toCssSelector = (_: string, classname: string) =>
      `mocked-selector__${classname}`;
    const toCssVariableProperty = ({ path }: FormatOptions) =>
      `mocked-variable-${path![0]}`;
    const toCssClass = () => "mocked-class";
    const toCssNumberValue = () => "mocked-number";
    const toCssStringValue = () => "mocked-string";
    const toCssBooleanValue = () => "mocked-boolean";
    const toCssColorValue = () => "mocked-color";

    const result = buildCssBundle(
      "test",
      variables,
      pluginOptionsOf({
        formatters: {
          toCssSelector,
          toCssClass,
          toCssVariableProperty,
          toCssNumberValue,
          toCssStringValue,
          toCssBooleanValue,
          toCssColorValue,
        },
      }),
    );

    expect(result).toStrictEqual({
      "mocked-selector__mocked-class": {
        "mocked-variable-foo": "mocked-number",
        "mocked-variable-bar": "mocked-string",
        "mocked-variable-baz": "mocked-boolean",
        "mocked-variable-buz": "mocked-color",
      },
    });
  });
});
