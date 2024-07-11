import { RecursiveObject } from "./objects.js";
import { assert, fail } from "./utils.js";

export type AnyValue = ColorValue | StringValue | NumberValue | BooleanValue;
export type AnyRef = ColorRef | StringRef | NumberRef | BooleanRef;
export type AnyVariable = AnyValue | AnyRef;
export type VariableObject = RecursiveObject<Variable<string>[]>;

export interface Variable<T extends string> {
  path: string[];
  collection: string;
  mode: string;
  type: T;
}

export interface ValueVariable<T extends string> extends Variable<T> {
  value: unknown;
}

export interface RefVariable<T extends string> extends Variable<T> {
  ref: string[];
}

export function isVariableArray(obj: unknown): obj is AnyVariable[] {
  return Array.isArray(obj);
}

export function valueOf(
  path: string[],
  collection: string,
  mode: string,
  value: string,
): StringValue;

export function valueOf(
  path: string[],
  collection: string,
  mode: string,
  value: number,
): NumberValue;

export function valueOf(
  path: string[],
  collection: string,
  mode: string,
  value: boolean,
): BooleanValue;

export function valueOf(
  path: string[],
  collection: string,
  mode: string,
  value: ColorValue["value"],
): ColorValue;

export function valueOf(
  path: string[],
  collection: string,
  mode: string,
  value: AnyValue["value"],
): AnyValue {
  assert(value != null, "cannot make a value from a null object");
  if (typeof value === "string") {
    return { path, collection, mode, value, type: "string" };
  }
  if (typeof value === "number") {
    return { path, collection, mode, value, type: "number" };
  }
  if (typeof value === "boolean") {
    return { path, collection, mode, value, type: "boolean" };
  }
  if (isRgbaObject(value)) {
    return { path, collection, mode, value, type: "color" };
  }
  fail(`cannot make a value of type ${typeof value}`);
}

export function refOf(
  path: string[],
  collection: string,
  mode: string,
  type: AnyRef["type"],
  ref: RefVariable<string>["ref"],
): AnyRef {
  return { path, collection, mode, type, ref };
}

export function isValueVariable<T extends string>(
  variable: Variable<T>,
): variable is ValueVariable<T> {
  return "value" in variable;
}

export function isRefVariable<T extends string>(
  variable: Variable<T>,
): variable is RefVariable<T> {
  return "ref" in variable && isRefObject(variable.ref);
}

function isRefObject(value: unknown): value is AnyRef["ref"] {
  return Array.isArray(value) && value.every(it => typeof it === "string");
}

export interface ColorRef extends RefVariable<"color"> {}

export interface ColorValue extends ValueVariable<"color"> {
  value: { r: number; g: number; b: number; a: number };
}

export function isColorVariable(
  variable: Variable<string>,
): variable is ColorValue | ColorRef {
  return variable.type === "color";
}

function isRgbaObject(object: unknown): object is ColorValue["value"] {
  return (
    object != null &&
    typeof object === "object" &&
    "r" in object &&
    "g" in object &&
    "b" in object
  );
}

export interface StringRef extends RefVariable<"string"> {}

export interface StringValue extends ValueVariable<"string"> {
  value: string;
}

export function isStringVariable(
  variable: Variable<string>,
): variable is StringValue | StringRef {
  return variable.type === "string";
}

export interface NumberRef extends RefVariable<"number"> {}
export interface NumberValue extends ValueVariable<"number"> {
  value: number;
}

export function isNumberVariable(
  variable: Variable<string>,
): variable is NumberValue | NumberRef {
  return variable.type === "number";
}

export interface BooleanRef extends RefVariable<"boolean"> {}
export interface BooleanValue extends ValueVariable<"boolean"> {
  value: boolean;
}

export function isBooleanVariable(
  variable: Variable<string>,
): variable is BooleanValue | BooleanRef {
  return variable.type === "boolean";
}

export function forEachVariableArray(
  obj: VariableObject | Variable<string>[] | null,
  callback: (path: string[], value: Variable<string>[]) => void,
) {
  _forEachValue([], obj, callback);
}

function _forEachValue(
  path: string[],
  obj: VariableObject | Variable<string>[] | null,
  callback: (path: string[], value: Variable<string>[]) => void,
) {
  assert(
    obj != null && typeof obj === "object",
    `cannot iterate on variables because obj does not satisfy VariableObject at ${path}.`,
  );

  if (isVariableArray(obj)) {
    callback(path, obj);
  } else {
    Object.entries(obj).forEach(([key, value]) => {
      _forEachValue([...path, key], value, callback);
    });
  }
}
