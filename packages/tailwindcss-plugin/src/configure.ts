import { Variable, VariableObject } from "@fig2tw/shared";
import { CssBundle, buildCssBundle } from "./css.js";
import { Context, FormattersOptions } from "./formatters.js";
import { ConfigOptions } from "./config.js";
import { buildTwConfig } from "./tw-config.js";

export function configure<T extends VariableObject>(
  context: Context,
  variables: T,
  selector: VariableSelector<T> | undefined,
  options: ConfigOptions & FormattersOptions & BuilderOptions,
): Result {
  if (selector == null) return { cssBundle: {}, twConfig: {} };

  const values = selector(variables);
  const cssBundle = options.buildCssBundle(context, variables, values, options);
  const twConfig = options.buildTwConfig(context, values, options);
  return { cssBundle, twConfig };
}

interface Result {
  cssBundle: CssBundle;
  twConfig: Record<string, string>;
}

export interface BuilderOptions {
  buildCssBundle: typeof buildCssBundle;
  buildTwConfig: typeof buildTwConfig;
}

export type VariableSelector<T extends VariableObject> = (
  struct: T,
) => Variable<string>[] | VariableObject;
