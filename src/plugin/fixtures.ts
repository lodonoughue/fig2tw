/* v8 ignore start */
// Coverage is not calculated in fixtures, because it's only meant to help
// with the tests. It should  never be used in production code.

import { chain, zip } from "lodash";
import { vi } from "vitest";
import {
  isFigmaBooleanValue,
  isFigmaColorValue,
  isFigmaNumberValue,
  isFigmaStringValue,
} from "./figma";
import { fixtures as commonFixtures } from "@common/fixtures";

function createFigmaVariable({
  value,
  collection,
  id,
  key = "variable-key",
  name = "variable-name",
  description = "variable-description",
  hiddenFromPublishing = false,
  remote = false,
  variableCollectionId,
  resolvedType,
  valuesByMode,
  scopes = ["ALL_SCOPES"],
  codeSyntax = {},
  generateId = createIdGenerator(),
  getPublishStatusAsync = vi.fn(() => Promise.resolve("UNPUBLISHED" as const)),
  resolveForConsumer = vi.fn(),
  setValueForMode = vi.fn(),
  remove = vi.fn(),
  setVariableCodeSyntax = vi.fn(),
  removeVariableCodeSyntax = vi.fn(),
  getPluginData = vi.fn(),
  setPluginData = vi.fn(),
  getPluginDataKeys = vi.fn(),
  getSharedPluginData = vi.fn(),
  setSharedPluginData = vi.fn(),
  getSharedPluginDataKeys = vi.fn(),
}: FigmaVariableDefinition = {}): FigmaVariable {
  id ??= generateId();
  collection ??= inferVariableCollection(variableCollectionId, valuesByMode);
  variableCollectionId ??= inferVariableCollectionId(collection);
  value ??= inferValue(valuesByMode, resolvedType);
  resolvedType ??= inferResolvedType(value);
  valuesByMode ??= inferValuesByMode(value, collection);
  return {
    id,
    key,
    name,
    description,
    hiddenFromPublishing,
    remote,
    variableCollectionId,
    resolvedType,
    valuesByMode,
    scopes,
    codeSyntax,
    getPublishStatusAsync,
    resolveForConsumer,
    setValueForMode,
    remove,
    setVariableCodeSyntax,
    removeVariableCodeSyntax,
    getPluginData,
    setPluginData,
    getPluginDataKeys,
    getSharedPluginData,
    setSharedPluginData,
    getSharedPluginDataKeys,
  };
}

function createFigmaVariables(
  definitions: FigmaVariableDefinition[],
  generateId: () => string = createIdGenerator(),
): FigmaVariable[] {
  return definitions.map(it => createFigmaVariable({ ...it, generateId }));
}

function createFigmaCollection({
  id,
  key = "collection-key",
  name = "collection-name",
  hiddenFromPublishing = false,
  remote = false,
  modes,
  modeIds,
  modeNames,
  variableIds = [],
  defaultModeId,
  generateId = createIdGenerator(),
  getPublishStatusAsync = vi.fn(() => Promise.resolve("UNPUBLISHED" as const)),
  remove = vi.fn(),
  removeMode = vi.fn(),
  addMode = vi.fn(),
  renameMode = vi.fn(),
  getPluginData = vi.fn(),
  setPluginData = vi.fn(),
  getPluginDataKeys = vi.fn(),
  getSharedPluginData = vi.fn(),
  setSharedPluginData = vi.fn(),
  getSharedPluginDataKeys = vi.fn(),
}: FigmaCollectionDefinition = {}): FigmaCollection {
  id ??= generateId();
  modes ??= inferModes(modeIds, modeNames, defaultModeId, generateId);
  defaultModeId ??= inferDefaultModeId(modes);
  return {
    id,
    key,
    name,
    hiddenFromPublishing,
    remote,
    variableIds,
    modes,
    defaultModeId,
    getPublishStatusAsync,
    remove,
    removeMode,
    addMode,
    renameMode,
    getPluginData,
    setPluginData,
    getPluginDataKeys,
    getSharedPluginData,
    setSharedPluginData,
    getSharedPluginDataKeys,
  };
}

function createFigmaCollections(
  definitions: FigmaCollectionDefinition[],
  generateId: () => string = createIdGenerator(),
): FigmaCollection[] {
  return definitions.map(it => createFigmaCollection({ ...it, generateId }));
}

function createFigmaMode({
  modeId,
  name,
  generateId = createIdGenerator(),
}: FigmaModeDefinition = {}): FigmaMode {
  modeId ??= generateId ? generateId() : "mode-id";
  name ??= `${modeId}-name`;
  return { modeId, name };
}

function createFigmaRgbColor([
  r = 1,
  g = 1,
  b = 1,
]: FigmaColorDefinition = []): RGB {
  return { r, g, b };
}

function createFigmaRgbaColor([
  r = 1,
  g = 1,
  b = 1,
  a = 1,
]: FigmaColorDefinition = []): RGBA {
  return { r, g, b, a };
}

function createFigmaVariableAlias({
  id = "alias-id",
}: FigmaVariableAliasDefinition = {}): VariableAlias {
  return { type: "VARIABLE_ALIAS", id };
}

function createIdGenerator() {
  let id = 0;
  return () => `id-${id++}`;
}

function inferModes(
  modeIds: FigmaCollectionDefinition["modeIds"],
  modeNames: FigmaCollectionDefinition["modeNames"],
  defaultModeId: FigmaCollectionDefinition["defaultModeId"],
  generateId: FigmaCollectionDefinition["generateId"],
): FigmaCollection["modes"] {
  if (modeNames != null && modeIds != null) {
    return zip(modeIds, modeNames).map(([modeId, name]) =>
      createFigmaMode({ modeId, name }),
    );
  }

  if (modeIds != null) {
    return modeIds.map(modeId => createFigmaMode({ modeId }));
  }

  if (modeNames != null) {
    return modeNames.map((name, index) =>
      createFigmaMode({
        modeId: index === 0 && defaultModeId ? defaultModeId : undefined,
        name,
        generateId,
      }),
    );
  }

  return [createFigmaMode({ modeId: defaultModeId })];
}

function inferDefaultModeId(
  modes?: FigmaCollectionDefinition["modes"],
): FigmaCollection["defaultModeId"] {
  if (modes != null && modes.length) {
    return modes[0].modeId;
  }
  return createFigmaMode().modeId;
}

function inferVariableCollectionId(
  collection: FigmaVariableDefinition["collection"],
) {
  return collection ? collection.id : createFigmaCollection().id;
}

function inferValue(
  valuesByMode: FigmaVariableDefinition["valuesByMode"],
  resolvedType: FigmaVariableDefinition["resolvedType"],
): FigmaValue {
  const defaultValue = valuesByMode
    ? Object.values(valuesByMode)[0]
    : undefined;

  if (defaultValue) return defaultValue;
  if (resolvedType === "FLOAT") return 42;
  if (resolvedType === "BOOLEAN") return true;
  if (resolvedType === "COLOR") return createFigmaRgbaColor();

  return "foo";
}

function inferValuesByMode(value: FigmaValue, collection: FigmaCollection) {
  return chain(collection.modes)
    .keyBy("modeId")
    .mapValues(() => value)
    .value();
}

function inferResolvedType(value: FigmaValue) {
  if (isFigmaNumberValue(value)) return "FLOAT";
  if (isFigmaBooleanValue(value)) return "BOOLEAN";
  if (isFigmaStringValue(value)) return "STRING";
  if (isFigmaColorValue(value)) return "COLOR";
  return "STRING";
}

function inferVariableCollection(
  collectionId: FigmaVariableDefinition["variableCollectionId"],
  valuesByMode: FigmaVariableDefinition["valuesByMode"],
) {
  const modes = valuesByMode
    ? Object.keys(valuesByMode).map(modeId => createFigmaMode({ modeId }))
    : undefined;

  return createFigmaCollection({ id: collectionId, modes });
}

export const fixtures = {
  ...commonFixtures,
  createFigmaVariable,
  createFigmaVariables,
  createFigmaCollection,
  createFigmaCollections,
  createFigmaMode,
  createFigmaRgbColor,
  createFigmaRgbaColor,
  createFigmaVariableAlias,
  createIdGenerator,
};

type FigmaMode = VariableCollection["modes"][number];
type FigmaCollection = VariableCollection;
type FigmaVariable = Variable;
type FigmaValue = Variable["valuesByMode"][string];
type FigmaColorDefinition = [number, number, number, number?] | [];

interface FigmaVariableAliasDefinition {
  id?: string;
}

interface FigmaModeDefinition extends Partial<FigmaMode> {
  generateId?: () => string;
}

interface FigmaCollectionDefinition extends Partial<FigmaCollection> {
  modeNames?: string[];
  modeIds?: string[];
  generateId?: () => string;
}

interface FigmaVariableDefinition extends Partial<FigmaVariable> {
  value?: FigmaValue;
  collection?: FigmaCollection;
  generateId?: () => string;
}
