import {
  BooleanValue,
  ColorValue,
  NumberValue,
  StringValue,
  assert,
} from "@fig2tw/shared";

export function asColor(value: VariableValue): ColorValue["value"] {
  assertType(isColorVariable(value), "color");
  return {
    r: Math.round(value.r * 255),
    g: Math.round(value.g * 255),
    b: Math.round(value.b * 255),
    a: "a" in value ? value.a : 1,
  };
}

export function asString(value: VariableValue): StringValue["value"] {
  assertType(typeof value === "string", "string");
  return value;
}

export function asNumber(value: VariableValue): NumberValue["value"] {
  assertType(typeof value === "number", "number");
  return value;
}

export function asBoolean(value: VariableValue): BooleanValue["value"] {
  assertType(typeof value === "boolean", "boolean");
  return value;
}

function assertType(value: unknown, type: string): asserts value {
  assert(value, `cannot convert value into ${type}.`);
}

function isColorVariable(
  variableValue: VariableValue,
): variableValue is RGBA | RGB {
  return (
    typeof variableValue === "object" &&
    "r" in variableValue &&
    "g" in variableValue &&
    "b" in variableValue
  );
}
