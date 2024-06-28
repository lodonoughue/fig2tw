import { assert } from "./utils.js";

export type RecursiveRecord<K extends PropertyKey, V> = {
  [key in K]: V | RecursiveRecord<K, V>;
};

export function buildRecord<T, K extends PropertyKey, V>(
  source: T[],
  keySelector: (src: T) => K | K[],
  valueSelector: (src: T) => V,
) {
  return source.reduce(
    (accumulator, current) => {
      assignTo(accumulator, keySelector(current), valueSelector(current));
      return accumulator;
    },
    {} as RecursiveRecord<K, V>,
  );
}

function assignTo<K extends PropertyKey, V>(
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

function isIntermediateLevel<K extends PropertyKey>(key: K | K[]): key is K[] {
  return Array.isArray(key) && key.length > 1;
}

function getKey<K extends PropertyKey>(key: K | K[]): K | undefined {
  return Array.isArray(key) ? key[key.length - 1] : key;
}

function getOrCreateRecord<K extends PropertyKey, V>(
  obj: RecursiveRecord<K, V>,
  key: K,
): RecursiveRecord<K, V> {
  if (typeof obj[key] === "undefined") {
    obj[key] = {} as RecursiveRecord<K, V>;
  }

  const result = obj[key];
  assert(typeof obj === "object", cannotAssignObjectToValueErrorMessage(key));

  return result as RecursiveRecord<K, V>;
}

function assignValue<K extends PropertyKey, V>(
  obj: RecursiveRecord<K, V>,
  key: K | undefined,
  value: V,
) {
  if (typeof key === "undefined") return;

  assert(typeof obj === "object", cannotAssignObjectToValueErrorMessage(key));
  assert(!(key in obj), duplicateKeyErrorMessage(key));

  obj[key] = value;
}

function duplicateKeyErrorMessage<K extends PropertyKey>(key?: K) {
  return `duplicate key ${String(key)} in object`;
}

function cannotAssignObjectToValueErrorMessage<K extends PropertyKey>(key?: K) {
  return `cannot assign an object to an already assigned variable "${String(key)}"`;
}
