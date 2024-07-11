import {
  BooleanValue,
  ColorValue,
  NumberValue,
  RefVariable,
  StringValue,
} from "@fig2tw/shared";
import { ConfigOptions, configOf } from "./config.js";
import { DeepPartial } from "./types.js";

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

export function toCssColorValue({ value }: ColorValue, _: FormatOptions) {
  const { r, g, b } = value;
  return `${r} ${g} ${b}`;
}

export function toCssStringValue({ value }: StringValue, _: FormatOptions) {
  return value;
}

export function toCssNumberRemValue(
  value: NumberValue | number,
  { config }: ConfigOptions,
) {
  const val = typeof value === "number" ? value : value.value;
  return `${val / config.rootFontSizePx}rem`;
}

export function toCssNumberPxValue(
  value: NumberValue | number,
  _: ConfigOptions,
) {
  const val = typeof value === "number" ? value : value.value;
  return `${val}px`;
}

function toCssBooleanValue({ value }: BooleanValue, _: FormatOptions) {
  return String(value);
}

function toCssRefValue({ ref }: RefVariable<string>, options: FormatOptions) {
  const { toCssVariableProperty } = options.formatters;
  return `var(${toCssVariableProperty({ ...options, variablePath: ref })})`;
}

export function toCssClass(collection: string, mode: string) {
  return `${toKebabCase(collection)}__${toKebabCase(mode)}`;
}

function toTwProperty({ selectorPath }: FormatOptions) {
  return toKebabProperty(selectorPath);
}

function toTwColorValue(cssVariable: string, _: FormatOptions) {
  return `rgb(var(${cssVariable}) / <alpha-value>)`;
}

function toTwStringValue(cssVariable: string, _: FormatOptions) {
  return `var(${cssVariable})`;
}

function toTwNumberValue(cssVariable: string, _: FormatOptions) {
  return `var(${cssVariable})`;
}

function toTwBooleanValue(cssVariable: string, _: FormatOptions) {
  return `var(${cssVariable})`;
}

function toTwRefValue(cssVariable: string, _: FormatOptions) {
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
  toCssNumberValue: typeof toCssNumberRemValue;
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
    toCssNumberValue: toCssNumberRemValue,
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
  selectorPath: string[];
  variablePath: string[];
}

export function formatOptionsOf({
  config,
  formatters,
  ...rest
}: DeepPartial<FormatOptions> = {}): FormatOptions {
  return {
    config: configOf(config),
    formatters: formattersOf(formatters),
    selectorPath: [],
    variablePath: [],
    ...rest,
  };
}
