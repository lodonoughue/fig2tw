import {
  BooleanValue,
  ColorValue,
  NumberValue,
  RefVariable,
  StringValue,
} from "@fig2tw/shared";
import { ConfigOptions, configOf } from "./config.js";
import { DeepPartial } from "./types.js";
import { ThemeConfig } from "tailwindcss/types/config.js";

export function toCssSelectorFactory() {
  const primaryModes = new Map<string, string>();
  return function toCssSelector(
    collection: string,
    classname: string,
    { config }: FormatOptions,
  ) {
    if (!primaryModes.has(collection)) {
      primaryModes.set(collection, classname);
    }
    const selector = config.rootSelector;
    if (primaryModes.get(collection) === classname) {
      return `${selector}, ${selector}.${classname}`;
    }
    return `${selector}.${classname}`;
  };
}

export function toCssVariableProperty({ variablePath }: FormatOptions) {
  return `--${toKebabProperty(variablePath)}`;
}

export function toCssColorValue(
  { r, g, b }: ColorValue["value"],
  _: FormatOptions,
) {
  return `${r} ${g} ${b}`;
}

export function toCssStringValue(
  value: StringValue["value"],
  _: FormatOptions,
) {
  return value;
}

export function toCssNumberValue(
  value: NumberValue["value"],
  { context, config }: FormatOptions,
) {
  if (context === "screens") {
    return `${value}px`;
  }
  if (context === "fontWeight") {
    return String(value);
  }
  if (context === "letterSpacing") {
    return `${value / config.rootFontSizePx}em`;
  }
  return `${value / config.rootFontSizePx}rem`;
}

export function toCssBooleanValue(
  value: BooleanValue["value"],
  _: FormatOptions,
) {
  return String(value);
}

export function toCssRefValue(
  ref: RefVariable<string>["ref"],
  options: FormatOptions,
) {
  const { toCssVariableProperty } = options.formatters;
  return `var(${toCssVariableProperty({ ...options, variablePath: ref })})`;
}

export function toCssClass(collection: string, mode: string) {
  return `${toKebabCase(collection)}__${toKebabCase(mode)}`;
}

export function toTwProperty({ selectorPath }: FormatOptions) {
  return toKebabProperty(selectorPath);
}

export function toTwColorValue(cssVariable: string, _: FormatOptions) {
  return `rgb(var(${cssVariable}) / <alpha-value>)`;
}

export function toTwStringValue(cssVariable: string, _: FormatOptions) {
  return `var(${cssVariable})`;
}

export function toTwNumberValue(cssVariable: string, _: FormatOptions) {
  return `var(${cssVariable})`;
}

export function toTwBooleanValue(cssVariable: string, _: FormatOptions) {
  return `var(${cssVariable})`;
}

export function toTwRefValue(cssVariable: string, _: FormatOptions) {
  return `var(${cssVariable})`;
}

function toKebabProperty(path: string[]): string {
  return path.map(toKebabCase).map(escapeSpecialCharacters).join("-");
}

function toKebabCase(value: string) {
  return value.toLowerCase().replace(" ", "-");
}

function escapeSpecialCharacters(value: string): string {
  return value.replaceAll(/[^a-z0-9-_]/gi, "_");
}

interface Options {
  toCssSelector: ReturnType<typeof toCssSelectorFactory>;
  toCssVariableProperty: typeof toCssVariableProperty;
  toCssClass: typeof toCssClass;
  toCssColorValue: typeof toCssColorValue;
  toCssStringValue: typeof toCssStringValue;
  toCssNumberValue: typeof toCssNumberValue;
  toCssBooleanValue: typeof toCssBooleanValue;
  toCssRefValue: typeof toCssRefValue;
  toTwProperty: typeof toTwProperty;
  toTwColorValue: typeof toTwColorValue;
  toTwStringValue: typeof toTwStringValue;
  toTwNumberValue: typeof toTwNumberValue;
  toTwBooleanValue: typeof toTwBooleanValue;
  toTwRefValue: typeof toTwRefValue;
}

export interface FormattersOptions {
  formatters: Options;
}

export function formattersOf(overrides: Partial<Options> = {}): Options {
  return {
    toCssSelector: toCssSelectorFactory(),
    toCssVariableProperty,
    toCssClass,
    toCssColorValue,
    toCssStringValue,
    toCssNumberValue,
    toCssBooleanValue,
    toCssRefValue,
    toTwProperty,
    toTwColorValue,
    toTwStringValue,
    toTwNumberValue,
    toTwBooleanValue,
    toTwRefValue,
    ...overrides,
  };
}

export interface FormatOptions extends ConfigOptions, FormattersOptions {
  context: Context;
  selectorPath: string[];
  variablePath: string[];
}

export function formatOptionsOf({
  context = "unknown",
  config,
  formatters,
  ...rest
}: DeepPartial<FormatOptions> = {}): FormatOptions {
  return {
    config: configOf(config),
    formatters: formattersOf(formatters),
    context,
    selectorPath: [],
    variablePath: [],
    ...rest,
  };
}

export type Context =
  | Exclude<
      keyof ThemeConfig,
      "width" | "minWidth" | "maxWidth" | "height" | "maxHeight" | "minHeight"
    >
  | "size"
  | "unknown";
