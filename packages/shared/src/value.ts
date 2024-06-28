import { RecursiveRecord } from "./record.js";
import { assert } from "./utils.js";

export function isValueArray(obj: unknown): obj is AnyValue[] {
  return Array.isArray(obj);
}

export function valueOf(
  collection: string,
  mode: string,
  value: string,
): StringValue;

export function valueOf(
  collection: string,
  mode: string,
  value: number,
): NumberValue;

export function valueOf(
  collection: string,
  mode: string,
  value: boolean,
): BooleanValue;

export function valueOf(
  collection: string,
  mode: string,
  value: ColorValue["value"],
): ColorValue;

export function valueOf(
  collection: string,
  mode: string,
  value: AnyValue["value"],
): AnyValue {
  if (typeof value === "string") {
    return { collection, mode, value, type: "string" };
  }
  if (typeof value === "number") {
    return { collection, mode, value, type: "number" };
  }
  if (typeof value === "boolean") {
    return { collection, mode, value, type: "boolean" };
  }
  if (typeof value === "object") {
    return { collection, mode, value, type: "color" };
  }
  assert(false, `cannot make a value of type ${typeof value}`);
}

export type ValueStruct = RecursiveRecord<string, AnyValue[]>;
export type AnyValue =
  | ColorValue
  | StringValue
  | NumberValue
  | BooleanValue
  | Value;

interface Value {
  collection: string;
  mode: string;
  type: string;
  value: unknown;
}

export interface ColorValue extends Value {
  type: "color";
  value: {
    r: number;
    g: number;
    b: number;
    a: number;
  };
}

export function isColorValue(value: AnyValue): value is ColorValue {
  return value.type === "color";
}

export interface StringValue extends Value {
  type: "string";
  value: string;
}

export function isStringValue(value: AnyValue): value is StringValue {
  return value.type === "string";
}

export interface NumberValue extends Value {
  type: "number";
  value: number;
}

export function isNumberValue(value: AnyValue): value is NumberValue {
  return value.type === "number";
}

export interface BooleanValue extends Value {
  type: "boolean";
  value: boolean;
}

export function isBooleanValue(value: AnyValue): value is BooleanValue {
  return value.type === "boolean";
}
