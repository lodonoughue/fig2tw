export function assert(
  value: unknown,
  ...errorMessages: string[]
): asserts value {
  if (!value) fail(...errorMessages);
}

export function fail(...errorMessages: string[]): never {
  throw new Error(`fig2tw: ${errorMessages.join(" ")}`);
}

export function zip<T, U>(arr1: T[], arr2: U[]): [T, U][] {
  assert(
    arr1.length === arr2.length,
    `cannot zip arrays with different lengths (arr1: ${arr1.length}, arr2: ${arr2.length})`,
  );
  return arr1.map((value, index) => [value, arr2[index]]);
}

export function range(start: number, end: number): number[] {
  return Array(end - start)
    .fill(undefined)
    .map((_, index) => start + index);
}
