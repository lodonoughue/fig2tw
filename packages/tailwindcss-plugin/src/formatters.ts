import {
  BooleanValue,
  ColorValue,
  NumberValue,
  StringValue,
  assert,
} from "@fig2tw/shared";
import { FormatOptions } from "./format.js";
import { RootOptions } from "./root.js";

export function toCssSelectorFactory() {
  const primaryModes = new Map<string, string>();
  return function toCssSelector(
    collection: string,
    classname: string,
    { root }: FormatOptions,
  ) {
    if (!primaryModes.has(collection)) {
      primaryModes.set(collection, classname);
    }
    if (primaryModes.get(collection) === classname) {
      return `${root.selector}, ${root.selector}.${classname}`;
    }
    return `${root.selector}.${classname}`;
  };
}

export function toCssVariableProperty({ path, ...opts }: FormatOptions) {
  assert(
    opts.context != null,
    "context is required to format css variables property",
  );

  return `--${toTwProperty({
    ...opts,
    path: [opts.context, ...path],
  })}`;
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
  { root }: RootOptions,
) {
  const val = typeof value === "number" ? value : value.value;
  return `${val / root.fontSizePx}rem`;
}

export function toCssNumberPxValue(
  value: NumberValue | number,
  _: RootOptions,
) {
  const val = typeof value === "number" ? value : value.value;
  return `${val}px`;
}

export function toCssBooleanValue({ value }: BooleanValue, _: FormatOptions) {
  return String(value);
}

export function toCssClass(collection: string, mode: string) {
  return `${toKebabCase(collection)}__${toKebabCase(mode)}`;
}

export function toTwProperty({ path }: FormatOptions) {
  assert(path != null, "path is required to format tailwindcss properties");
  return path.map(toKebabCase).join("-");
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

export function toKebabCase(value: string) {
  return value.toLowerCase().replace(" ", "-");
}

interface Options {
  toCssSelector: ReturnType<typeof toCssSelectorFactory>;
  toCssVariableProperty: typeof toCssVariableProperty;
  toCssClass: typeof toCssClass;
  toCssColorValue: typeof toCssColorValue;
  toCssStringValue: typeof toCssStringValue;
  toCssNumberValue: typeof toCssNumberRemValue;
  toCssBooleanValue: typeof toCssBooleanValue;
  toTwProperty: typeof toTwProperty;
  toTwColorValue: typeof toTwColorValue;
  toTwStringValue: typeof toTwStringValue;
  toTwNumberValue: typeof toTwNumberValue;
  toTwBooleanValue: typeof toTwBooleanValue;
}

export interface FormattersOptions {
  formatters: Options;
}

export interface PartialFormattersOptions {
  formatters?: Partial<Options>;
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
    toTwProperty,
    toTwColorValue,
    toTwStringValue,
    toTwNumberValue,
    toTwBooleanValue,
    ...overrides,
  };
}
