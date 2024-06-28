import {
  AnyValue,
  ValueStruct,
  assert,
  buildRecord,
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
  return buildRecord(
    collections,
    collection => collection.name,
    collection =>
      buildRecord(
        variables.filter(byCollection(collection)),
        variable => variable.name.split("/"),
        variable =>
          collection.modes.map(mode =>
            buildValue(
              collection.name,
              mode.name,
              variable,
              resolveVariableValue(variables, mode.modeId, variable),
            ),
          ),
      ),
  );
}

function buildValue(
  collection: string,
  mode: string,
  variable: Variable,
  value: VariableValue,
): AnyValue {
  switch (variable.resolvedType) {
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

async function loadAsync() {
  const collections = figma.variables.getLocalVariableCollectionsAsync();
  const variables = figma.variables.getLocalVariablesAsync();

  return {
    collections: await collections,
    variables: await variables,
  };
}

function byCollection(collection: VariableCollection) {
  return (variable: Variable) =>
    variable.variableCollectionId === collection.id;
}

function resolveVariableValue(
  variables: Variable[],
  modeId: string,
  variable: Variable,
): VariableValue {
  const value = variable.valuesByMode[modeId];
  assert(
    value != null,
    `resolved variable "${variable.name}" does not have a value for mode "${modeId}"`,
  );

  if (!isVariableAlias(value)) {
    return value;
  }

  const ref = variables.find(it => it.id === value.id);
  assert(ref != null, `cannot resolve variable alias to variable "${value.id}`);

  return resolveVariableValue(variables, modeId, ref);
}

function isVariableAlias(value: VariableValue): value is VariableAlias {
  return (
    typeof value === "object" &&
    "type" in value &&
    value.type === "VARIABLE_ALIAS"
  );
}
