import {
  AnyVariable,
  VariableObject,
  assert,
  buildObject,
  fail,
  valueOf,
  refOf,
} from "@fig2tw/shared";
import { asBoolean, asColor, asNumber, asString } from "./converters.js";

const figmaTypeMapping = {
  COLOR: "color",
  FLOAT: "number",
  BOOLEAN: "boolean",
  STRING: "string",
} satisfies Record<string, AnyVariable["type"] | undefined>;

fig2tw();
function fig2tw() {
  console.clear();
  figma.showUI(__html__, { themeColors: true, width: 360, height: 420 });
  figma.ui.onmessage = async function ({ type }) {
    if (type === "GENERATE_JSON") {
      const json = await generateJson();
      figma.ui.postMessage({
        type: "DOWNLOAD_FILE",
        data: json,
      });
    }
  };
}

async function generateJson() {
  const { collections, variables } = await loadAsync();
  const result = buildVariableObject(collections, variables);
  return JSON.stringify(result);
}

function buildVariableObject(
  collections: VariableCollection[],
  variables: Variable[],
): VariableObject {
  const getCollection = makeGetCollection(collections);
  const getPath = makeGetPath(getCollection);
  const asComposite = withArgs(asVariableComposite, getCollection, getPath);
  const allVariables = variables.map(asComposite);

  return buildObject(
    allVariables,
    ({ path }) => path,
    withArgs(creatVariableArray, allVariables),
  );
}

function creatVariableArray(
  allVariables: FigmaVariable[],
  { variable, collection, path }: FigmaVariable,
): AnyVariable[] {
  return collection.modes.map(mode => {
    const value = getVariableValue(variable, mode);
    const type = getVariableType(variable);

    if (isVariableAlias(value)) {
      const ref = findRefVariable(allVariables, value);
      return refOf(path, collection.name, mode.name, type, ref.path);
    }

    switch (type) {
      case "color":
        return valueOf(path, collection.name, mode.name, asColor(value));
      case "boolean":
        return valueOf(path, collection.name, mode.name, asBoolean(value));
      case "number":
        return valueOf(path, collection.name, mode.name, asNumber(value));
      case "string":
        return valueOf(path, collection.name, mode.name, asString(value));
    }
  });
}

async function loadAsync() {
  const collections = figma.variables.getLocalVariableCollectionsAsync();
  const variables = figma.variables.getLocalVariablesAsync();

  return {
    collections: await collections,
    variables: await variables,
  };
}

function getVariableType({ resolvedType }: Variable): AnyVariable["type"] {
  const result = figmaTypeMapping[resolvedType];
  assert(result != null, `unknown figma type ${resolvedType}`);
  return result;
}

function getVariableValue(
  { name, valuesByMode }: Variable,
  { modeId, name: mode }: VariableCollection["modes"][0],
): VariableValue {
  const val = valuesByMode[modeId];
  assert(val != null, `variable "${name}" does not have a value for "${mode}"`);
  return val;
}

function findRefVariable(
  allVariables: FigmaVariable[],
  value: VariableAlias,
): FigmaVariable {
  const ref = allVariables.find(({ variable }) => variable.id === value.id);
  assert(ref != null, `cannot resolve variable alias to variable "${value.id}`);
  return ref;
}

function isVariableAlias(value: VariableValue): value is VariableAlias {
  return (
    typeof value === "object" &&
    "type" in value &&
    value.type === "VARIABLE_ALIAS"
  );
}

function makeGetCollection(collections: VariableCollection[]): GetCollection {
  return withCache(withArgs(findCollection, collections));
}

function makeGetPath(getCollection: GetCollection): GetPath {
  return withCache(withArgs(buildPath, getCollection), variable => variable.id);
}

function withCache<A, R>(
  func: (obj: A) => R,
  getKey: (obj: A) => unknown = obj => obj,
): (key: A) => R {
  const cache = new Map<unknown, R>();
  return obj => {
    const key = getKey(obj);
    let result = cache.get(key);
    if (result == null) {
      result = func(obj);
      cache.set(key, result);
    }
    return result;
  };
}

function withArgs<
  T extends unknown[],
  A extends unknown[],
  R extends unknown | void,
>(func: (...args: [...T, ...A]) => R, ...args: T): (...args: A) => R {
  return (...other) => func(...args, ...other);
}

function findCollection(
  collections: VariableCollection[],
  variable: Variable,
): VariableCollection {
  return (
    collections.find(it => it.id === variable.variableCollectionId) ??
    fail(`cannot find collection ${variable.variableCollectionId}`)
  );
}

function buildPath(getCollection: GetCollection, variable: Variable): string[] {
  const collection = getCollection(variable);
  return [collection.name, ...variable.name.split("/")];
}

function asVariableComposite(
  getCollection: GetCollection,
  getPath: GetPath,
  variable: Variable,
): FigmaVariable {
  const collection = getCollection(variable);
  const path = getPath(variable);
  return { variable, collection, path };
}

interface FigmaVariable {
  variable: Variable;
  collection: VariableCollection;
  path: string[];
}

type GetCollection = (variable: Variable) => VariableCollection;
type GetPath = (variable: Variable) => string[];
