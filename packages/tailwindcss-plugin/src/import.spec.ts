import { describe, expect, it, vi } from "vitest";
import { ImportOptions, importVariables } from "./import.js";
import { fixtures } from "@fig2tw/shared";
import { existsSync, readFileSync } from "node:fs";

vi.mock(import("node:fs"), async importOriginal => {
  const original = await importOriginal();
  return {
    ...original,
    existsSync: vi.fn(),
    readFileSync: vi.fn(),
  };
});

describe("importVariables", () => {
  it("should return variables when passed as params", () => {
    const variables = fixtures.variables;
    const importPath = "./fig2tw.json";
    const result = importVariables({
      variables,
      importPath,
    } as unknown as ImportOptions<typeof variables>);
    expect(result).toStrictEqual(variables);
  });

  it("should throw neither variables or import path are provided", () => {
    expect(() =>
      importVariables(
        {} as unknown as ImportOptions<typeof fixtures.variables>,
      ),
    ).toThrow("either `variables` or `importPath` must be defined");
  });

  it("should throw when file does not exists", () => {
    vi.mocked(existsSync).mockReturnValue(false);
    const importPath = "./fig2tw.json";
    expect(() => importVariables({ importPath })).toThrow(
      "importPath file not found",
    );
  });

  it("should result the variables from the file when file exists", () => {
    vi.mocked(existsSync).mockReturnValue(true);
    vi.mocked(readFileSync).mockReturnValue(JSON.stringify(fixtures.variables));

    const importPath = "./fig2tw.json";
    const result = importVariables({ importPath });
    expect(result).toStrictEqual(fixtures.variables);
  });
});
