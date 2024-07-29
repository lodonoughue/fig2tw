import { buildObject, RecursiveObject } from "./objects.js";

export function pick<
  T extends RecursiveObject<unknown>,
  P extends keyof T & string,
  R,
>(object: T, props: readonly P[], map: (result: T[P]) => R): { [A in P]: R } {
  return buildObject(
    props,
    prop => [prop],
    prop => map(object[prop]),
  ) as { [A in P]: R };
}
