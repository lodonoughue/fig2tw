export function withArgs<
  T extends unknown[],
  A extends unknown[],
  R extends unknown | void,
>(func: (...args: [...T, ...A]) => R, ...args: T): (...args: A) => R {
  return (...other) => func(...args, ...other);
}
