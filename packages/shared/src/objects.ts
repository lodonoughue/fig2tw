import { assert, fail } from "./utils.js";

type BuiltIns =
  | bigint
  | boolean
  | number
  | string
  | symbol
  | Array<unknown>
  | ((...args: unknown[]) => unknown | void);

export type RecursiveObject<T> = {
  readonly [key: string]: T | RecursiveObject<T> | undefined;
};

export function deepMerge<T extends RecursiveObject<BuiltIns> | undefined>(
  objects: Partial<T>[],
): T {
  return objects.reduce<T>((accumulator, current) => {
    return mergeObject(accumulator, current as RecursiveObject<BuiltIns>);
  }, {} as T);
}

export function buildObject<T, R>(
  source: T[],
  keySelector: (src: T) => string | string[],
  valueSelector: (src: T) => R,
) {
  return source.reduce((accumulator, current) => {
    assignRecursive(accumulator, keySelector(current), valueSelector(current));
    return accumulator;
  }, {} as RecursiveObject<R>);
}

function mergeObject<T extends RecursiveObject<BuiltIns> | undefined>(
  target: T,
  object: RecursiveObject<BuiltIns>,
): T {
  if (target == null) return target;

  Object.entries(object).forEach(([key, value]) => {
    if (
      isRecursiveObject<BuiltIns>(value) &&
      (hasRecursiveObjectAt(target, key) || hasUndefinedAt(target, key))
    ) {
      value;
      return mergeObject(getOrCreateRecursiveObject(target, key), value);
    }
    if (isBuiltIn(value) && isUndefined(target[key])) {
      return assignProperty(target, key, value);
    }
    fail(`a value is already assigned to ${String(key)}`);
  });

  return target;
}

function getOrCreateRecursiveObject<T extends RecursiveObject<unknown>>(
  target: T,
  key: string,
): T {
  if (hasUndefinedAt(target, key)) {
    return assignProperty(target, key, {} as T);
  }
  if (hasRecursiveObjectAt(target, key)) {
    return target[key] as T;
  }
  fail(`cannot assign an object to an already assigned value`);
}

function assignRecursive<V, T extends RecursiveObject<V>>(
  target: T,
  key: string | string[],
  value: V,
) {
  if (isLastPropertyKey(key)) {
    const k = getLastPropertyKey(key);
    assignProperty(target, k, value);
  } else {
    const [k, ...keys] = key;
    const record = getOrCreateRecursiveObject(target, k);
    assignRecursive(record, keys, value);
  }
}

function isLastPropertyKey(key: string | string[]): key is string {
  return typeof key === "string" || key.length <= 1;
}

function getLastPropertyKey(key: string | string[]): string {
  return typeof key === "string" ? key : key[key.length - 1];
}

function assignProperty<T, V>(
  target: RecursiveObject<T>,
  key: string,
  value: V,
): V {
  assert(hasUndefinedAt(target, key), `duplicate key ${String(key)} in object`);
  Object.defineProperty(target, key, {
    value,
    writable: false,
    enumerable: true,
  });
  return value;
}

function isRecursiveObject<T>(value: unknown): value is RecursiveObject<T> {
  return typeof value === "object" && !isArray(value);
}

function isArray<T = unknown>(value: unknown): value is T[] {
  return Array.isArray(value);
}

function isUndefined(value: unknown): value is undefined {
  return typeof value === "undefined";
}

function hasRecursiveObjectAt<T, P extends string>(
  target: RecursiveObject<T>,
  key: P,
): target is RecursiveObject<T> & { [K in P]: RecursiveObject<T> } {
  return isRecursiveObject(target[key]);
}

function hasUndefinedAt<T, P extends string>(
  target: RecursiveObject<T>,
  key: P,
): target is RecursiveObject<T> & { [K in P]: undefined } {
  return !(key in target);
}

function isBuiltIn(value: unknown): value is BuiltIns {
  return !isUndefined(value) && !isRecursiveObject(value);
}
