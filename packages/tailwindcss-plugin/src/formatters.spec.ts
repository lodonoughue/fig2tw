import { describe, expect, it } from "vitest";
import {
  toCssVariableProperty,
  toCssSelectorFactory,
  toCssNumberRemValue,
  toCssColorValue,
  toCssStringValue,
  toCssClass,
  formatOptionsOf,
} from "./formatters.js";
import { range, valueOf } from "@fig2tw/shared";

const options = formatOptionsOf();

describe("toCssSelector", () => {
  it("should return a selector targeting :root and :root.classname", () => {
    const toCssSelector = toCssSelectorFactory();
    const result = toCssSelector("foo", "bar-baz", options);
    expect(result).toBe(":root, :root.bar-baz");
  });

  it("should not return a selector targeting :root if another classname claimed it previously", () => {
    const toCssSelector = toCssSelectorFactory();
    const first = toCssSelector("foo", "bar", options);
    const second = toCssSelector("foo", "baz", options);
    expect(first).toBe(":root, :root.bar");
    expect(second).toBe(":root.baz");
  });

  it("should return a selector targeting :root for each collection", () => {
    const toCssSelector = toCssSelectorFactory();
    const fooSelector = toCssSelector("foo", "foo-classname", options);
    const barSelector = toCssSelector("bar", "bar-classname", options);
    expect(fooSelector).toBe(":root, :root.foo-classname");
    expect(barSelector).toBe(":root, :root.bar-classname");
  });

  it("should return constistent selectors", () => {
    const toCssSelector = toCssSelectorFactory();
    const specs = [
      { collection: "col-a", classname: "foo" },
      { collection: "col-a", classname: "bar" },
      { collection: "col-a", classname: "baz" },
      { collection: "col-b", classname: "foo" },
      { collection: "col-b", classname: "bar" },
      { collection: "col-b", classname: "baz" },
    ];
    const [firstResults, secondResults] = range(0, 2).map(() =>
      specs.map(({ collection, classname }) =>
        toCssSelector(collection, classname, options),
      ),
    );

    expect(firstResults).toStrictEqual(secondResults);
  });

  it("should use the :root selector provided in the options", () => {
    const toCssSelector = toCssSelectorFactory();
    const result = toCssSelector(
      "foo",
      "bar-baz",
      formatOptionsOf({
        ...options,
        config: { rootSelector: "html" },
      }),
    );
    expect(result).toBe("html, html.bar-baz");
  });
});

describe("toCssVariableProperty", () => {
  it("should format path to kebab case with two leading dashes", () => {
    const variablePath = ["some", "Var witH", "sTrange cases"];
    const result = toCssVariableProperty(formatOptionsOf({ variablePath }));
    expect(result).toBe("--some-var-with-strange-cases");
  });
});

describe("toCssNumberRemValue", () => {
  it.each([[12], [16], [32]])(
    "should return a rem value relative to the fontSize (%spx)",
    rootFontSizePx => {
      const opts = formatOptionsOf({ ...options, config: { rootFontSizePx } });
      const value = valueOf([], "foo", "bar", 16);
      const result = toCssNumberRemValue(value, opts);
      expect(result).toBe(`${16 / rootFontSizePx}rem`);
    },
  );
});

describe("toCssColorValue", () => {
  it("should return the rgb values directly, without alpha", () => {
    const value = valueOf([], "foo", "bar", { r: 3, g: 5, b: 7, a: 0.5 });
    const result = toCssColorValue(value, options);
    expect(result).toBe("3 5 7");
  });
});

describe("toCssStringValue", () => {
  it("should return the string value directly", () => {
    const value = valueOf([], "foo", "bar", "baz");
    const result = toCssStringValue(value, options);
    expect(result).toBe("baz");
  });
});

describe("toCssClass", () => {
  it("should return a class with the pattern collection__mode", () => {
    const result = toCssClass("Foo Bar", "Baz Buz");
    expect(result).toBe("foo-bar__baz-buz");
  });
});
