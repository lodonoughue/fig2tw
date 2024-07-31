import { describe, expect, it } from "vitest";
import {
  toCssVariableProperty,
  toCssSelectorFactory,
  toCssColorValue,
  toCssStringValue,
  toCssClass,
  formatOptionsOf,
  toCssBooleanValue,
  toCssRefValue,
  toTwProperty,
  toTwColorValue,
  toTwStringValue,
  toTwRefValue,
  toTwBooleanValue,
  toTwNumberValue,
  toCssNumberValue,
} from "./formatters.js";
import { range } from "@fig2tw/shared";

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

describe("toCssNumberValue", () => {
  describe.each([
    ["unknown"],
    ["fontSize"],
    ["lineHeight"],
    ["spacing"],
  ] as const)("context %s", context => {
    it.each([[12], [16], [32]])(
      "should return a rem value relative to the fontSize (%spx)",
      rootFontSizePx => {
        const opts = formatOptionsOf({
          ...options,
          context,
          config: { rootFontSizePx },
        });
        const result = toCssNumberValue(16, opts);
        expect(result).toBe(`${16 / rootFontSizePx}rem`);
      },
    );
  });

  describe.each([["screens"]] as const)("context %s", context => {
    it("should return a px value without transformation", () => {
      const opts = formatOptionsOf({ context });
      const result = toCssNumberValue(16, opts);
      expect(result).toBe("16px");
    });
  });

  describe.each([["fontWeight"]] as const)("context %s", context => {
    it("should return a string value without any unit", () => {
      const opts = formatOptionsOf({ context });
      const result = toCssNumberValue(16, opts);
      expect(result).toBe("16");
    });
  });

  describe.each([["letterSpacing"]] as const)("context %s", context => {
    it.each([[12], [16], [32]])(
      "should return a em value relative to the fontSize %s",
      rootFontSizePx => {
        const opts = formatOptionsOf({
          ...options,
          context,
          config: { rootFontSizePx },
        });
        const result = toCssNumberValue(16, opts);
        expect(result).toBe(`${16 / rootFontSizePx}em`);
      },
    );
  });
});

describe("toCssColorValue", () => {
  it("should return the rgb values directly, without alpha", () => {
    const result = toCssColorValue({ r: 3, g: 5, b: 7, a: 0.5 }, options);
    expect(result).toBe("3 5 7");
  });
});

describe("toCssStringValue", () => {
  it("should return the string value directly", () => {
    const result = toCssStringValue("foo", options);
    expect(result).toBe("foo");
  });
});

describe("toCssBooleanValue", () => {
  it.each([
    ["true", true],
    ["false", false],
  ])("should return the boolean value as %s", (expectedValue, value) => {
    const result = toCssBooleanValue(value, options);
    expect(result).toBe(expectedValue);
  });
});

describe("toCssRefValue", () => {
  it("should return the ref value as a css variable", () => {
    const result = toCssRefValue(["foo", "bar"], options);
    expect(result).toBe("var(--foo-bar)");
  });
});

describe("toCssClass", () => {
  it("should return a class with the pattern collection__mode", () => {
    const result = toCssClass("Foo Bar Baz", "Baz Bar Foo");
    expect(result).toBe("foo-bar-baz__baz-bar-foo");
  });
});

describe("toTwProperty", () => {
  it.each([
    { path: ["foo", "bar"], expectedResult: "foo-bar" },
    { path: ["FoO", "bAr"], expectedResult: "foo-bar" },
    { path: ["FoO bAr"], expectedResult: "foo-bar" },
    { path: ["FoObAr"], expectedResult: "foobar" },
    { path: ["FoO bAr", "baZ"], expectedResult: "foo-bar-baz" },
    { path: ["FoO bAr", "b@Z"], expectedResult: "foo-bar-b_z" },
    { path: ["FoO bAr", "b@Z", "_"], expectedResult: "foo-bar-b_z-_" },
  ])(
    "should return the expected result $expectedResult",
    ({ path, expectedResult }) => {
      const opts = formatOptionsOf({ selectorPath: path });
      const result = toTwProperty(opts);
      expect(result).toBe(expectedResult);
    },
  );
});

describe("toTwColorValue", () => {
  it("should wrap the var with rgb and add a tailwind placeholder for opacity", () => {
    const result = toTwColorValue("--foo-bar", options);
    expect(result).toBe("rgb(var(--foo-bar) / <alpha-value>)");
  });
});

describe.each([
  [toTwStringValue],
  [toTwNumberValue],
  [toTwBooleanValue],
  [toTwRefValue],
])("%s", fn => {
  it("should directly reference the variable", () => {
    const result = fn("--foo-bar", options);
    expect(result).toBe("var(--foo-bar)");
  });
});
