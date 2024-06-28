import { AnyValue, ValueStruct } from "@fig2tw/shared";
import { CssBundle, buildCssBundle } from "./css.js";
import { FormattersOptions } from "./formatters.js";
import { RootOptions } from "./root.js";
import { buildTwConfig } from "./tw-config.js";

export function configure<T extends ValueStruct>(
  context: string,
  variables: T,
  selector: ValueSelector<T> | undefined,
  options: RootOptions & FormattersOptions,
): Result {
  if (selector == null) return { cssBundle: {}, twConfig: {} };

  const values = selector(variables);
  const cssBundle = buildCssBundle(context, values, options);
  const twConfig = buildTwConfig(context, values, options);
  return { cssBundle, twConfig };
}

interface Result {
  cssBundle: CssBundle;
  twConfig: Record<string, string>;
}

export type ValueSelector<T extends ValueStruct> = (
  struct: T,
) => AnyValue[] | ValueStruct;
