import { ValueStruct, assert } from "@fig2tw/shared";
import { fail } from "node:assert";
import fs from "node:fs";

export type ImportOptions<T extends ValueStruct> =
  | { variables: T; importPath?: undefined }
  | { variables?: undefined; importPath: string };

export function importVariables<T extends ValueStruct>({
  variables,
  importPath,
}: ImportOptions<T>): T {
  if (variables) return variables;
  if (importPath) return readVariables(importPath);
  fail("either `variables` or `importPath` must be defined");
}

function readVariables<T extends ValueStruct>(importPath: string): T {
  assert(fs.existsSync(importPath), "importPath file not found");
  return JSON.parse(fs.readFileSync(importPath, "utf-8"));
}
