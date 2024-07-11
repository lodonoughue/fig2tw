import { VariableObject, assert } from "@fig2tw/shared";
import { fail } from "node:assert";
import fs from "node:fs";

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
  assert(fs.existsSync(importPath), "importPath file not found");
  return JSON.parse(fs.readFileSync(importPath, "utf-8"));
}
