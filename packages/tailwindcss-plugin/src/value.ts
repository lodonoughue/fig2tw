import { AnyValue, ValueStruct, assert, isValueArray } from "@fig2tw/shared";

export function forEachValueArray(
  obj: ValueStruct | AnyValue[] | null,
  callback: (path: string[], value: AnyValue[]) => void,
) {
  _forEachValue([], obj, callback);
}

function _forEachValue(
  path: string[],
  obj: ValueStruct | AnyValue[] | null,
  callback: (path: string[], value: AnyValue[]) => void,
) {
  assert(
    obj != null && typeof obj === "object",
    `cannot iterate on values because obj does not satisfy ValueStruct at ${path}.`,
  );

  if (isValueArray(obj)) {
    callback(path, obj);
  } else {
    Object.entries(obj).forEach(([key, value]) => {
      _forEachValue([...path, key], value, callback);
    });
  }
}
