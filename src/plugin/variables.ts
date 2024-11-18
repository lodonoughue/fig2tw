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
} from "./figma";
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
    resolveCollection: withArgs(findCollectionById, collections),
    resolveMode: withArgs(findModeById, collections),
    resolveVariable: withArgs(findVariableById, variables),
    resolveDefaultValue: withArgs(findDefaultValue, collections, variables),
  } satisfies Resolvers;

  return variables
    .filter(isSupportedByJson)
    .map(it => toAnyVariable(it, resolvers));
}

// Collections are memoized to preserve referential equality
const toCollection = memoize(_toCollection, collection => collection.id);
function _toCollection(figmaCollection: FigmaCollection): Collection {
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
  // Used to detect cycles
  aliasDeps: string[] = [],
): AnyVariable {
  const { resolvedType } = variable;

  if (resolvedType === "COLOR") {
    return toVariable(variable, resolvers, aliasDeps, toColorValue, it =>
      toScopes(COLOR_SCOPE_MAPPING, it),
    );
  }

  if (resolvedType === "FLOAT") {
    return toVariable(variable, resolvers, aliasDeps, toNumberValue, it =>
      toScopes(NUMBER_SCOPE_MAPPING, it),
    );
  }

  if (resolvedType === "BOOLEAN") {
    return toVariable(variable, resolvers, aliasDeps, toBooleanValue, it =>
      toScopes(BOOLEAN_SCOPE_MAPPING, it),
    );
  }

  if (resolvedType === "STRING") {
    return toVariable(variable, resolvers, aliasDeps, toStringValue, it =>
      toScopes(STRING_SCOPE_MAPPING, it),
    );
  }

  fail(`Unsupported variable type: ${resolvedType}`);
}

function toVariable<V extends AnyValue, S extends string>(
  figmaVariable: FigmaVariable,
  resolvers: Resolvers,
  aliasDeps: string[],
  toValue: (figmaValue: VariableValue) => V,
  toScopes: (scopes: VariableScope[]) => S[],
): Variable<V, S> {
  const { name, variableCollectionId } = figmaVariable;
  const { resolveCollection, resolveDefaultValue } = resolvers;

  const figmaCollection = resolveCollection(variableCollectionId);

  const key = toVariableKey(figmaCollection, figmaVariable);
  const collection = toCollection(figmaCollection);
  const scopes = toScopes(figmaVariable.scopes);
  const defaultValue = toValue(resolveDefaultValue(figmaVariable));
  const type = defaultValue.type;
  const valuesByMode = getValuesByMode(
    figmaVariable,
    resolvers,
    aliasDeps,
    toValue,
  );

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
  aliasDeps: string[],
  toValue: (figmaValue: VariableValue) => T,
): Record<string, T | AliasValue> {
  const collectionId = variable.variableCollectionId;
  return chain(variable.valuesByMode)
    .mapKeys((_, key) => toMode(resolvers.resolveMode(collectionId, key)))
    .mapValues(it =>
      isFigmaVariableAlias(it)
        ? toAliasValue(it, resolvers, aliasDeps)
        : toValue(it),
    )
    .value();
}

function toAliasValue(
  figmaValue: VariableAlias,
  resolvers: Resolvers,
  aliasDeps: string[],
): AliasValue {
  const variableId = figmaValue.id;
  assert(
    !aliasDeps.includes(variableId),
    `Cycle detected: ${aliasDeps.join(" -> ")} -> ${variableId}`,
  );

  const variable = resolvers.resolveVariable(variableId);
  const { key } = toAnyVariable(variable, resolvers, [
    ...aliasDeps,
    variableId,
  ]);
  return { type: "alias", value: { key } };
}

function toVariableKey(
  figmaCollection: FigmaCollection,
  figmaVariable: FigmaVariable,
) {
  return `${figmaCollection.name}/${figmaVariable.name}`;
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

function toScopes<T extends string>(
  mapping: Partial<Record<VariableScope, T[]>>,
  scopes: VariableScope[],
): T[] {
  return chain(scopes)
    .flatMap(it => mapping[it] || [])
    .uniq()
    .value();
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

export function isSupportedByCss(value: AnyVariable) {
  return CSS_SUPPORTED_TYPES.includes(value.type);
}

export function isSupportedByJson(value: FigmaVariable) {
  return JSON_SUPPORTED_TYPES.includes(value.resolvedType);
}

interface Resolvers {
  resolveCollection: (collectionId: string) => FigmaCollection;
  resolveMode: (collectionId: string, modeId: string) => FigmaMode;
  resolveVariable: (variableId: string) => FigmaVariable;
  resolveDefaultValue: (value: FigmaVariable) => VariableValue;
}
