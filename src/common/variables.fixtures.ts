/* v8 ignore start */
// Coverage is not calculated in fixtures, because it's only meant to help
// with the tests. It should  never be used in production code.

import {
  AliasValue,
  BooleanValue,
  BooleanVariable,
  Collection,
  ColorValue,
  ColorVariable,
  isAliasValue,
  NumberValue,
  NumberVariable,
  StringValue,
  StringVariable,
  toColorHexPart,
  Value,
  Variable,
} from "./variables";

function createAliasValue({
  type = "alias",
  value = { key: "Collection/Foo" },
}: Partial<AliasValue> = {}): AliasValue {
  return { type, value };
}

function createNumberValue({
  type = "number",
  value = 42,
}: Partial<NumberValue> = {}): NumberValue {
  return { type, value };
}

function createStringValue({
  type = "string",
  value = "foo",
}: Partial<StringValue> = {}): StringValue {
  return { type, value };
}

function createBooleanValue({
  type = "boolean",
  value = true,
}: Partial<BooleanValue> = {}): BooleanValue {
  return { type, value };
}

function createColorValue({
  type = "color",
  value,
}: Partial<Value<"color", Partial<ColorValue["value"]>>> = {}): ColorValue {
  return { type, value: inferColorValue(value) };
}

function inferColorValue({
  hex,
  rgba,
}: Partial<ColorValue["value"]> = {}): ColorValue["value"] {
  hex ??= inferColorValueHex(rgba);
  rgba ??= inferColorValueRgba(hex);
  return { hex, rgba };
}

function inferColorValueHex(
  [r, g, b, a]: ColorValue["value"]["rgba"] = [255, 0, 0, 0],
): ColorValue["value"]["hex"] {
  const red = toColorHexPart(r / 255);
  const green = toColorHexPart(g / 255);
  const blue = toColorHexPart(b / 255);
  const alpha = a !== 1 ? toColorHexPart(a) : "";
  return `#${red}${green}${blue}${alpha}`;
}

function inferColorValueRgba(
  hex: ColorValue["value"]["hex"],
): ColorValue["value"]["rgba"] {
  const red = parseInt(hex.slice(1, 3), 16);
  const green = parseInt(hex.slice(3, 5), 16);
  const blue = parseInt(hex.slice(5, 7), 16);
  const alphaHex = hex.slice(7, 9);
  const alpha = alphaHex ? parseInt(hex.slice(5, 7), 16) / 255 : 1;
  return [red, green, blue, alpha];
}

function createNumberVariable(partial: Partial<NumberVariable> = {}) {
  return createVariable<NumberVariable>(createNumberValue, {
    name: inferVariableName(partial.key) ?? "Number/Foo",
    type: "number",
    scopes: ["all-numbers"],
    ...partial,
  });
}

function createStringVariable(partial: Partial<StringVariable> = {}) {
  return createVariable<StringVariable>(createStringValue, {
    name: inferVariableName(partial.key) ?? "String/Foo",
    type: "string",
    scopes: ["all-strings"],
    ...partial,
  });
}

function createColorVariable(partial: Partial<ColorVariable> = {}) {
  return createVariable<ColorVariable>(createColorValue, {
    name: inferVariableName(partial.key) ?? "Color/Foo",
    type: "color",
    scopes: ["all-colors"],
    ...partial,
  });
}

function createBooleanVariable(partial: Partial<BooleanVariable> = {}) {
  return createVariable<BooleanVariable>(createBooleanValue, {
    name: inferVariableName(partial.key) ?? "Boolean/Foo",
    type: "boolean",
    scopes: ["all-booleans"],
    ...partial,
  });
}

function createVariable<V extends Variable>(
  valueFactory: () => V["defaultValue"],
  {
    type = "never",
    name,
    key,
    valuesByMode,
    defaultValue,
    collection,
    scopes = [],
  }: Partial<V>,
): V {
  name ??= inferVariableName(key) ?? "Variable/Foo";
  key ??= inferVariableKey(name, collection);
  valuesByMode ??= inferVariableValuesByMode<V>(
    valueFactory,
    collection,
    defaultValue,
  );
  collection ??= inferCollection(key, valuesByMode);
  defaultValue ??= inferVariableDefaultValue<V>(
    valueFactory,
    valuesByMode,
    collection,
  );
  return {
    type,
    key,
    name,
    valuesByMode,
    defaultValue,
    collection,
    scopes,
  } as V;
}

function createCollection({
  name = "Collection",
  modes,
  defaultMode,
}: Partial<Collection> = {}): Collection {
  modes ??= [defaultMode ?? "light", "dark"];
  defaultMode ??= modes[0];
  return { name, modes, defaultMode };
}

function inferVariableKey(name: string, collection?: Collection): string {
  const collectionName = collection ? collection.name : "Collection";
  return `${collectionName}/${name}`;
}

function inferVariableName(key?: string): string | undefined {
  return key ? key.split("/").slice(1).join("/") : undefined;
}

function inferVariableValuesByMode<V extends Variable>(
  valueFactory: () => V["defaultValue"],
  collection?: Collection,
  defaultValue?: V["defaultValue"],
): V["valuesByMode"] {
  const defaultMode = collection ? collection.defaultMode : "Mode";
  const value = defaultValue ?? valueFactory();
  return { [defaultMode]: value };
}

function inferCollection(
  key: string,
  valuesByMode: Variable["valuesByMode"],
): Collection {
  const name = key.split("/")[0];
  const modes = Object.keys(valuesByMode);
  const defaultMode = modes[0];
  return { name, modes, defaultMode };
}

function inferVariableDefaultValue<V extends Variable>(
  valueFactory: () => V["defaultValue"],
  valuesByMode: V["valuesByMode"],
  collection: Collection,
): V["defaultValue"] {
  const result = valuesByMode[collection.defaultMode];
  if (result == null || isAliasValue(result)) {
    return valueFactory();
  }
  return result;
}

export const variableFixtures = {
  createAliasValue,
  createNumberValue,
  createStringValue,
  createColorValue,
  createBooleanValue,
  createNumberVariable,
  createStringVariable,
  createColorVariable,
  createBooleanVariable,
  createVariable,
  createCollection,
};
