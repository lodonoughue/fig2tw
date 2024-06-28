interface Options {
  selector: string;
  fontSizePx: number;
  gridSystemPx: number;
  maxGridUnit: number;
}

export interface RootOptions {
  root: Options;
}

export interface PartialRootOptions {
  root?: Partial<Options>;
}

export function rootOf(overrides: Partial<Options> = {}): Options {
  return {
    selector: ":root",
    fontSizePx: 16,
    gridSystemPx: 4,
    maxGridUnit: 64,
    ...overrides,
  };
}
