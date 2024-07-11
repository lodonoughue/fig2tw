import { VariableObject, buildObject, deepMerge, range } from "@fig2tw/shared";
import plugin from "tailwindcss/plugin.js";
import { VariableSelector, configure } from "./configure.js";
import {
  FormattersOptions,
  formattersOf,
  toCssNumberPxValue,
} from "./formatters.js";
import { ConfigOptions, configOf } from "./config.js";
import { CssBundle } from "./css.js";
import { ImportOptions, importVariables } from "./import.js";
import { Config } from "tailwindcss";
import { DeepPartial } from "./types.js";
import { GridSystemOptions, gridSystemOf } from "./grid.js";

export function fig2twPlugin<T extends VariableObject = VariableObject>(
  opts: ImportOptions<T> & DefineOptions<T> & DeepPartial<PluginOptions>,
) {
  const options = pluginOptionsOf(opts);
  const variables = importVariables<T>(opts);
  const configs = [
    configureRoot(options),
    configureGridSystem(options),
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

function configureRoot({ config }: PluginOptions): ConfigurationResult {
  const fontSize = toCssNumberPxValue(config.rootFontSizePx, { config });
  return {
    cssBundle: { [config.rootSelector]: { fontSize } },
    twConfig: {},
  };
}

function configureGridSystem({
  config,
  gridSystem,
  formatters: { toCssNumberValue },
}: PluginOptions): ConfigurationResult {
  if (gridSystem == null) {
    return { cssBundle: {}, twConfig: {} };
  }

  const spacing = {
    "0": "0px",
    px: "1px",
    ...buildObject(
      [0.5, 1.5, 2.5, ...rangeOf(gridSystem)],
      it => String(it),
      it => toCssNumberValue(it * gridSystem.unitPx, { config }),
    ),
  } as Record<string, string>;

  return {
    cssBundle: {},
    twConfig: { spacing },
  };
}

function rangeOf(gridSystem: NonNullable<PluginOptions["gridSystem"]>) {
  console.log("gridSystem.maxUnit", gridSystem.maxUnit);
  return range(1, gridSystem.maxUnit + 1);
}

function configureColors<T extends VariableObject>(
  variables: T,
  { defineColors, ...opts }: DefineOptions<T> & PluginOptions,
): ConfigurationResult {
  const config = configure(variables, defineColors, opts);
  return {
    cssBundle: config.cssBundle,
    twConfig: { colors: config.twConfig },
  };
}

function configureSpacing<T extends VariableObject>(
  variables: T,
  { defineSpacing, ...options }: DefineOptions<T> & PluginOptions,
): ConfigurationResult {
  const config = configure(variables, defineSpacing, options);
  return {
    cssBundle: config.cssBundle,
    twConfig: { extend: { spacing: config.twConfig } },
  };
}

function configureSizes<T extends VariableObject>(
  variables: T,
  { defineSizes, ...options }: DefineOptions<T> & PluginOptions,
): ConfigurationResult {
  const config = configure(variables, defineSizes, options);
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

function configureRadius<T extends VariableObject>(
  variables: T,
  { defineRadius, ...options }: DefineOptions<T> & PluginOptions,
): ConfigurationResult {
  const config = configure(variables, defineRadius, options);
  return {
    cssBundle: config.cssBundle,
    twConfig: { borderRadius: config.twConfig },
  };
}

function configureScreens<T extends VariableObject>(
  variables: T,
  { defineScreens, ...opts }: DefineOptions<T> & PluginOptions,
): ConfigurationResult {
  const options = overrideWithCssNumberPxFormatter(opts);
  const config = configure(variables, defineScreens, options);
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

interface PluginOptions
  extends ConfigOptions,
    GridSystemOptions,
    FormattersOptions {}

interface DefineOptions<T extends VariableObject> {
  defineColors?: VariableSelector<T>;
  defineScreens?: VariableSelector<T>;
  defineSpacing?: VariableSelector<T>;
  defineSizes?: VariableSelector<T>;
  defineRadius?: VariableSelector<T>;
}

export function pluginOptionsOf<T extends DeepPartial<PluginOptions>>({
  config,
  gridSystem,
  formatters,
  ...overrides
}: DeepPartial<PluginOptions> = {}): T & PluginOptions {
  return {
    config: configOf(config),
    gridSystem: gridSystemOf(gridSystem),
    formatters: formattersOf(formatters),
    ...overrides,
  } as T & PluginOptions;
}
