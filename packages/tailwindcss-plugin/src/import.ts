import { VariableObject, assert, fail } from "@fig2tw/shared";
import { existsSync, readFileSync } from "node:fs";

export type ImportOptions<T extends VariableObject> =
  | { variables: T; importPath?: undefined }
  | { variables?: undefined; importPath: string };

export function importVariables<T extends VariableObject>({
  variables,
  importPath,
}: ImportOptions<T>): T {
  if (variables) return variables;
  if (importPath) return readVariables(importPath);
  fail("either `variables` or `importPath` must be defined");
}

function readVariables<T extends VariableObject>(importPath: string): T {
  assert(existsSync(importPath), "importPath file not found");
  return JSON.parse(readFileSync(importPath, "utf-8"));
}
