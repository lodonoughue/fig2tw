import {
  AnyValue,
  ValueStruct,
  isBooleanValue,
  isColorValue,
  isNumberValue,
  isStringValue,
} from "@fig2tw/shared";
import { FormattersOptions } from "./formatters.js";
import { RootOptions } from "./root.js";
import { forEachValueArray } from "./value.js";
import { FormatOptions, formatOptionsOf } from "./format.js";
import { fail } from "assert";

export function buildTwConfig(
  context: string,
  values: AnyValue[] | ValueStruct,
  opts: RootOptions & FormattersOptions,
): Record<string, string> {
  const { root, formatters } = opts;
  const { toTwProperty, toCssVariableProperty } = formatters;

  const result = {} as Record<string, string>;
  forEachValueArray(values, (path, value) => {
    const firstValue = value[0];
    const formatOptions = formatOptionsOf({ path, context, root });
    const twProperty = toTwProperty(formatOptions);
    const cssVariable = toCssVariableProperty(formatOptions);
    result[twProperty] = formatTwValue(
      firstValue,
      cssVariable,
      formatOptions,
      formatters,
    );
  });
  return result;
}

function formatTwValue(
  value: AnyValue,
  cssVariable: string,
  formatOptions: FormatOptions,
  formatters: FormattersOptions["formatters"],
): string {
  if (isColorValue(value)) {
    return formatters.toTwColorValue(cssVariable, formatOptions);
  }
  if (isBooleanValue(value)) {
    return formatters.toTwBooleanValue(cssVariable, formatOptions);
  }
  if (isNumberValue(value)) {
    return formatters.toTwNumberValue(cssVariable, formatOptions);
  }
  if (isStringValue(value)) {
    return formatters.toTwStringValue(cssVariable, formatOptions);
  }
  fail(`cannot format tailwwindcss value of type ${(value as AnyValue).type}`);
}
