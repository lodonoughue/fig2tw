type Key = string | number | symbol;
type RecursiveRecord<K extends Key, V> = {
  [key in K]: V | RecursiveRecord<K, V>;
};

console.clear();
figma.showUI(__html__, { themeColors: true, width: 360, height: 420 });
figma.ui.onmessage = async function ({ type }) {
  if (type === "GENERATE_JSON") {
    const json = await fig2tw();
    figma.ui.postMessage({
      type: "DOWNLOAD_FILE",
      data: json,
    });
  }
};

async function fig2tw() {
  const { collections, variables } = await loadAsync();

  const result = associate(
    collections,
    collection => collection.name,
    collection =>
      associate(
        variables.filter(byCollection(collection)),
        variable => variable.name.split("/"),
        variable =>
          associate(
            collection.modes,
            mode => mode.name,
            mode =>
              formatVariable(
                variable.resolvedType,
                resolveVariableValue(variables, mode.modeId, variable),
              ),
            {
              modes: collection.modes.map(it => it.name),
            },
          ),
      ),
  );

  return JSON.stringify(result);
}

async function loadAsync() {
  const collections = figma.variables.getLocalVariableCollectionsAsync();
  const variables = figma.variables.getLocalVariablesAsync();

  return {
    collections: await collections,
    variables: await variables,
  };
}

function associate<T, K extends Key, V>(
  source: T[],
  keySelector: (src: T) => K | K[],
  valueSelector: (src: T) => V,
  initialObject: object = {},
) {
  return source.reduce(
    (accumulator, current) => {
      assignTo(accumulator, keySelector(current), valueSelector(current));
      return accumulator;
    },
    initialObject as RecursiveRecord<K, V>,
  );
}

function assignTo<K extends Key, V>(
  obj: RecursiveRecord<K, V>,
  key: K | K[],
  value: V,
) {
  if (isIntermediateLevel(key)) {
    const [k, ...keys] = key;
    const record = getOrCreateRecord(obj, k);
    return assignTo(record, keys, value);
  }

  assignValue(obj, getKey(key), value);
}

function isIntermediateLevel<K extends Key>(key: K | K[]): key is K[] {
  return Array.isArray(key) && key.length > 1;
}

function getKey<K extends Key>(key: K | K[]): K | undefined {
  return Array.isArray(key) ? key[key.length - 1] : key;
}

function getOrCreateRecord<K extends Key, V>(
  obj: RecursiveRecord<K, V>,
  key: K,
): RecursiveRecord<K, V> {
  if (typeof obj[key] === "undefined") {
    obj[key] = {} as RecursiveRecord<K, V>;
  }

  const result = obj[key];
  if (typeof obj !== "object") {
    throw new Error(
      `fig2tw: Cannot assign an object to an already assigned variable "${String(key)}"`,
    );
  }
  return result as RecursiveRecord<K, V>;
}

function assignValue<K extends Key, V>(
  obj: RecursiveRecord<K, V>,
  key: K | undefined,
  value: V,
) {
  if (typeof key === "undefined") return;

  if (key in obj) {
    throw new Error(`fig2tw: Duplicate key ${String(key)} in object`);
  }

  obj[key] = value;
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

  if (value == null) {
    throw new Error(
      `fig2tw: Resolved variable "${variable.name}" does not have a value for mode "${modeId}"`,
    );
  }

  if (!isVariableAlias(value)) {
    return value;
  }

  const ref = variables.find(it => it.id === value.id);
  if (ref == null) {
    throw new Error(
      `fig2tw: Cannot resolve variable alias to variable "${value.id}"`,
    );
  }

  return resolveVariableValue(variables, modeId, ref);
}

function formatVariable(type: VariableResolvedDataType, value: VariableValue) {
  if (isColorVariable(type, value)) {
    return {
      r: Math.round(value.r * 255),
      g: Math.round(value.g * 255),
      b: Math.round(value.b * 255),
      a: value.a,
    };
  }
  return value;
}

function isColorVariable(
  type: VariableResolvedDataType,
  value: VariableValue,
): value is RGBA {
  return type === "COLOR";
}

function isVariableAlias(value: VariableValue): value is VariableAlias {
  return (
    typeof value === "object" &&
    "type" in value &&
    value.type === "VARIABLE_ALIAS"
  );
}
