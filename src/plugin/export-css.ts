import { fail } from "@common/assert";
import { Config } from "@common/config";
import { chain } from "lodash";
import {
  formatCssColorHex,
  formatCssModeSelector,
  formatCssNumber,
  formatCssString,
  formatCssVariableName,
  Formatters,
  Options,
} from "@common/formatters";
import { isSupportedByCss, loadVariables } from "./variables";
import {
  AnyVariable,
  isColorVariable,
  isNumberVariable,
  isStringVariable,
} from "@common/variables";

export async function exportCss(config: Config) {
  const variables = await loadVariables();

  const formatters = {
    formatNumber: formatCssNumber,
    formatString: formatCssString,
    formatColor: formatCssColorHex,
  } satisfies Formatters;

  const cssBundle = convertToCssBundle(variables, { config, formatters });
  return chain(cssBundle)
    .entries()
    .flatMap(([selector, declarationSet]) =>
      formatCssSelector(
        selector,
        chain(declarationSet)
          .entries()
          .map(([property, value]) => formatCssDeclaration(property, value))
          .value(),
      ),
    )
    .value()
    .join("\n")
    .replaceAll("\t", " ".repeat(config.tabWidth));
}

export function convertToCssBundle(
  variables: AnyVariable[],
  opts: Options,
): CssBundle {
  return chain(variables)
    .filter(isSupportedByCss)
    .flatMap(it => toVariableByMode(it))
    .groupBy(it => formatCssModeSelector(it.collection, it.mode, opts.config))
    .mapValues(it =>
      chain(it)
        .keyBy(it => formatCssVariableName(it.variable))
        .mapValues(it => formatCssValue(it.variable, it.mode, opts))
        .value(),
    )
    .value();
}

function toVariableByMode(variable: AnyVariable) {
  return variable.collection.modes.map(mode => ({
    collection: variable.collection,
    mode,
    variable,
  }));
}

function formatCssValue(variable: AnyVariable, mode: string, opts: Options) {
  const { formatters } = opts;

  if (isColorVariable(variable)) {
    const value = variable.valuesByMode[mode];
    return formatters.formatColor(value, variable, opts);
  }

  if (isStringVariable(variable)) {
    const value = variable.valuesByMode[mode];
    return formatters.formatString(value, variable, opts);
  }

  if (isNumberVariable(variable)) {
    const value = variable.valuesByMode[mode];
    return formatters.formatNumber(value, variable, opts);

    // This is unreachable because of the `isSupportedByJson` check. It is kept
    // here in case the supported types change.
    /* v8 ignore next 4 */
  }

  fail(`Unsupported variable type: ${variable.type}`);
}

function formatCssSelector(selector: string, children: string[]) {
  return [`${selector} {`, ...children, "}"];
}

function formatCssDeclaration(property: string, value: string) {
  return `\t${property}: ${value};`;
}

interface CssBundle {
  [selector: string]: CssDeclarationSet;
}

interface CssDeclarationSet {
  [property: string]: string;
}
