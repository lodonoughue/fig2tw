interface Options {
  rootSelector: string;
  rootFontSizePx: number;
  gridSystemPx: number;
  gridSystemMaxUnit: number;
  forceUseCssVariables: boolean;
}

export interface ConfigOptions {
  config: Options;
}

export function configOf(overrides: Partial<Options> = {}): Options {
  return {
    rootSelector: ":root",
    rootFontSizePx: 16,
    gridSystemPx: 4,
    gridSystemMaxUnit: 64,
    forceUseCssVariables: false,
    ...overrides,
  };
}
