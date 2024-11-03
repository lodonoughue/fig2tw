import { assert } from "@common/assert";

export type FigmaMode = VariableCollection["modes"][number];
export type FigmaCollection = VariableCollection;
export type FigmaVariable = Variable;

export async function getFigmaVariables() {
  const [variables, collections] = await Promise.all([
    figma.variables.getLocalVariablesAsync(),
    figma.variables.getLocalVariableCollectionsAsync(),
  ]);

  return { variables, collections };
}

export function findDefaultValue(
  collections: FigmaCollection[],
  variables: FigmaVariable[],
  variable: FigmaVariable,
): Exclude<VariableValue, VariableAlias> {
  const value = getDefaultModeValue(collections, variable);

  if (isFigmaVariableAlias(value)) {
    const variable = findVariableById(variables, value.id);
    return findDefaultValue(collections, variables, variable);
  }

  return value;
}

function getDefaultModeValue(
  collections: FigmaCollection[],
  { variableCollectionId, valuesByMode }: FigmaVariable,
): VariableValue {
  const collection = findCollectionById(collections, variableCollectionId);
  return valuesByMode[collection.defaultModeId];
}

export function findCollectionById(
  collections: FigmaCollection[],
  collectionId: string,
): FigmaCollection {
  const collection = collections.find(it => it.id === collectionId);
  assert(
    collection != null,
    `Could not resolve collection with id ${collectionId}`,
  );
  return collection;
}

export function findModeById(
  collections: FigmaCollection[],
  collectionId: string,
  modeId: string,
): FigmaMode {
  const collection = findCollectionById(collections, collectionId);
  const mode = collection.modes.find(it => it.modeId === modeId);
  assert(mode != null, `Mode could not be resolved: ${modeId}`);
  return mode;
}

export function getDefaultMode(collection: FigmaCollection): FigmaMode {
  const { defaultModeId } = collection;
  const mode = collection.modes.find(it => it.modeId === defaultModeId);
  assert(mode != null, `Default mode could not be resolved: ${defaultModeId}`);
  return mode;
}

export function findVariableById(
  variables: FigmaVariable[],
  variableId: string,
): FigmaVariable {
  const variable = variables.find(it => it.id === variableId);
  assert(variable != null, `Variable could not be resolved: ${variableId}`);
  return variable;
}

export function isFigmaVariableAlias(
  value: VariableValue,
): value is VariableAlias {
  return (
    typeof value === "object" &&
    "type" in value &&
    value.type === "VARIABLE_ALIAS"
  );
}

export function isFigmaColorValue(value: VariableValue): value is RGB | RGBA {
  return (
    typeof value === "object" &&
    "r" in value &&
    typeof value.r === "number" &&
    "g" in value &&
    typeof value.g === "number" &&
    "b" in value &&
    typeof value.b === "number"
  );
}

export function isFigmaNumberValue(value: VariableValue): value is number {
  return typeof value === "number";
}

export function isFigmaStringValue(value: VariableValue): value is string {
  return typeof value === "string";
}

export function isFigmaBooleanValue(value: VariableValue): value is boolean {
  return typeof value === "boolean";
}

export function isVariableNumber(value: VariableValue): value is number {
  return typeof value === "number";
}
