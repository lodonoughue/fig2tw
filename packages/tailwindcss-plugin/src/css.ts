import {
  VariableObject,
  AnyVariable,
  isColorVariable,
  isBooleanVariable,
  isNumberVariable,
  isStringVariable,
  fail,
  isRefVariable,
  RefVariable,
  assert,
  isVariableArray,
  Variable,
  forEachVariableArray,
  isValueVariable,
  getCollection,
} from "@fig2tw/shared";
import { Context, FormatOptions, FormattersOptions } from "./formatters.js";
import { ConfigOptions } from "./config.js";

export function buildCssBundle(
  context: Context,
  allvariables: VariableObject,
  selectedVariables: Variable<string>[] | VariableObject,
  opts: ConfigOptions & FormattersOptions,
): CssBundle {
  const bundle = {} as CssBundle;
  forEachVariableArray(selectedVariables, (selectorPath, values) => {
    appendToBundleRecursive(
      context,
      bundle,
      allvariables,
      selectorPath,
      values,
      opts,
    );
  });
  return bundle;
}

function appendToBundleRecursive(
  context: Context,
  bundle: CssBundle,
  allVariables: VariableObject,
  selectorPath: string[],
  selectedVariables: Variable<string>[],
  opts: ConfigOptions & FormattersOptions,
) {
  const { toCssClass, toCssSelector, toCssVariableProperty } = opts.formatters;

  selectedVariables.forEach(variable => {
    const { mode, path: variablePath } = variable;
    const collection = getCollection(variable);
    const formatOptions = {
      context,
      selectorPath,
      variablePath,
      ...opts,
    } satisfies FormatOptions;

    const classname = toCssClass(collection, mode);
    const selector = toCssSelector(collection, classname, formatOptions);
    const property = toCssVariableProperty(formatOptions);
    const cssValue = formatCssValue(variable, formatOptions);
    appendToBundle(bundle, selector, property, cssValue);

    if (isRefVariable(variable)) {
      const refValues = findRefVariableArray(allVariables, variable);
      appendToBundleRecursive(
        context,
        bundle,
        allVariables,
        selectorPath,
        refValues,
        opts,
      );
    }
  });
}

function formatCssValue(variable: Variable<string>, options: FormatOptions) {
  if (isRefVariable(variable)) {
    return options.formatters.toCssRefValue(variable.ref, options);
  }
  if (isValueVariable(variable)) {
    if (isColorVariable(variable)) {
      return options.formatters.toCssColorValue(variable.value, options);
    }
    if (isBooleanVariable(variable)) {
      return options.formatters.toCssBooleanValue(variable.value, options);
    }
    if (isNumberVariable(variable)) {
      return options.formatters.toCssNumberValue(variable.value, options);
    }
    if (isStringVariable(variable)) {
      return options.formatters.toCssStringValue(variable.value, options);
    }
  }
  fail(`cannot format css value of type ${variable.type}`);
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

function findRefVariableArray(
  allVariables: VariableObject,
  { ref }: RefVariable<string>,
): AnyVariable[] {
  const result = ref.reduce(
    (accumulator, current) => {
      assert(
        !isVariableArray(accumulator),
        `ref ${current} in ${ref} resolved to a variable instead of an object`,
      );
      assert(
        current in accumulator && accumulator[current] != null,
        `ref ${current} in ${ref} does not exist`,
      );
      return accumulator[current] as VariableObject | AnyVariable[];
    },
    allVariables as VariableObject | AnyVariable[],
  );
  assert(isVariableArray(result), `cannot find referenced value at ${ref}`);
  return result;
}

export interface CssBundle {
  [selector: string]: { [property: string]: string };
}
