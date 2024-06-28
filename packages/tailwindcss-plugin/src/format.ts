import { PartialRootOptions, RootOptions, rootOf } from "./root.js";

interface Options {
  context: string;
  path: string[];
}

export interface FormatOptions extends Options, RootOptions {}
export interface PartialFormatOptions extends Options, PartialRootOptions {}

export function formatOptionsOf({
  root,
  ...overrides
}: PartialFormatOptions): FormatOptions {
  return {
    root: rootOf(root),
    ...overrides,
  };
}
