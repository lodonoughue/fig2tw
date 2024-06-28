import { describe, expect, it } from "vitest";
import {
  toCssVariableProperty,
  toCssSelectorFactory,
  toCssNumberRemValue,
  toCssColorValue,
  toCssStringValue,
  toCssClass,
} from "./formatters.js";
import { range, valueOf } from "@fig2tw/shared";
import { formatOptionsOf } from "./format.js";

const options = formatOptionsOf({ path: [], context: "test" });

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
        root: { selector: "html" },
      }),
    );
    expect(result).toBe("html, html.bar-baz");
  });
});

describe("toCssVariableProperty", () => {
  it("should format path to kebab case with two leading dashes", () => {
    const path = ["some", "Var witH", "sTrange cases"];
    const result = toCssVariableProperty(
      formatOptionsOf({ context: "test", path }),
    );
    expect(result).toBe("--test-some-var-with-strange-cases");
  });

  it.each([["color"], ["size"], ["space"], ["radius"]])(
    "should prefix the variable with the context",
    context => {
      const path = ["path"];
      const result = toCssVariableProperty(formatOptionsOf({ path, context }));
      expect(result).toBe(`--${context}-path`);
    },
  );
});

describe("toCssNumberRemValue", () => {
  it.each([[12], [16], [32]])(
    "should return a rem value relative to the fontSize (%spx)",
    fontSizePx => {
      const opts = formatOptionsOf({ ...options, root: { fontSizePx } });
      const value = valueOf("foo", "bar", 16);
      const result = toCssNumberRemValue(value, opts);
      expect(result).toBe(`${16 / fontSizePx}rem`);
    },
  );
});

describe("toCssColorValue", () => {
  it("should return the rgba values directly", () => {
    const value = valueOf("foo", "bar", { r: 3, g: 5, b: 7, a: 0.5 });
    const result = toCssColorValue(value, options);
    expect(result).toBe("3, 5, 7, 0.5");
  });
});

describe("toCssStringValue", () => {
  it("should return the string value directly", () => {
    const value = valueOf("foo", "bar", "baz");
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
