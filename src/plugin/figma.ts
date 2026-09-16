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
  // Used to detect cycles
  aliasVisited: string[] = [],
): Exclude<VariableValue, VariableAlias> {
  const value = getDefaultModeValue(collections, variable);

  if (isFigmaVariableAlias(value)) {
    assert(
      !aliasVisited.includes(value.id),
      `Cycle detected: ${aliasVisited.join(" -> ")} -> ${value.id}`,
    );

    const variable = findVariableById(variables, value.id);
    return findDefaultValue(collections, variables, variable, [
      ...aliasVisited,
      value.id,
    ]);
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

// These guards accept `unknown` rather than `VariableValue` because
// `VariableValue` doesn't (yet) cover every shape Figma actually returns —
// see FigmaComposedColor below. A runtime guard shouldn't be limited to the
// exact static type it's there to double-check.
export function isFigmaVariableAlias(value: unknown): value is VariableAlias {
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    value.type === "VARIABLE_ALIAS"
  );
}

export function isFigmaColorValue(value: unknown): value is RGB | RGBA {
  return (
    typeof value === "object" &&
    value !== null &&
    "r" in value &&
    typeof value.r === "number" &&
    "g" in value &&
    typeof value.g === "number" &&
    "b" in value &&
    typeof value.b === "number"
  );
}

/**
 * Figma's "Control opacity at scale" release (Sept 2026) lets a color
 * variable alias another color variable with an opacity override. This is
 * not yet represented in `@figma/plugin-typings` (see
 * https://github.com/figma/plugin-typings/issues/375), so this shape is
 * declared here based on the runtime values Figma actually returns: a
 * `{ color, opacity }` pair, not a `VARIABLE_EXPRESSION` wrapper.
 */
export interface FigmaComposedColor {
  color: VariableAlias;
  opacity: number | VariableAlias;
}

export function isFigmaComposedColorValue(
  value: unknown,
): value is FigmaComposedColor {
  return (
    typeof value === "object" &&
    value !== null &&
    "color" in value &&
    isFigmaVariableAlias(value.color) &&
    "opacity" in value &&
    (isFigmaNumberValue(value.opacity) || isFigmaVariableAlias(value.opacity))
  );
}

export function isFigmaNumberValue(value: unknown): value is number {
  return typeof value === "number";
}

export function isFigmaStringValue(value: unknown): value is string {
  return typeof value === "string";
}

export function isFigmaBooleanValue(value: unknown): value is boolean {
  return typeof value === "boolean";
}
