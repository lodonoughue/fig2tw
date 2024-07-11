import {
  Variable,
  VariableObject,
  forEachVariableArray,
  isBooleanVariable,
  isColorVariable,
  isNumberVariable,
  isStringVariable,
} from "@fig2tw/shared";
import { FormatOptions, FormattersOptions } from "./formatters.js";
import { ConfigOptions } from "./config.js";
import { fail } from "assert";

export function buildTwConfig(
  context: string,
  selectedVariables: Variable<string>[] | VariableObject,
  opts: ConfigOptions & FormattersOptions,
): Record<string, string> {
  const { formatters } = opts;
  const { toTwProperty, toCssVariableProperty } = formatters;

  const result = {} as Record<string, string>;
  forEachVariableArray(selectedVariables, (path, variable) => {
    const firstVariable = variable[0];
    const formatOptions = {
      ...opts,
      selectorPath: path,
      variablePath: firstVariable.path,
      context,
    } satisfies FormatOptions;

    const twProperty = toTwProperty(formatOptions);
    const cssVariable = toCssVariableProperty(formatOptions);
    result[twProperty] = formatTwValue(
      firstVariable,
      cssVariable,
      formatOptions,
      formatters,
    );
  });
  return result;
}

function formatTwValue(
  variable: Variable<string>,
  cssVariable: string,
  formatOptions: FormatOptions,
  formatters: FormattersOptions["formatters"],
): string {
  if (isColorVariable(variable)) {
    return formatters.toTwColorValue(cssVariable, formatOptions);
  }
  if (isBooleanVariable(variable)) {
    return formatters.toTwBooleanValue(cssVariable, formatOptions);
  }
  if (isNumberVariable(variable)) {
    return formatters.toTwNumberValue(cssVariable, formatOptions);
  }
  if (isStringVariable(variable)) {
    return formatters.toTwStringValue(cssVariable, formatOptions);
  }
  fail(`cannot format tailwwindcss value of type ${variable.type}`);
}
