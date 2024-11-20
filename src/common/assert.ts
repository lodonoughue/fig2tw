export function assert(
  value: unknown,
  ...errorMessages: string[]
): asserts value {
  if (!value) fail(...errorMessages);
}

export function fail(...errorMessages: string[]): never {
  throw new Error(["fig2tw:", ...errorMessages].join(" "));
}
