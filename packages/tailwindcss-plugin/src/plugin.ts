import { ValueStruct, deepMerge, range } from "@fig2tw/shared";
import plugin from "tailwindcss/plugin.js";
import { ValueSelector, configure } from "./configure.js";
import {
  FormattersOptions,
  PartialFormattersOptions,
  formattersOf,
  toCssNumberPxValue,
} from "./formatters.js";
import { PartialRootOptions, RootOptions, rootOf } from "./root.js";
import { CssBundle } from "./css.js";
import { ImportOptions, importVariables } from "./import.js";
import { Config } from "tailwindcss";

export function fig2twPlugin<T extends ValueStruct = ValueStruct>(
  opts: ImportOptions<T> & DefineOptions<T> & PartialPluginOptions,
) {
  const options = pluginOptionsOf(opts);
  const variables = importVariables<T>(opts);
  const configs = [
    configureRoot(options),
    configureColors(variables, options),
    configureSpacing(variables, options),
    configureSizes(variables, options),
    configureRadius(variables, options),
    configureScreens(variables, options),
  ];

  return plugin(
    ({ addBase }) => addBase(deepMerge<CssBundle>(configs.map(toCssBundle))),
    { theme: deepMerge<Config["theme"]>(configs.map(toTwConfig)) },
  );
}

function configureRoot({
  root,
  formatters,
}: PluginOptions): ConfigurationResult {
  const spacing = { "0": "0px", px: "1px" } as Record<string, string>;
  [0.5, 1.5, 2.5, ...rangeOf(root)].forEach(it => {
    spacing[String(it)] = formatters.toCssNumberValue(it, { root });
  });

  return {
    cssBundle: {
      [root.selector]: { fontSize: `${root.fontSizePx}px` },
    },
    twConfig: {
      spacing,
    },
  };
}

function rangeOf(root: PluginOptions["root"]) {
  return range(1, root.maxGridUnit + 1);
}

function configureColors<T extends ValueStruct>(
  variables: T,
  { defineColors, ...opts }: DefineOptions<T> & PluginOptions,
): ConfigurationResult {
  const config = configure("color", variables, defineColors, opts);
  return {
    cssBundle: config.cssBundle,
    twConfig: { colors: config.twConfig },
  };
}

function configureSpacing<T extends ValueStruct>(
  variables: T,
  { defineSpacing, ...options }: DefineOptions<T> & PluginOptions,
): ConfigurationResult {
  const config = configure("space", variables, defineSpacing, options);
  return {
    cssBundle: config.cssBundle,
    twConfig: { extend: { spacing: config.twConfig } },
  };
}

function configureSizes<T extends ValueStruct>(
  variables: T,
  { defineSizes, ...options }: DefineOptions<T> & PluginOptions,
): ConfigurationResult {
  const config = configure("size", variables, defineSizes, options);
  return {
    cssBundle: config.cssBundle,
    twConfig: {
      extend: {
        width: config.twConfig,
        minWidth: config.twConfig,
        maxWidth: config.twConfig,
        height: config.twConfig,
        minHeight: config.twConfig,
        maxHeight: config.twConfig,
      },
    },
  };
}

function configureRadius<T extends ValueStruct>(
  variables: T,
  { defineRadius, ...options }: DefineOptions<T> & PluginOptions,
): ConfigurationResult {
  const config = configure("radius", variables, defineRadius, options);
  return {
    cssBundle: config.cssBundle,
    twConfig: { borderRadius: config.twConfig },
  };
}

function configureScreens<T extends ValueStruct>(
  variables: T,
  { defineScreens, ...opts }: DefineOptions<T> & PluginOptions,
): ConfigurationResult {
  const options = overrideWithCssNumberPxFormatter(opts);
  const config = configure("screen", variables, defineScreens, options);
  return {
    cssBundle: config.cssBundle,
    twConfig: { borderRadius: config.twConfig },
  };
}

function overrideWithCssNumberPxFormatter({
  formatters,
  ...options
}: PluginOptions): PluginOptions {
  return {
    ...options,
    formatters: { ...formatters, toCssNumberValue: toCssNumberPxValue },
  };
}

function toCssBundle({ cssBundle }: ConfigurationResult) {
  return cssBundle;
}

function toTwConfig({ twConfig }: ConfigurationResult) {
  return twConfig;
}

interface ConfigurationResult {
  cssBundle: CssBundle;
  twConfig: Config["theme"];
}

interface PluginOptions extends RootOptions, FormattersOptions {}
interface PartialPluginOptions
  extends PartialRootOptions,
    PartialFormattersOptions {}

interface DefineOptions<T extends ValueStruct> {
  defineColors?: ValueSelector<T>;
  defineScreens?: ValueSelector<T>;
  defineSpacing?: ValueSelector<T>;
  defineSizes?: ValueSelector<T>;
  defineRadius?: ValueSelector<T>;
}

export function pluginOptionsOf<T extends PartialPluginOptions>({
  root,
  formatters,
  ...overrides
}: PartialPluginOptions = {}): T & PluginOptions {
  return {
    root: rootOf(root),
    formatters: formattersOf(formatters),
    ...overrides,
  } as T & PluginOptions;
}
