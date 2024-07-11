import { VariableObject, valueOf } from "@fig2tw/shared";
import { buildCssBundle } from "./css.js";
import { describe, expect, it } from "vitest";
import { pluginOptionsOf } from "./plugin.js";
import { FormatOptions } from "./formatters.js";

const opts = pluginOptionsOf();

describe("buildCssBundle", () => {
  it("should return an empty bundle if variable object is empty", () => {
    const result = buildCssBundle("test", {}, {}, opts);
    expect(result).toStrictEqual({});
  });

  it("should build expected css model", () => {
    const fooPath = ["Foo"];
    const barAPath = ["Bar", "Bar A"];
    const barBPath = ["Bar", "Bar B"];
    const bazPath = ["Baz"];
    const variables = {
      foo: [
        valueOf(fooPath, "Mode", "Light", "foo-light"),
        valueOf(fooPath, "Mode", "Dark", "foo-dark"),
      ],
      bar: {
        "Bar A": [
          valueOf(barAPath, "Mode", "Light", "bar-a-light"),
          valueOf(barAPath, "Mode", "Dark", "bar-a-dark"),
        ],
        "Bar B": [
          valueOf(barBPath, "Mode", "Light", "bar-b-light"),
          valueOf(barBPath, "Mode", "Dark", "bar-b-dark"),
        ],
      },
      baz: [valueOf(bazPath, "Size", "Regular", "baz-regular")],
    } satisfies VariableObject;

    const result = buildCssBundle("test", {}, variables, opts);
    expect(result).toStrictEqual({
      ":root, :root.mode__light": {
        "--foo": "foo-light",
        "--bar-bar-a": "bar-a-light",
        "--bar-bar-b": "bar-b-light",
      },
      ":root.mode__dark": {
        "--foo": "foo-dark",
        "--bar-bar-a": "bar-a-dark",
        "--bar-bar-b": "bar-b-dark",
      },
      ":root, :root.size__regular": {
        "--baz": "baz-regular",
      },
    });
  });

  it("should use formatters from options", () => {
    const variables = {
      foo: [valueOf([], "foo", "bar", 42)],
      bar: [valueOf([], "foo", "bar", "value")],
      baz: [valueOf([], "foo", "bar", true)],
      buz: [valueOf([], "foo", "bar", { r: 0, g: 0, b: 0, a: 0 })],
    };

    const toCssSelector = (_: string, classname: string) =>
      `mocked-selector__${classname}`;
    const toCssVariableProperty = ({ selectorPath }: FormatOptions) =>
      `mocked-variable-${selectorPath![0]}`;
    const toCssClass = () => "mocked-class";
    const toCssNumberValue = () => "mocked-number";
    const toCssStringValue = () => "mocked-string";
    const toCssBooleanValue = () => "mocked-boolean";
    const toCssColorValue = () => "mocked-color";

    const result = buildCssBundle(
      "test",
      {},
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
