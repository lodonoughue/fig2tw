import { Variable, VariableObject } from "@fig2tw/shared";
import { CssBundle, buildCssBundle } from "./css.js";
import { FormattersOptions } from "./formatters.js";
import { ConfigOptions } from "./config.js";
import { buildTwConfig } from "./tw-config.js";

export function configure<T extends VariableObject>(
  variables: T,
  selector: VariableSelector<T> | undefined,
  options: ConfigOptions & FormattersOptions,
): Result {
  if (selector == null) return { cssBundle: {}, twConfig: {} };

  const values = selector(variables);
  const cssBundle = buildCssBundle(variables, values, options);
  const twConfig = buildTwConfig(values, options);
  return { cssBundle, twConfig };
}

interface Result {
  cssBundle: CssBundle;
  twConfig: Record<string, string>;
}

export type VariableSelector<T extends VariableObject> = (
  struct: T,
) => Variable<string>[] | VariableObject;
