import { Config } from "@common/config";
import {
  formatCssColorHex,
  formatCssColorTwRgb,
  formatCssModeSelector,
  formatCssNumber,
  formatCssString,
  formatCssVariableName,
  formatCssVariableRef,
  formatKebabCase,
} from "./formatters";
import { describe, expect, it } from "vitest";
import { Collection } from "@common/variables";
import { fixtures } from "./fixtures";

describe("formatCssNumber", () => {
  it.each([
    { unit: "px", baseFontSize: 16, value: 42, expectedResult: "42px" },
    { unit: "em", baseFontSize: 16, value: 32, expectedResult: "2em" },
    { unit: "rem", baseFontSize: 16, value: 32, expectedResult: "2rem" },
    { unit: "none", baseFontSize: 16, value: 42, expectedResult: "42" },
  ] as const)(
    "should format $unit number",
    ({ unit, baseFontSize, value, expectedResult }) => {
      const numberValue = fixtures.createNumberValue({ value });
      const variable = fixtures.createNumberVariable({
        defaultValue: numberValue,
        scopes: ["all-numbers"],
      });
      const options = fixtures.createOptions({
        config: fixtures.createConfig({
          baseFontSize,
          units: fixtures.createUnitsConfig({ "all-numbers": unit }),
        }),
      });

      const result = formatCssNumber(numberValue, variable, options);

      expect(result).toBe(expectedResult);
    },
  );

  it("should as px when unit is not configured", () => {
    const value = fixtures.createNumberValue({ value: 42 });
    const variable = fixtures.createNumberVariable({
      defaultValue: value,
      scopes: ["all-numbers"],
    });
    const options = fixtures.createOptions({
      config: fixtures.createConfig({
        units: fixtures.createUnitsConfig({
          "all-numbers": undefined as never,
        }),
      }),
    });

    const result = formatCssNumber(value, variable, options);
    expect(result).toBe("42px");
  });

  it("should throw when unit is not supported", () => {
    const variable = fixtures.createNumberVariable({
      scopes: ["all-numbers"],
    });
    const options = fixtures.createOptions({
      config: fixtures.createConfig({
        units: fixtures.createUnitsConfig({ "all-numbers": "never" as never }),
      }),
    });

    expect(() => {
      formatCssNumber(variable.defaultValue, variable, options);
    }).toThrow("Unsupported value type");
  });

  it("should throw when value type is not supported", () => {
    const value = fixtures.createNumberValue({ type: "never" as never });
    const variable = fixtures.createNumberVariable({
      defaultValue: value,
      scopes: ["all-numbers"],
    });
    const options = fixtures.createOptions({});

    expect(() => {
      formatCssNumber(value, variable, options);
    }).toThrow("Unsupported value type");
  });

  it("should format alias value without default value", () => {
    const alias = { key: "Collection/Number/Foo" };
    const value = fixtures.createAliasValue({ value: alias });
    const variable = fixtures.createNumberVariable({
      valuesByMode: { Mode: value },
    });
    const options = fixtures.createOptions({
      config: fixtures.createConfig({ hasDefaultValues: false }),
    });

    const result = formatCssNumber(value, variable, options);

    expect(result).toBe("var(--collection-number-foo)");
  });

  it("should format alias value with default value", () => {
    const alias = { key: "Collection/Number/Bar" };
    const value = fixtures.createAliasValue({ value: alias });
    const defaultValue = fixtures.createNumberValue({ value: 42 });
    const variable = fixtures.createNumberVariable({
      valuesByMode: { Mode: value },
      defaultValue,
      scopes: ["all-numbers"],
    });
    const options = fixtures.createOptions({
      config: fixtures.createConfig({
        units: fixtures.createUnitsConfig({
          "all-numbers": "px",
        }),
      }),
      formatters: fixtures.createFormattersOption({
        formatNumber: formatCssNumber,
      }),
    });

    const result = formatCssNumber(value, variable, options);

    expect(result).toBe("var(--collection-number-bar, 42px)");
  });
});

describe("formatCssString", () => {
  it("should format string", () => {
    const value = fixtures.createStringValue({ value: "Foo" });
    const variable = fixtures.createStringVariable({
      defaultValue: value,
      scopes: ["all-strings"],
    });
    const options = fixtures.createOptions({});

    const result = formatCssString(value, variable, options);

    expect(result).toBe("Foo");
  });

  it("should format string with spaces", () => {
    const value = fixtures.createStringValue({ value: "Foo Bar" });
    const variable = fixtures.createStringVariable({
      defaultValue: value,
      scopes: ["all-strings"],
    });
    const options = fixtures.createOptions({});

    const result = formatCssString(value, variable, options);

    expect(result).toBe('"Foo Bar"');
  });

  it("should throw when value type is not supported", () => {
    const value = fixtures.createStringValue({ type: "never" as never });
    const variable = fixtures.createStringVariable({
      defaultValue: value,
      scopes: ["all-strings"],
    });
    const options = fixtures.createOptions({});

    expect(() => {
      formatCssString(value, variable, options);
    }).toThrow("Unsupported value type");
  });

  it("should format alias value without default value", () => {
    const alias = { key: "Collection/String/Foo" };
    const value = fixtures.createAliasValue({ value: alias });
    const variable = fixtures.createStringVariable({
      valuesByMode: { Mode: value },
    });
    const options = fixtures.createOptions({
      config: fixtures.createConfig({ hasDefaultValues: false }),
    });

    const result = formatCssString(value, variable, options);

    expect(result).toBe("var(--collection-string-foo)");
  });

  it("should format alias value with default value", () => {
    const alias = { key: "Collection/String/Bar" };
    const value = fixtures.createAliasValue({ value: alias });
    const defaultValue = fixtures.createStringValue({ value: "Baz" });
    const variable = fixtures.createStringVariable({
      valuesByMode: { Mode: value },
      defaultValue,
      scopes: ["all-strings"],
    });
    const options = fixtures.createOptions({
      formatters: fixtures.createFormattersOption({
        formatString: formatCssString,
      }),
    });

    const result = formatCssString(value, variable, options);

    expect(result).toBe("var(--collection-string-bar, Baz)");
  });
});

describe("formatCssColorHex", () => {
  it.each([
    { rgba: [255, 255, 0, 1], expectedColor: "#ffff00" },
    { rgba: [0, 255, 0, 1], expectedColor: "#00ff00" },
    { rgba: [0, 0, 255, 0], expectedColor: "#0000ff00" },
  ] as const)("should format color", ({ rgba, expectedColor }) => {
    const value = fixtures.createColorValue({ value: { rgba: [...rgba] } });
    const variable = fixtures.createColorVariable({
      defaultValue: value,
      scopes: ["all-colors"],
    });
    const options = fixtures.createOptions({});

    const result = formatCssColorHex(value, variable, options);

    expect(result).toBe(expectedColor);
  });

  it("should throw when value type is not supported", () => {
    const value = fixtures.createColorValue({ type: "never" as never });
    const variable = fixtures.createColorVariable({
      defaultValue: value,
      scopes: ["all-colors"],
    });
    const options = fixtures.createOptions({});

    expect(() => {
      formatCssColorHex(value, variable, options);
    }).toThrow("Unsupported value type");
  });

  it("should format alias value without default value", () => {
    const alias = { key: "Collection/Color/Foo" };
    const value = fixtures.createAliasValue({ value: alias });
    const variable = fixtures.createColorVariable({
      valuesByMode: { Mode: value },
    });
    const options = fixtures.createOptions({
      config: fixtures.createConfig({ hasDefaultValues: false }),
    });

    const result = formatCssColorHex(value, variable, options);

    expect(result).toBe("var(--collection-color-foo)");
  });

  it("should format alias value with default value", () => {
    const alias = { key: "Collection/Color/Bar" };
    const value = fixtures.createAliasValue({ value: alias });
    const defaultValue = fixtures.createColorValue({
      value: { hex: "#ff0000" },
    });
    const variable = fixtures.createColorVariable({
      valuesByMode: { Mode: value },
      defaultValue,
      scopes: ["all-colors"],
    });
    const options = fixtures.createOptions({
      formatters: fixtures.createFormattersOption({
        formatColor: formatCssColorHex,
      }),
    });

    const result = formatCssColorHex(value, variable, options);

    expect(result).toBe("var(--collection-color-bar, #ff0000)");
  });
});

describe("formatCssColorTwRgb", () => {
  it.each([
    { rgba: [255, 255, 0, 1], expectedColor: "255 255 0" },
    { rgba: [0, 255, 0, 1], expectedColor: "0 255 0" },
    { rgba: [0, 0, 255, 0], expectedColor: "0 0 255" },
  ] as const)("should format color", ({ rgba, expectedColor }) => {
    const value = fixtures.createColorValue({ value: { rgba: [...rgba] } });
    const variable = fixtures.createColorVariable({
      defaultValue: value,
      scopes: ["all-colors"],
    });
    const options = fixtures.createOptions({});

    const result = formatCssColorTwRgb(value, variable, options);

    expect(result).toBe(expectedColor);
  });

  it("should throw when value type is not supported", () => {
    const value = fixtures.createColorValue({ type: "never" as never });
    const variable = fixtures.createColorVariable({
      defaultValue: value,
      scopes: ["all-colors"],
    });
    const options = fixtures.createOptions({});

    expect(() => {
      formatCssColorTwRgb(value, variable, options);
    }).toThrow("Unsupported value type");
  });

  it("should format alias value without default value", () => {
    const alias = { key: "Collection/Color/Foo" };
    const value = fixtures.createAliasValue({ value: alias });
    const variable = fixtures.createColorVariable({
      valuesByMode: { Mode: value },
    });
    const options = fixtures.createOptions({
      config: fixtures.createConfig({ hasDefaultValues: false }),
    });

    const result = formatCssColorTwRgb(value, variable, options);

    expect(result).toBe("var(--collection-color-foo)");
  });

  it("should format alias value with default value", () => {
    const alias = { key: "Collection/Color/Bar" };
    const value = fixtures.createAliasValue({ value: alias });
    const defaultValue = fixtures.createColorValue({
      value: { hex: "#ff0000" },
    });
    const variable = fixtures.createColorVariable({
      valuesByMode: { Mode: value },
      defaultValue,
      scopes: ["all-colors"],
    });
    const options = fixtures.createOptions({
      formatters: fixtures.createFormattersOption({
        formatColor: formatCssColorTwRgb,
      }),
    });

    const result = formatCssColorTwRgb(value, variable, options);

    expect(result).toBe("var(--collection-color-bar, 255 0 0)");
  });
});

describe("formatCssVariableName", () => {
  it("should format variable key", () => {
    const variable = fixtures.createNumberVariable({
      key: "Collection/Foo Bar/Baz",
    });

    const result = formatCssVariableName(variable);

    expect(result).toBe("--collection-foo-bar-baz");
  });

  it("should format alias key", () => {
    const alias = fixtures.createAliasValue({
      value: { key: "Collection/Foo Bar/Baz" },
    });

    const result = formatCssVariableName(alias);

    expect(result).toBe("--collection-foo-bar-baz");
  });
});

describe("formatCssVariableRef", () => {
  it("should throw when variable type is not supported", () => {
    const alias = { key: "Collection/Number/Bar" };
    const value = fixtures.createAliasValue({ value: alias });
    const variable = fixtures.createNumberVariable({
      type: "never" as never,
      valuesByMode: { Mode: value },
    });
    const options = fixtures.createOptions({});

    expect(() => formatCssVariableRef(value, variable, options)).toThrow(
      "Unsupported value type",
    );
  });
});

describe("formatKebabCase", () => {
  it.each([
    ["Hello World", "hello-world"],
    ["Hello  World", "hello-world"],
    ["Hello-World", "hello-world"],
    ["Hello - World", "hello-world"],
  ])("should replace spaces with hyphens (%s -> %s)", (value, expected) => {
    expect(formatKebabCase(value)).toBe(expected);
  });

  it.each([
    [" Hello World ", "hello-world"],
    ["\t Hello  World \t", "hello-world"],
    ["-Hello  World-", "hello-world"],
    ["- Hello  World -", "hello-world"],
  ])("should replace trim start and end (%s -> %s)", (value, expected) => {
    expect(formatKebabCase(value)).toBe(expected);
  });

  it.each([
    ["HelloWorld", "hello-world"],
    ["helloWorld", "hello-world"],
    ["HelloFooWorld", "hello-foo-world"],
    ["HelloFOOWorld", "hello-foo-world"],
  ])(
    "should break camel case words with hyphens (%s -> %s)",
    (value, expected) => {
      expect(formatKebabCase(value)).toBe(expected);
    },
  );

  it.each([
    ["hello/world", "hello-world"],
    ["hello//world--", "hello-world"],
    ["--hello-/-world--", "hello-world"],
    ["/hello/world/", "hello-world"],
  ])("should replace slashes with hyphens (%s -> %s)", (value, expected) => {
    expect(formatKebabCase(value)).toBe(expected);
  });

  it.each([
    ["hello@world", "hello-1s-world"],
    ["hello-@-world", "hello-1s-world"],
    ["hello^world", "hello-2m-world"],
    ["hello,world", "hello-18-world"],
  ])(
    "should replace non-alphanumeric characters base36 (%s -> %s)",
    (value, expected) => {
      expect(formatKebabCase(value)).toBe(expected);
    },
  );
});

describe("formatCssModeSelector", () => {
  it.each([
    {
      rootSelector: undefined,
      collection: "foo-bar",
      mode: "baz",
      isDefaultMode: false,
      expected: ".foo-bar-baz",
    },
    {
      rootSelector: undefined,
      collection: "foo-bar",
      mode: "baz",
      isDefaultMode: true,
      expected: ".foo-bar-baz",
    },
    {
      rootSelector: "  ",
      collection: "foo-bar",
      mode: "baz",
      isDefaultMode: false,
      expected: ".foo-bar-baz",
    },
    {
      rootSelector: ":root",
      collection: "FooBar",
      mode: "baz",
      isDefaultMode: false,
      expected: ".foo-bar-baz",
    },
    {
      rootSelector: ":root",
      collection: "Foo Bar",
      mode: "Baz",
      isDefaultMode: true,
      expected: ":root, .foo-bar-baz",
    },
  ])(
    "should return expected selector ($expected)",
    ({ collection, mode, isDefaultMode, rootSelector, expected }) => {
      const config = { rootSelector } as never as Config;
      const col = {
        name: collection,
        defaultMode: isDefaultMode ? mode : "never",
      } as never as Collection;

      expect(formatCssModeSelector(col, mode, config)).toBe(expected);
    },
  );
});
