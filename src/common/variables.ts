export interface Collection {
  readonly name: string;
  readonly modes: string[];
  readonly defaultMode: string;
}

type Alias<V extends Variable> = Pick<V, "key">;

interface Color {
  readonly hex: string;
  readonly rgba: [number, number, number, number];
}

export interface Value<T extends string = string, V = unknown> {
  readonly type: T;
  readonly value: V;
}

export interface Variable<V extends Value = Value, S extends string = string> {
  readonly key: string;
  readonly name: string;
  readonly type: V["type"];
  readonly valuesByMode: Record<string, V | AliasValue>;
  readonly defaultValue: V;
  readonly collection: Collection;
  readonly scopes: S[];
}

export type AliasValue = Value<"alias", Alias<AnyVariable>>;

export type StringScope = "all-strings" | "font-family";
export type StringValue = Value<"string", string>;
export type StringVariable = Variable<StringValue, StringScope>;

// prettier-ignore
export type NumberScope = "all-numbers" | "radius" | "size" | "gap" | "stroke-width" | "font-size" | "line-height" | "letter-spacing" | "font-weight";
export type NumberValue = Value<"number", number>;
export type NumberVariable = Variable<NumberValue, NumberScope>;

export type BooleanScope = "all-booleans";
export type BooleanValue = Value<"boolean", boolean>;
export type BooleanVariable = Variable<BooleanValue, BooleanScope>;

// prettier-ignore
export type ColorScope = "all-colors" | "fill-color" | "stroke-color" | "text-color" | "effect-color";
export type ColorValue = Value<"color", Color>;
export type ColorVariable = Variable<ColorValue, ColorScope>;

export type AnyScope = StringScope | NumberScope | BooleanScope | ColorScope;

export type AnyValue =
  | AliasValue
  | StringValue
  | NumberValue
  | BooleanValue
  | ColorValue;

export type AnyVariable =
  | StringVariable
  | NumberVariable
  | BooleanVariable
  | ColorVariable;

export function isAliasValue(value: AnyValue): value is AliasValue {
  return value.type === "alias";
}

export function isColorValue(value: AnyValue): value is ColorValue {
  return value.type === "color";
}

export function isNumberValue(value: AnyValue): value is NumberValue {
  return value.type === "number";
}

export function isStringValue(value: AnyValue): value is StringValue {
  return value.type === "string";
}

export function isColorVariable(value: AnyVariable): value is ColorVariable {
  return value.type === "color";
}

export function isNumberVariable(value: AnyVariable): value is NumberVariable {
  return value.type === "number";
}

export function isBooleanVariable(
  value: AnyVariable,
): value is BooleanVariable {
  return value.type === "boolean";
}

export function isStringVariable(value: AnyVariable): value is StringVariable {
  return value.type === "string";
}
