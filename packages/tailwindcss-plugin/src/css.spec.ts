import {
  BooleanValue,
  ColorValue,
  NumberValue,
  RefVariable,
  StringValue,
  fixtures,
} from "@fig2tw/shared";
import { buildCssBundle } from "./css.js";
import { describe, expect, it } from "vitest";
import { pluginOptionsOf } from "./plugin.js";
import { FormatOptions } from "./formatters.js";

function toCssColorValue({ r, g, b, a }: ColorValue["value"]) {
  return `mocked: ${r} ${g} ${b} ${a}`;
}

function toCssStringValue(value: StringValue["value"]) {
  return `mocked: ${value}`;
}

function toCssBooleanValue(value: BooleanValue["value"]) {
  return `mocked: ${value}`;
}

function toCssNumberValue(value: NumberValue["value"]) {
  return `mocked: ${value}`;
}

function toCssRefValue(ref: RefVariable<string>["ref"]) {
  return `mocked: [${ref}]`;
}

const opts = pluginOptionsOf({
  formatters: {
    toCssColorValue,
    toCssStringValue,
    toCssBooleanValue,
    toCssNumberValue,
    toCssRefValue,
  },
});

describe("buildCssBundle", () => {
  it("should return an empty bundle if variable object is empty", () => {
    const result = buildCssBundle("unknown", {}, {}, opts);
    expect(result).toStrictEqual({});
  });

  it("should build expected css model", () => {
    const selection = fixtures.pickCollections([
      "colors",
      "strings",
      "numbers",
      "booleans",
      "refs",
    ]);

    const result = buildCssBundle(
      "unknown",
      fixtures.variables,
      selection,
      opts,
    );
    expect(result).toStrictEqual({
      ":root, :root.colors__light": {
        "--colors-red": toCssColorValue(fixtures.lightRed),
        "--colors-blue": toCssColorValue(fixtures.lightBlue),
      },
      ":root.colors__dark": {
        "--colors-red": toCssColorValue(fixtures.darkRed),
        "--colors-blue": toCssColorValue(fixtures.darkBlue),
      },
      ":root, :root.strings__single": {
        "--strings-foo": toCssStringValue(fixtures.singleFoo),
        "--strings-bar": toCssStringValue(fixtures.singleBar),
      },
      ":root.strings__double": {
        "--strings-foo": toCssStringValue(fixtures.doubleFoo),
        "--strings-bar": toCssStringValue(fixtures.doubleBar),
      },
      ":root, :root.numbers__regular": {
        "--numbers-three": toCssNumberValue(fixtures.regularThree),
        "--numbers-five": toCssNumberValue(fixtures.regularFive),
      },
      ":root.numbers__powered": {
        "--numbers-three": toCssNumberValue(fixtures.poweredThree),
        "--numbers-five": toCssNumberValue(fixtures.poweredFive),
      },
      ":root, :root.booleans__regular": {
        "--booleans-truthy": toCssBooleanValue(fixtures.regularTruthy),
        "--booleans-falsy": toCssBooleanValue(fixtures.regularFalsy),
      },
      ":root.booleans__inverse": {
        "--booleans-truthy": toCssBooleanValue(fixtures.inverseTruthy),
        "--booleans-falsy": toCssBooleanValue(fixtures.inverseFalsy),
      },
      ":root, :root.refs__first": {
        "--refs-colors": toCssRefValue(fixtures.redRef),
        "--refs-strings": toCssRefValue(fixtures.fooRef),
        "--refs-numbers": toCssRefValue(fixtures.threeRef),
        "--refs-booleans": toCssRefValue(fixtures.truthyRef),
        "--refs-refs": toCssRefValue(fixtures.refColorRef),
      },
      ":root.refs__second": {
        "--refs-colors": toCssRefValue(fixtures.blueRef),
        "--refs-strings": toCssRefValue(fixtures.barRef),
        "--refs-numbers": toCssRefValue(fixtures.fiveRef),
        "--refs-booleans": toCssRefValue(fixtures.falsyRef),
        "--refs-refs": toCssRefValue(fixtures.refStringRef),
      },
    });
  });

  it("should use formatters from options", () => {
    const selection = fixtures.pickCollections(["types"]);

    const toCssSelector = (_: string, classname: string) =>
      `:mocked-selector${classname}`;
    const toCssClass = () => ".mocked-class";
    const toCssVariableProperty = ({ variablePath }: FormatOptions) =>
      `--mocked-${variablePath[1]}`;
    const toCssNumberValue = () => "mocked-number";
    const toCssStringValue = () => "mocked-string";
    const toCssBooleanValue = () => "mocked-boolean";
    const toCssColorValue = () => "mocked-color";
    const toCssRefValue = () => "mocked-ref";

    const result = buildCssBundle(
      "unknown",
      fixtures.variables,
      selection.types,
      pluginOptionsOf({
        formatters: {
          toCssSelector,
          toCssClass,
          toCssVariableProperty,
          toCssNumberValue,
          toCssStringValue,
          toCssBooleanValue,
          toCssColorValue,
          toCssRefValue,
        },
      }),
    );

    expect(result).toStrictEqual({
      ":mocked-selector.mocked-class": {
        "--mocked-color": "mocked-color",
        "--mocked-string": "mocked-string",
        "--mocked-number": "mocked-number",
        "--mocked-boolean": "mocked-boolean",
        "--mocked-ref": "mocked-ref",
      },
    });
  });

  it("should throw when formatting unknown types of variables", () => {
    const selection = fixtures.pickCollections(["faulty"]);
    expect(() =>
      buildCssBundle("unknown", fixtures.variables, selection, opts),
    ).toThrow("cannot format css value of type");
  });
});
