interface Options {
  unitPx: number;
  maxUnit: number;
}

export interface GridSystemOptions {
  gridSystem?: Options;
}

export function gridSystemOf(
  overrides?: Partial<Options>,
): Options | undefined {
  return overrides == null
    ? undefined
    : {
        unitPx: 4,
        maxUnit: 64,
        ...overrides,
      };
}
