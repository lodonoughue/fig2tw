import { fail } from "./utils.js";

type Value =
  | bigint
  | boolean
  | number
  | string
  | symbol
  | Array<unknown>
  | ((...args: unknown[]) => unknown | void);

type RecursiveObject = {
  readonly [key: string]: Value | RecursiveObject;
};

export function deepMerge<T extends RecursiveObject | undefined>(
  objects: Partial<T>[],
): T {
  return objects.reduce<T>(mergeObject, {} as T);
}

function mergeObject<T extends RecursiveObject | undefined>(
  target: T,
  object: Partial<T>,
): T {
  if (target == null) return target;

  Object.entries(object).forEach(([key, value]) => {
    if (isObject(value) && hasObjectOrUndefinedAt(target, key)) {
      return mergeObject(getOrAssignObject(target, key), value);
    }
    if (isValue(value) && isUndefined(target[key])) {
      return assignProperty(target, key, value);
    }
    fail(`a value is already assigned to ${String(key)}`);
  });

  return target;
}

function getOrAssignObject(
  target: RecursiveObject,
  key: string,
): RecursiveObject {
  const value = (target[key] ?? {}) as RecursiveObject;
  if (!Object.hasOwn(target, key)) {
    assignProperty(target, key, value);
  }
  return value;
}

function assignProperty<T>(target: RecursiveObject, key: string, value: T): T {
  Object.defineProperty(target, key, {
    value,
    writable: false,
    enumerable: true,
  });
  return value;
}

function isObject(value: unknown): value is RecursiveObject {
  return typeof value === "object" && !isArray(value);
}

function isArray<T = unknown>(value: unknown): value is T[] {
  return Array.isArray(value);
}

function isUndefined(value: unknown): value is undefined {
  return typeof value === "undefined";
}

function hasObjectOrUndefinedAt<T extends RecursiveObject, P extends string>(
  target: T,
  key: P,
): target is T & { [K in P]: RecursiveObject | undefined } {
  return !Object.hasOwn(target, key) || isObject(target[key]);
}

function isValue(value: unknown): value is Value {
  return !isUndefined(value) && !isObject(value);
}
