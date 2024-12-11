import { describe, expect, it, vi } from "vitest";
import { loadVariables } from "./variables";
import { exportScopes } from "./export-scopes";
import { variableFixtures } from "@common/variables.fixtures";

const fixtures = { ...variableFixtures };

vi.mock("@plugin/variables", async importOriginal => {
  const original = await importOriginal<typeof import("@plugin/variables")>();
  vi.spyOn(original, "loadVariables");
  return original;
});

describe("exportScopes", () => {
  it.each([
    { variable: fixtures.createColorVariable({ scopes: ["fill-color"] }) },
    { variable: fixtures.createStringVariable({ scopes: ["font-family"] }) },
    { variable: fixtures.createNumberVariable({ scopes: ["all-numbers"] }) },
    { variable: fixtures.createBooleanVariable({ scopes: ["all-booleans"] }) },
  ])("should return $variable.type scopes", async ({ variable }) => {
    vi.mocked(loadVariables).mockResolvedValue([variable]);

    const scopes = await exportScopes();
    return expect(scopes).toEqual(variable.scopes);
  });

  it("should return a unique list of scopes from all variables", async () => {
    vi.mocked(loadVariables).mockResolvedValue([
      fixtures.createColorVariable({
        scopes: ["fill-color", "stroke-color", "effect-color"],
      }),
      fixtures.createColorVariable({
        scopes: ["all-colors", "effect-color"],
      }),
    ]);

    const scopes = await exportScopes();
    expect(scopes.toSorted()).toEqual(
      ["all-colors", "fill-color", "stroke-color", "effect-color"].toSorted(),
    );
  });
});
