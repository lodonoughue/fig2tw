/* v8 ignore start */
// Coverage is not calculated in fixtures, because it's only meant to help
// with the tests. It should  never be used in production code.

import { Options } from "./formatters";
import { vi } from "vitest";
import { configFixtures } from "./config.fixtures";

function createOptions({
  config = configFixtures.createConfig(),
  formatters = createFormattersOption(),
}: Partial<Options> = {}): Options {
  return { config, formatters };
}

function createFormattersOption({
  formatColor = vi.fn().mockReturnValue("formatted-color"),
  formatNumber = vi.fn().mockReturnValue("formatted-number"),
  formatString = vi.fn().mockReturnValue("formatted-string"),
}: Partial<Options["formatters"]> = {}): Options["formatters"] {
  return { formatColor, formatNumber, formatString };
}

export const formatterFixtures = {
  createOptions,
  createFormattersOption,
};
