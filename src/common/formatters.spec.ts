import { Config } from "@common/config";
import { formatCssModeSelector, formatKebabCase } from "./formatters";
import { describe, expect, it } from "vitest";
import { Collection } from "@common/variables";

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
