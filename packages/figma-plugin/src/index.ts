import {
  AnyValue,
  RefValue,
  ValueStruct,
  assert,
  buildRecord,
  fail,
  valueOf,
} from "@fig2tw/shared";
import { asBoolean, asColor, asNumber, asString } from "./converters.js";

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
  const result = buildValueStruct(collections, variables);
  return JSON.stringify(result);
}

function buildValueStruct(
  collections: VariableCollection[],
  variables: Variable[],
): ValueStruct {
  const getCollection = withCache(withArgs(findCollection, collections));
  const asComposite = withArgs(asVariableComposite, getCollection);
  const allVariables = variables.map(asComposite);

  return buildRecord(
    allVariables,
    getPath,
    withArgs(createValueArray, allVariables),
  );
}

function resolveValue(
  allVariables: VariableComposite[],
  collection: VariableCollection,
  mode: VariableCollection["modes"][0],
  { variable }: VariableComposite,
): AnyValue {
  const value = getVariableValue(variable, mode);
  if (!isVariableAlias(value)) {
    return buildValue(collection.name, mode.name, variable.resolvedType, value);
  }

  const ref = findRefVariable(allVariables, value);
  if (ref.collection.id === collection.id) {
    return resolveValue(allVariables, collection, mode, ref);
  } else {
    return buildRefValue(collection.name, mode.name, ref);
  }
}

function buildValue(
  collection: string,
  mode: string,
  type: VariableResolvedDataType,
  value: VariableValue,
): AnyValue {
  switch (type) {
    case "COLOR":
      return valueOf(collection, mode, asColor(value));
    case "BOOLEAN":
      return valueOf(collection, mode, asBoolean(value));
    case "FLOAT":
      return valueOf(collection, mode, asNumber(value));
    case "STRING":
      return valueOf(collection, mode, asString(value));
  }
}

function buildRefValue(
  collection: string,
  mode: string,
  variable: VariableComposite,
): RefValue {
  return valueOf(collection, mode, getPath(variable));
}

async function loadAsync() {
  const collections = figma.variables.getLocalVariableCollectionsAsync();
  const variables = figma.variables.getLocalVariablesAsync();

  return {
    collections: await collections,
    variables: await variables,
  };
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
  allVariables: VariableComposite[],
  value: VariableAlias,
): VariableComposite {
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

function getPath({ collection, variable }: VariableComposite): string[] {
  return [collection.name, ...variable.name.split("/")];
}

function withCache<A, R>(func: (key: A) => R): (key: A) => R {
  const cache = new Map<A, R>();
  return key => {
    let result = cache.get(key);
    if (result == null) {
      result = func(key);
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
  collectionId: string,
): VariableCollection {
  return (
    collections.find(it => it.id === collectionId) ??
    fail(`cannot find collection ${collectionId}`)
  );
}

function asVariableComposite(
  getCollection: GetCollection,
  variable: Variable,
): VariableComposite {
  return { variable, collection: getCollection(variable.variableCollectionId) };
}

function createValueArray(
  allVariables: VariableComposite[],
  { collection, variable }: VariableComposite,
): AnyValue[] {
  return collection.modes.map(mode =>
    resolveValue(allVariables, collection, mode, { variable, collection }),
  );
}

interface VariableComposite {
  variable: Variable;
  collection: VariableCollection;
}

type GetCollection = (collectionId: string) => VariableCollection;
