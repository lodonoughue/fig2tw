import { VariableObject, deepMerge, range } from "@fig2tw/shared";
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

export function fig2twPlugin<T extends VariableObject = VariableObject>(
  opts: ImportOptions<T> & DefineOptions<T> & DeepPartial<PluginOptions>,
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
  config,
  formatters,
}: PluginOptions): ConfigurationResult {
  const spacing = { "0": "0px", px: "1px" } as Record<string, string>;
  [0.5, 1.5, 2.5, ...rangeOf(config)].forEach(it => {
    spacing[String(it)] = formatters.toCssNumberValue(it, { config });
  });

  return {
    cssBundle: {
      [config.rootSelector]: { fontSize: `${config.rootFontSizePx}px` },
    },
    twConfig: {
      spacing,
    },
  };
}

function rangeOf(config: PluginOptions["config"]) {
  return range(1, config.gridSystemMaxUnit + 1);
}

function configureColors<T extends VariableObject>(
  variables: T,
  { defineColors, ...opts }: DefineOptions<T> & PluginOptions,
): ConfigurationResult {
  const config = configure("color", variables, defineColors, opts);
  return {
    cssBundle: config.cssBundle,
    twConfig: { colors: config.twConfig },
  };
}

function configureSpacing<T extends VariableObject>(
  variables: T,
  { defineSpacing, ...options }: DefineOptions<T> & PluginOptions,
): ConfigurationResult {
  const config = configure("space", variables, defineSpacing, options);
  return {
    cssBundle: config.cssBundle,
    twConfig: { extend: { spacing: config.twConfig } },
  };
}

function configureSizes<T extends VariableObject>(
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

function configureRadius<T extends VariableObject>(
  variables: T,
  { defineRadius, ...options }: DefineOptions<T> & PluginOptions,
): ConfigurationResult {
  const config = configure("radius", variables, defineRadius, options);
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

interface PluginOptions extends ConfigOptions, FormattersOptions {}

interface DefineOptions<T extends VariableObject> {
  defineColors?: VariableSelector<T>;
  defineScreens?: VariableSelector<T>;
  defineSpacing?: VariableSelector<T>;
  defineSizes?: VariableSelector<T>;
  defineRadius?: VariableSelector<T>;
}

export function pluginOptionsOf<T extends DeepPartial<PluginOptions>>({
  config,
  formatters,
  ...overrides
}: DeepPartial<PluginOptions> = {}): T & PluginOptions {
  return {
    config: configOf(config),
    formatters: formattersOf(formatters),
    ...overrides,
  } as T & PluginOptions;
}
