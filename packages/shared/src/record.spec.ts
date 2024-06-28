import { describe, expect, it } from "vitest";
import { buildRecord } from "./record.js";

describe("buildRecord", () => {
  it("should return expected object", () => {
    const entries = [
      { key: "foo", value: "foo-value" },
      { key: "bar", value: "bar-value" },
      { key: "baz", value: "baz-value" },
    ];
    const result = buildRecord(
      entries,
      it => it.key,
      it => it.value,
    );
    expect(result).toStrictEqual({
      foo: "foo-value",
      bar: "bar-value",
      baz: "baz-value",
    });
  });

  it("should return expected multi-level object", () => {
    const entries = [
      { key: "foo", value: "foo-value" },
      { key: "bar/baz", value: "bar-baz-value" },
    ];
    const result = buildRecord(
      entries,
      it => it.key.split("/"),
      it => it.value,
    );
    expect(result).toStrictEqual({
      foo: "foo-value",
      bar: {
        baz: "bar-baz-value",
      },
    });
  });

  it("should throw when trying to assign a value that already exists", () => {
    const entries = [
      { key: "foo", value: "foo-value" },
      { key: "foo", value: "override" },
    ];
    expect(() =>
      buildRecord(
        entries,
        it => it.key,
        it => it.value,
      ),
    ).toThrow("fig2tw: duplicate key");
  });

  it("should throw when trying to assign a value to an object", () => {
    const entries = [
      { key: "foo/bar", value: "foo-value" },
      { key: "foo/bar/baz", value: "object-value clash" },
    ];

    expect(() =>
      buildRecord(
        entries,
        it => it.key.split("/"),
        it => it.value,
      ),
    ).toThrow(
      "fig2tw: cannot assign an object to an already assigned variable",
    );
  });
});
