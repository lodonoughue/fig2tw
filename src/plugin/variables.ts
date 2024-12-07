import { assert, fail } from "@common/assert";
import { withArgs } from "@common/utils";
import { chain, memoize } from "lodash";
import {
  FigmaCollection,
  FigmaMode,
  FigmaVariable,
  findCollectionById,
  findModeById,
  findVariableById,
  findDefaultValue,
  isFigmaBooleanValue,
  isFigmaColorValue,
  isFigmaNumberValue,
  isFigmaStringValue,
  isFigmaVariableAlias,
  getFigmaVariables,
  getDefaultMode,
} from "@plugin/figma";
import {
  AnyVariable,
  Collection,
  BooleanScope,
  ColorScope,
  NumberScope,
  StringScope,
  AnyValue,
  Variable,
  AliasValue,
  ColorValue,
  NumberValue,
  StringValue,
  BooleanValue,
  toColorHexPart,
  toColorRgbaPart,
} from "@common/variables";

const CSS_SUPPORTED_TYPES: string[] = [
  "string",
  "number",
  "color",
] satisfies AnyVariable["type"][];

const JSON_SUPPORTED_TYPES: string[] = [
  "BOOLEAN",
  "COLOR",
  "FLOAT",
  "STRING",
] satisfies FigmaVariable["resolvedType"][];

const COLOR_SCOPE_MAPPING: Partial<Record<VariableScope, ColorScope[]>> = {
  ALL_SCOPES: ["all-colors"],
  ALL_FILLS: ["fill-color", "text-color"],
  FRAME_FILL: ["fill-color"],
  SHAPE_FILL: ["fill-color"],
  TEXT_FILL: ["text-color"],
  STROKE_COLOR: ["stroke-color"],
  EFFECT_COLOR: ["effect-color"],
};

const NUMBER_SCOPE_MAPPING: Partial<Record<VariableScope, NumberScope[]>> = {
  ALL_SCOPES: ["all-numbers"],
  CORNER_RADIUS: ["radius"],
  WIDTH_HEIGHT: ["size"],
  GAP: ["gap"],
  STROKE_FLOAT: ["stroke-width"],
  FONT_SIZE: ["font-size"],
  LINE_HEIGHT: ["line-height"],
  LETTER_SPACING: ["letter-spacing"],
  FONT_WEIGHT: ["font-weight"],
};

const STRING_SCOPE_MAPPING: Partial<Record<VariableScope, StringScope[]>> = {
  ALL_SCOPES: ["all-strings"],
  FONT_FAMILY: ["font-family"],
};

const BOOLEAN_SCOPE_MAPPING: Partial<Record<VariableScope, BooleanScope[]>> = {
  ALL_SCOPES: ["all-booleans"],
};

export async function loadVariables(): Promise<AnyVariable[]> {
  const { variables, collections } = await getFigmaVariables();

  const resolvers = {
    // Memoize resolveCollection to keep referential equality
    resolveCollection: memoize((collectionId: string) =>
      toCollection(findCollectionById(collections, collectionId)),
    ),
    resolveMode: withArgs(findModeById, collections),
    resolveVariable: withArgs(findVariableById, variables),
    resolveDefaultValue: withArgs(findDefaultValue, collections, variables),
  } satisfies Resolvers;

  return variables
    .filter(isSupportedByJson)
    .map(it => toAnyVariable(it, resolvers));
}

function toCollection(figmaCollection: FigmaCollection): Collection {
  const { name } = figmaCollection;
  const modes = figmaCollection.modes.map(toMode);
  const defaultMode = toMode(getDefaultMode(figmaCollection));
  return { name, modes, defaultMode };
}

function toMode({ name }: FigmaMode) {
  return name;
}

function toAnyVariable(
  variable: FigmaVariable,
  resolvers: Resolvers,
): AnyVariable {
  const { resolvedType } = variable;

  if (resolvedType === "COLOR") {
    return toVariable(variable, resolvers, toColorValue, toColorScopes);
  }

  if (resolvedType === "FLOAT") {
    return toVariable(variable, resolvers, toNumberValue, toNumberScopes);
  }

  if (resolvedType === "BOOLEAN") {
    return toVariable(variable, resolvers, toBooleanValue, toBooleanScopes);
  }

  if (resolvedType === "STRING") {
    return toVariable(variable, resolvers, toStringValue, toStringScopes);

    // This is unreachable because of the `isSupportedByJson` check. It is kept
    // here in case the supported types change.
    /* v8 ignore next 4 */
  }

  fail(`Unsupported variable type: ${resolvedType}`);
}

function toVariable<V extends AnyValue, S extends string>(
  figmaVariable: FigmaVariable,
  resolvers: Resolvers,
  toValue: (figmaValue: VariableValue) => V,
  toScopes: (scopes: VariableScope[]) => S[],
): Variable<V, S> {
  const { name, variableCollectionId } = figmaVariable;
  const { resolveCollection, resolveDefaultValue } = resolvers;

  const collection = resolveCollection(variableCollectionId);
  const key = toVariableKey(collection, figmaVariable);
  const scopes = toScopes(figmaVariable.scopes);
  const valuesByMode = getValuesByMode(figmaVariable, resolvers, toValue);
  const defaultValue = toValue(resolveDefaultValue(figmaVariable));
  const { type } = defaultValue;

  return {
    key,
    name,
    type,
    valuesByMode,
    defaultValue,
    collection,
    scopes,
  } as const;
}

function getValuesByMode<T>(
  variable: FigmaVariable,
  resolvers: Resolvers,
  toValue: (figmaValue: VariableValue) => T,
): Record<string, T | AliasValue> {
  const collectionId = variable.variableCollectionId;
  return chain(variable.valuesByMode)
    .mapKeys((_, key) => toMode(resolvers.resolveMode(collectionId, key)))
    .mapValues(it =>
      isFigmaVariableAlias(it) ? toAliasValue(it, resolvers) : toValue(it),
    )
    .value();
}

function toAliasValue(
  figmaValue: VariableAlias,
  resolvers: Resolvers,
): AliasValue {
  const variableId = figmaValue.id;
  const variable = resolvers.resolveVariable(variableId);
  const collection = resolvers.resolveCollection(variable.variableCollectionId);
  const key = toVariableKey(collection, variable);
  return { type: "alias", value: { key } };
}

function toVariableKey(collection: Collection, figmaVariable: FigmaVariable) {
  return `${collection.name}/${figmaVariable.name}`;
}

function toColorValue(figmaValue: VariableValue): ColorValue {
  assert(
    isFigmaColorValue(figmaValue),
    `Unsupported color value: ${figmaValue}`,
  );
  const hex = toHex(figmaValue);
  const rgba = toRgba(figmaValue);
  return { type: "color", value: { hex, rgba } };
}

function toHex(value: RGB | RGBA): string {
  const red = toColorHexPart(value.r);
  const green = toColorHexPart(value.g);
  const blue = toColorHexPart(value.b);
  const alphaValue = "a" in value ? value.a : 1;
  const alpha = alphaValue !== 1 ? toColorHexPart(alphaValue) : "";
  return `#${red}${green}${blue}${alpha}`;
}

function toRgba(value: RGB | RGBA): [number, number, number, number] {
  const red = toColorRgbaPart(value.r);
  const green = toColorRgbaPart(value.g);
  const blue = toColorRgbaPart(value.b);
  const alpha = "a" in value ? value.a : 1;
  return [red, green, blue, alpha];
}

function toNumberValue(figmaValue: VariableValue): NumberValue {
  assert(
    isFigmaNumberValue(figmaValue),
    `Unsupported number value: ${figmaValue}`,
  );
  return { type: "number", value: figmaValue };
}

function toStringValue(figmaValue: VariableValue): StringValue {
  assert(
    isFigmaStringValue(figmaValue),
    `Unsupported string value: ${figmaValue}`,
  );
  return { type: "string", value: figmaValue };
}

function toBooleanValue(figmaValue: VariableValue): BooleanValue {
  assert(
    isFigmaBooleanValue(figmaValue),
    `Unsupported boolean value: ${figmaValue}`,
  );
  return { type: "boolean", value: figmaValue };
}

function toColorScopes(scopes: VariableScope[]): ColorScope[] {
  return toScopes(COLOR_SCOPE_MAPPING, scopes);
}

function toNumberScopes(scopes: VariableScope[]): NumberScope[] {
  return toScopes(NUMBER_SCOPE_MAPPING, scopes);
}

function toStringScopes(scopes: VariableScope[]): StringScope[] {
  return toScopes(STRING_SCOPE_MAPPING, scopes);
}

function toBooleanScopes(scopes: VariableScope[]): BooleanScope[] {
  return toScopes(BOOLEAN_SCOPE_MAPPING, scopes);
}

function toScopes<T extends string>(
  mapping: Partial<Record<VariableScope, T[]>>,
  scopes: VariableScope[],
): T[] {
  return chain(scopes)
    .flatMap(it => mapping[it] || [])
    .uniq()
    .value();
}

export function isSupportedByCss(value: AnyVariable) {
  return CSS_SUPPORTED_TYPES.includes(value.type);
}

export function isSupportedByJson(value: FigmaVariable) {
  return JSON_SUPPORTED_TYPES.includes(value.resolvedType);
}

interface Resolvers {
  resolveCollection: (collectionId: string) => Collection;
  resolveMode: (collectionId: string, modeId: string) => FigmaMode;
  resolveVariable: (variableId: string) => FigmaVariable;
  resolveDefaultValue: (value: FigmaVariable) => VariableValue;
}
