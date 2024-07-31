import { VariableObject, deepMerge, pick } from "@fig2tw/shared";
import plugin from "tailwindcss/plugin.js";
import { BuilderOptions, VariableSelector, configure } from "./configure.js";
import { FormattersOptions, formattersOf } from "./formatters.js";
import { ConfigOptions, configOf } from "./config.js";
import { buildCssBundle, CssBundle } from "./css.js";
import { ImportOptions, importVariables } from "./import.js";
import { Config } from "tailwindcss";
import { DeepPartial } from "./types.js";
import { buildTwConfig } from "./tw-config.js";
import { ThemeConfig } from "tailwindcss/types/config.js";

export function fig2twPlugin<T extends VariableObject = VariableObject>(
  opts: ImportOptions<T> & DefineOptions<T> & DeepPartial<PluginOptions>,
) {
  const options = { ...pluginOptionsOf(opts), buildCssBundle, buildTwConfig };
  const variables = importVariables<T>(opts);
  const configs = [
    configureRoot(options),
    configureColors(variables, options),
    configureSpacing(variables, options),
    configureSizes(variables, options),
    configureBorderRadius(variables, options),
    configureFontFamily(variables, options),
    configureFontSize(variables, options),
    configureScreens(variables, options),
  ];

  const cssConfig = deepMerge<CssBundle>(configs.map(toCssBundle));
  const twConfig = deepMerge<Config["theme"]>(configs.map(toTwConfig));

  /* v8 ignore next */
  return plugin(({ addBase }) => addBase(cssConfig), { theme: twConfig });
}

function configureRoot({ config }: PluginOptions): ConfigurationResult {
  const fontSize = `${config.rootFontSizePx}px`;
  return {
    cssBundle: { [config.rootSelector]: { fontSize } },
    twConfig: {},
  };
}

function configureColors<T extends VariableObject>(
  variables: T,
  { colors, ...opts }: ConfigurationOptions<T>,
): ConfigurationResult {
  const { cssBundle, twConfig } = configure("colors", variables, colors, opts);
  return { cssBundle, twConfig: toProperty(twConfig, "colors") };
}

function configureSpacing<T extends VariableObject>(
  variables: T,
  { spacing, ...options }: ConfigurationOptions<T>,
): ConfigurationResult {
  const { cssBundle, twConfig } = configure(
    "spacing",
    variables,
    spacing,
    options,
  );
  return { cssBundle, twConfig: { extend: toProperty(twConfig, "spacing") } };
}

function configureSizes<T extends VariableObject>(
  variables: T,
  { sizes, ...options }: ConfigurationOptions<T>,
): ConfigurationResult {
  const { cssBundle, twConfig } = configure("size", variables, sizes, options);
  return {
    cssBundle,
    twConfig: {
      extend: {
        ...toProperty(twConfig, "width"),
        ...toProperty(twConfig, "minWidth"),
        ...toProperty(twConfig, "maxWidth"),
        ...toProperty(twConfig, "height"),
        ...toProperty(twConfig, "minHeight"),
        ...toProperty(twConfig, "maxHeight"),
      },
    },
  };
}

function configureBorderRadius<T extends VariableObject>(
  variables: T,
  { borderRadius, ...options }: ConfigurationOptions<T>,
): ConfigurationResult {
  const { cssBundle, twConfig } = configure(
    "borderRadius",
    variables,
    borderRadius,
    options,
  );
  return { cssBundle, twConfig: toProperty(twConfig, "borderRadius") };
}

function configureFontFamily<T extends VariableObject>(
  variables: T,
  { fontFamily, ...options }: ConfigurationOptions<T>,
): ConfigurationResult {
  const { cssBundle, twConfig } = configure(
    "fontFamily",
    variables,
    fontFamily,
    options,
  );
  return { cssBundle, twConfig: toProperty(twConfig, "fontFamily") };
}

function configureFontSize<T extends VariableObject>(
  variables: T,
  {
    fontSize,
    lineHeight,
    letterSpacing,
    fontWeight,
    ...options
  }: ConfigurationOptions<T>,
): ConfigurationResult {
  const fontSizeConfig = configure("fontSize", variables, fontSize, options);
  const fontSizeKeys = new Set(Object.keys(fontSizeConfig.twConfig));

  const lineHeightConfig = configure(
    "lineHeight",
    variables,
    lineHeight,
    options,
  );

  const letterSpacingConfig = configure(
    "letterSpacing",
    variables,
    letterSpacing,
    options,
  );

  const fontWeightConfig = configure(
    "fontWeight",
    variables,
    fontWeight,
    options,
  );

  const cssBundle = deepMerge([
    fontSizeConfig.cssBundle,
    lineHeightConfig.cssBundle,
    letterSpacingConfig.cssBundle,
    fontWeightConfig.cssBundle,
  ]);

  const fontSizeTwConfig = formatTwFontSizeConfig(
    fontSizeConfig.twConfig,
    lineHeightConfig.twConfig,
    letterSpacingConfig.twConfig,
    fontWeightConfig.twConfig,
  );

  const lineHeightTwConfig = formatTwLineHeightConfig(
    fontSizeKeys,
    lineHeightConfig.twConfig,
  );

  const letterSpacingTwConfig = formatTwLetterSpacingConfig(
    fontSizeKeys,
    letterSpacingConfig.twConfig,
  );

  const fontWeightTwConfig = formatTwFontWeightConfig(
    fontSizeKeys,
    fontWeightConfig.twConfig,
  );

  return {
    cssBundle,
    twConfig: {
      ...toProperty(fontSizeTwConfig, "fontSize"),
      ...toProperty(lineHeightTwConfig, "lineHeight"),
      ...toProperty(letterSpacingTwConfig, "letterSpacing"),
      ...toProperty(fontWeightTwConfig, "fontWeight"),
    },
  };
}

function formatTwFontSizeConfig(
  fontSizeConfig: Record<string, string>,
  lineHeightConfig: Record<string, string | undefined>,
  letterSpacingConfig: Record<string, string | undefined>,
  fontWeightConfig: Record<string, string | undefined>,
): ThemeConfig["fontSize"] {
  const result = {} as Record<string, FontSizeConfig>;

  Object.keys(fontSizeConfig).forEach(key => {
    result[key] = formatTwFontSize(
      fontSizeConfig[key],
      lineHeightConfig[key],
      letterSpacingConfig[key],
      fontWeightConfig[key],
    );
  });

  return result;
}

function formatTwFontSize(
  fontSize: string,
  lineHeight: string | undefined,
  letterSpacing: string | undefined,
  fontWeight: string | undefined,
): FontSizeConfig {
  if (letterSpacing != null || fontWeight != null) {
    return [fontSize, { lineHeight, letterSpacing, fontWeight }];
  }
  if (lineHeight != null) {
    return [fontSize, lineHeight];
  }
  return fontSize;
}

function formatTwLineHeightConfig(
  fontSizeConfigs: Set<string>,
  lineHeightConfig: Record<string, string>,
): ThemeConfig["lineHeight"] {
  return pick(
    lineHeightConfig,
    Object.keys(lineHeightConfig).filter(it => !fontSizeConfigs.has(it)),
    it => it,
  );
}

function formatTwLetterSpacingConfig(
  fontSizeConfigs: Set<string>,
  letterSpacingConfig: Record<string, string>,
): ThemeConfig["letterSpacing"] {
  return pick(
    letterSpacingConfig,
    Object.keys(letterSpacingConfig).filter(it => !fontSizeConfigs.has(it)),
    it => it,
  );
}

function formatTwFontWeightConfig(
  fontSizeConfigs: Set<string>,
  fontWeightConfig: Record<string, string>,
): ThemeConfig["fontWeight"] {
  return pick(
    fontWeightConfig,
    Object.keys(fontWeightConfig).filter(it => !fontSizeConfigs.has(it)),
    it => it,
  );
}

function configureScreens<T extends VariableObject>(
  variables: T,
  { screens, ...options }: ConfigurationOptions<T>,
): ConfigurationResult {
  const { cssBundle, twConfig } = configure(
    "screens",
    variables,
    screens,
    options,
  );
  return { cssBundle, twConfig: toProperty(twConfig, "screens") };
}

function toCssBundle({ cssBundle }: ConfigurationResult) {
  return cssBundle;
}

function toTwConfig({ twConfig }: ConfigurationResult) {
  return twConfig;
}

function toProperty<T extends object, P extends keyof ThemeConfig>(
  twConfig: T,
  prop: P,
): { [K in P]: T } | object {
  if (Object.keys(twConfig).length > 0) {
    return { [prop]: twConfig };
  }
  return {};
}

type ConfigurationOptions<T extends VariableObject> = DefineOptions<T> &
  PluginOptions &
  BuilderOptions;

interface ConfigurationResult {
  cssBundle: CssBundle;
  twConfig: Config["theme"];
}

interface PluginOptions extends ConfigOptions, FormattersOptions {}

interface DefineOptions<T extends VariableObject> {
  colors?: VariableSelector<T>;
  screens?: VariableSelector<T>;
  spacing?: VariableSelector<T>;
  sizes?: VariableSelector<T>;
  borderRadius?: VariableSelector<T>;
  fontFamily?: VariableSelector<T>;
  fontSize?: VariableSelector<T>;
  lineHeight?: VariableSelector<T>;
  letterSpacing?: VariableSelector<T>;
  fontWeight?: VariableSelector<T>;
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

type FontSizeConfig =
  | string
  | [fontSize: string, lineHeight: string]
  | [
      fontSize: string,
      configuration: Partial<{
        lineHeight: string;
        letterSpacing: string;
        fontWeight: string | number;
      }>,
    ];
