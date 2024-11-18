import { fail } from "@common/assert";
import { Config } from "@common/config";
import {
  AliasValue,
  AnyVariable,
  Collection,
  ColorScope,
  ColorValue,
  ColorVariable,
  isAliasValue,
  isColorValue,
  isColorVariable,
  isNumberValue,
  isNumberVariable,
  isStringValue,
  isStringVariable,
  NumberScope,
  NumberValue,
  NumberVariable,
  StringScope,
  StringValue,
  StringVariable,
  Value,
  Variable,
} from "@common/variables";

export interface Formatter<V extends Value, S extends string> {
  (value: V | AliasValue, variable: Variable<V, S>, opts: Options): string;
}

export interface Formatters {
  formatNumber: Formatter<NumberValue, NumberScope>;
  formatString: Formatter<StringValue, StringScope>;
  formatColor: Formatter<ColorValue, ColorScope>;
}

export interface Options {
  config: Config;
  formatters: Formatters;
}

export const formatCssNumber = ((
  value: NumberValue | AliasValue,
  variable: NumberVariable,
  opts: Options,
) => {
  if (isAliasValue(value)) {
    return formatCssVariableRef(value, variable, opts);
  }

  if (isNumberValue(value)) {
    const { baseFontSize } = opts.config;
    const number = value.value;
    const unit = getUnit(variable, opts.config);

    if (unit === "px") {
      return `${number}px`;
    }

    if (unit === "em") {
      return `${number / baseFontSize}em`;
    }

    if (unit === "rem") {
      return `${number / baseFontSize}rem`;
    }

    if (unit === "none") {
      return String(number);
    }
  }

  fail(`Unsupported value type in formatCssNumber: ${value}`);
}) satisfies Formatter<NumberValue, NumberScope>;

export const formatCssString = ((
  value: StringValue | AliasValue,
  variable: StringVariable,
  opts: Options,
) => {
  if (isAliasValue(value)) {
    return formatCssVariableRef(value, variable, opts);
  }

  if (isStringValue(value)) {
    const string = value.value;

    if (string.includes(" ")) {
      return `"${string}"`;
    }

    return string;
  }

  fail(`Unsupported value type in formatCssString: ${value}`);
}) satisfies Formatter<StringValue, StringScope>;

export const formatCssColorHex = ((
  value: ColorValue | AliasValue,
  variable: ColorVariable,
  opts: Options,
) => {
  if (isAliasValue(value)) {
    return formatCssVariableRef(value, variable, opts);
  }

  if (isColorValue(value)) {
    return value.value.hex;
  }

  fail(`Unsupported value type in formatCssColorHex: ${value}`);
}) satisfies Formatter<ColorValue, ColorScope>;

export const formatCssColorTwRgb = ((
  value: ColorValue | AliasValue,
  variable: ColorVariable,
  opts: Options,
) => {
  if (isAliasValue(value)) {
    return formatCssVariableRef(value, variable, opts);
  }

  if (isColorValue(value)) {
    // rgba() syntax is handled by tailwind. This allows tailwind to override
    // the alpha value of the css color like bg-black/50.
    const [r, g, b] = value.value.rgba;
    return `${r} ${g} ${b}`;
  }

  fail(`Unsupported value type in formatCssColorHex: ${value}`);
}) satisfies Formatter<ColorValue, ColorScope>;

export function formatCssModeSelector(
  collection: Collection,
  mode: string,
  { rootSelector }: Config,
) {
  const kebabCollection = formatKebabCase(collection.name);
  const kebabMode = formatKebabCase(mode);
  const classSelector = `.${kebabCollection}-${kebabMode}`;

  if (isDefaultMode(collection, mode) && !isBlank(rootSelector)) {
    return `${rootSelector}, ${classSelector}`;
  }

  return classSelector;
}

export function formatCssVariableName(variable: AnyVariable | AliasValue) {
  const key = "key" in variable ? variable.key : variable.value.key;
  return `--${formatKebabCase(key)}`;
}

export function formatCssVariableRef(
  alias: AliasValue,
  variable: AnyVariable,
  opts: Options,
) {
  const cssVariable = formatCssVariableName(alias);

  if (!opts.config.hasDefaultValues) {
    return `var(${cssVariable})`;
  }

  const formattedDefaultValue = formatCssVariableRefDefaultValue(
    variable,
    opts,
  );
  return `var(${cssVariable}, ${formattedDefaultValue})`;
}

function formatCssVariableRefDefaultValue(
  variable: AnyVariable,
  opts: Options,
) {
  const { formatters } = opts;

  if (isColorVariable(variable)) {
    return formatters.formatColor(variable.defaultValue, variable, opts);
  }

  if (isNumberVariable(variable)) {
    return formatters.formatNumber(variable.defaultValue, variable, opts);
  }

  if (isStringVariable(variable)) {
    return formatters.formatString(variable.defaultValue, variable, opts);
  }

  const { type } = variable;
  fail(`Unsupported value type in formatCssVariableReference: ${type}`);
}

export function formatKebabCase(value: string) {
  return [
    trimStart,
    trimEnd,
    replaceSpacesByHyphens,
    replaceSlashesWithHyphens,
    breakCamelCaseWordsWithHyphens,
    replaceNonAlphanumericCharactersWithBase36,
    replaceRepeatedHyphens,
    toLowerCase,
  ].reduce((value, fn) => fn(value), value);
}

export function trimStart(value: string) {
  return value.replace(/^[\s-\/]+/, "");
}

export function trimEnd(value: string) {
  return value.replace(/[\s-\/]+$/, "");
}

function replaceSpacesByHyphens(value: string) {
  return value.replaceAll(/\s/g, "-");
}

function replaceSlashesWithHyphens(value: string) {
  return value.replaceAll(/\//g, "-");
}

export function replaceRepeatedHyphens(value: string) {
  return value.replaceAll(/-+/g, "-");
}

function replaceNonAlphanumericCharactersWithBase36(value: string) {
  return value.replace(
    /[^a-zA-Z0-9-]/g,
    it => `-${it.charCodeAt(0).toString(36)}-`,
  );
}

function breakCamelCaseWordsWithHyphens(value: string) {
  return value.replace(
    /[A-Z]+(?![a-z])|[A-Z]/g,
    (it, ofs) => (ofs ? "-" : "") + it,
  );
}

function toLowerCase(value: string) {
  return value.toLowerCase();
}

function isDefaultMode(collection: Collection, mode: string) {
  return collection.defaultMode === mode;
}

export function isBlank(value: string | undefined): value is undefined | "" {
  return value == null || value.trim().length === 0;
}

function getUnit(variable: NumberVariable, config: Config) {
  const units = variable.scopes.map(it => config.units[it]);
  return units[0] || "px";
}
