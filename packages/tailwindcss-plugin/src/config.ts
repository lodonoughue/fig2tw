interface Options {
  rootSelector: string;
  rootFontSizePx: number;
  forceUseCssVariables: boolean;
}

export interface ConfigOptions {
  config: Options;
}

export function configOf(overrides: Partial<Options> = {}): Options {
  return {
    rootSelector: ":root",
    rootFontSizePx: 16,
    forceUseCssVariables: false,
    ...overrides,
  };
}
