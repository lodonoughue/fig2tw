import {
  ValueStruct,
  AnyValue,
  isColorValue,
  isBooleanValue,
  isNumberValue,
  isStringValue,
  fail,
} from "@fig2tw/shared";
import { FormattersOptions } from "./formatters.js";
import { RootOptions } from "./root.js";
import { FormatOptions, formatOptionsOf } from "./format.js";
import { forEachValueArray } from "./value.js";

export function buildCssBundle(
  context: string,
  values: AnyValue[] | ValueStruct,
  opts: RootOptions & FormattersOptions,
): CssBundle {
  const { root, formatters } = opts;
  const { toCssClass, toCssSelector, toCssVariableProperty } = formatters;

  const bundle = {} as CssBundle;
  forEachValueArray(values, (path, values) => {
    values.forEach(value => {
      const { collection, mode } = value;
      const formatOptions = formatOptionsOf({ path, context, root });

      const classname = toCssClass(collection, mode);
      const selector = toCssSelector(collection, classname, formatOptions);
      const property = toCssVariableProperty(formatOptions);
      const cssValue = formatCssValue(value, formatOptions, formatters);
      appendToBundle(bundle, selector, property, cssValue);
    });
  });
  return bundle;
}

function formatCssValue(
  value: AnyValue,
  formatOptions: FormatOptions,
  formatters: FormattersOptions["formatters"],
) {
  if (isColorValue(value)) {
    return formatters.toCssColorValue(value, formatOptions);
  }
  if (isBooleanValue(value)) {
    return formatters.toCssBooleanValue(value, formatOptions);
  }
  if (isNumberValue(value)) {
    return formatters.toCssNumberValue(value, formatOptions);
  }
  if (isStringValue(value)) {
    return formatters.toCssStringValue(value, formatOptions);
  }
  fail(`cannot format css value of type ${(value as AnyValue).type}`);
}

function appendToBundle(
  bundle: CssBundle,
  selector: string,
  property: string,
  value: string,
) {
  let properties = bundle[selector];
  if (properties == null) {
    properties = {};
    bundle[selector] = properties;
  }
  properties[property] = value;
}

export interface CssBundle {
  [selector: string]: { [property: string]: string };
}
