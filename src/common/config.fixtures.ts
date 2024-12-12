/* v8 ignore start */
// Coverage is not calculated in fixtures, because it's only meant to help
// with the tests. It should  never be used in production code.

import { Config, defaultConfig } from "./config";

function createConfig(partial: Partial<Config> = {}): Config {
  const trimKeywords = defaultConfig.trimKeywords.toSorted(
    (a, b) => b.length - a.length,
  );
  return { ...defaultConfig, trimKeywords, ...partial };
}

function createUnitsConfig(
  partial: Partial<Config["units"]> = {},
): Config["units"] {
  return { ...defaultConfig.units, ...partial };
}

export const configFixtures = {
  createConfig,
  createUnitsConfig,
};
