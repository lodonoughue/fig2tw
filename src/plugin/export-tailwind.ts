import { Config } from "@common/config";
import { loadVariables } from "./variables";
import {
  AliasValue,
  AnyScope,
  AnyVariable,
  ColorScope,
  ColorVariable,
  isColorVariable,
  isNumberVariable,
  isStringVariable,
  NumberScope,
  NumberVariable,
  StringScope,
} from "@common/variables";
import { convertToCssBundle } from "./export-css";
import {
  formatCssColorTwRgb,
  formatCssNumber,
  formatCssString,
  formatCssVariableRef,
  formatKebabCase,
  Formatters,
  Options,
  replaceRepeatedHyphens,
  trimEnd,
  trimStart,
} from "@common/formatters";
import { chain, isEmpty, isString } from "lodash";
import { withArgs } from "@common/utils";

const TEMPLATE = `
import plugin from "tailwindcss/plugin.js";

const figConfig = {{FIG_CONFIG}};

const twConfig = {{TW_CONFIG}};

const cssConfig = {{CSS_CONFIG}};

const fig2twPlugin = plugin(
\t({ addBase }) => addBase(cssConfig),
\t{ theme: twConfig }
);

export default fig2twPlugin;
`;

export async function exportTailwind(config: Config) {
  const variables = await loadVariables();
  const { tabWidth } = config;

  const formatters = {
    formatNumber: formatCssNumber,
    formatString: formatCssString,
    formatColor: formatCssColorTwRgb,
  } satisfies Formatters;

  const opts = { config, formatters };

  const figConfig = convertToFigmaScopeConfig(variables, opts);
  const cssConfig = convertToCssBundle(variables, opts);

  const figConfigKeys = Object.keys(figConfig);
  const twConfig = convertToTailwindConfig(0, figConfigKeys);

  return TEMPLATE.trimStart()
    .replace("{{FIG_CONFIG}}", JSON.stringify(figConfig, null, tabWidth))
    .replace("{{CSS_CONFIG}}", JSON.stringify(cssConfig, null, tabWidth))
    .replace("{{TW_CONFIG}}", twConfig)
    .replaceAll("\t", " ".repeat(tabWidth));
}

function convertToFigmaScopeConfig(vars: AnyVariable[], opts: Options) {
  return (
    chain({})
      // colors
      .extend(toFigmaColorScopeConfig("all-colors", vars, opts))
      .extend(toFigmaColorScopeConfig("fill-color", vars, opts))
      .extend(toFigmaColorScopeConfig("stroke-color", vars, opts))
      .extend(toFigmaColorScopeConfig("text-color", vars, opts))
      .extend(toFigmaColorScopeConfig("effect-color", vars, opts))
      // numbers
      .extend(toFigmaNumberScopeConfig("all-numbers", vars, opts))
      .extend(toFigmaNumberScopeConfig("radius", vars, opts))
      .extend(toFigmaNumberScopeConfig("size", vars, opts))
      .extend(toFigmaNumberScopeConfig("gap", vars, opts))
      .extend(toFigmaNumberScopeConfig("stroke-width", vars, opts))
      // typography
      .extend(toFigmaStringScopeConfig("font-family", vars, opts))
      .extend(toFigmaTypographyScopeConfig(vars, opts))
      .pickBy(it => !isEmpty(it))
      .value()
  );
}

function toFigmaColorScopeConfig(
  scope: ColorScope,
  variables: AnyVariable[],
  opts: Options,
) {
  const property = toFigmaScopeProperty(scope);
  const colors = chain(variables)
    .filter(isColorVariable)
    .filter(hasScope(scope))
    .keyBy(it => formatTwProperty(it, opts))
    .mapValues(it => formatTwColorReference(it, opts))
    .value();

  return { [property]: colors };
}

function toFigmaNumberScopeConfig(
  scope: NumberScope,
  variables: AnyVariable[],
  opts: Options,
) {
  const property = toFigmaScopeProperty(scope);
  const numbers = chain(variables)
    .filter(isNumberVariable)
    .filter(hasScope(scope))
    .keyBy(it => formatTwProperty(it, opts))
    .mapValues(it => formatTwReference(it, opts))
    .value();

  return { [property]: numbers };
}

function toFigmaStringScopeConfig(
  scope: StringScope,
  variables: AnyVariable[],
  opts: Options,
) {
  const property = toFigmaScopeProperty(scope);
  const strings = chain(variables)
    .filter(isStringVariable)
    .filter(hasScope(scope))
    .keyBy(it => formatTwProperty(it, opts))
    .mapValues(it => formatTwReference(it, opts))
    .value();

  return { [property]: strings };
}

function toFigmaTypographyScopeConfig(variables: AnyVariable[], opts: Options) {
  const scopes = [
    "font-size",
    "line-height",
    "letter-spacing",
    "font-weight",
  ] as const;

  const typography = chain(variables)
    .filter(isNumberVariable)
    .filter(hasScope(...scopes))
    .groupBy(it => formatTwProperty(it, opts))
    .mapValues(toTypographyConfig)
    .value();

  return chain({})
    .extend(toFigmaFontSizeScopeConfig(typography, opts))
    .extend(toFigmaLineHeightScopeConfig(typography, opts))
    .extend(toFigmaLetterSpacingScopeConfig(typography, opts))
    .extend(toFigmaFontWeightScopeConfig(typography, opts))
    .value();
}

function toFigmaFontSizeScopeConfig(
  typography: Record<string, Partial<TypographyConfig>>,
  opts: Options,
) {
  const property = toFigmaScopeProperty("font-size");
  const config = chain(typography)
    .pickBy(isFontSizeConfig)
    .mapValues(it => formatTwFontSizeConfig(it, opts))
    .value();

  return { [property]: config };
}

function toFigmaLineHeightScopeConfig(
  typography: Record<string, Partial<TypographyConfig>>,
  opts: Options,
) {
  const property = toFigmaScopeProperty("line-height");
  const config = chain(typography)
    .pickBy(isLineHeightConfig)
    .mapValues(it => formatTwReference(it.lineHeight, opts))
    .value();

  return { [property]: config };
}

function toFigmaLetterSpacingScopeConfig(
  typography: Record<string, Partial<TypographyConfig>>,
  opts: Options,
) {
  const property = toFigmaScopeProperty("letter-spacing");
  const config = chain(typography)
    .pickBy(isLetterSpacingConfig)
    .mapValues(it => formatTwReference(it.letterSpacing, opts))
    .value();

  return { [property]: config };
}

function toFigmaFontWeightScopeConfig(
  typography: Record<string, Partial<TypographyConfig>>,
  opts: Options,
) {
  const property = toFigmaScopeProperty("font-weight");
  const config = chain(typography)
    .pickBy(isFontWeightConfig)
    .mapValues(it => formatTwReference(it.fontWeight, opts))
    .value();

  return { [property]: config };
}

function toTypographyConfig(
  variables: NumberVariable[],
): Partial<TypographyConfig> {
  const fontSize = variables.find(hasScope("font-size"));
  const lineHeight = variables.find(hasScope("line-height"));
  const letterSpacing = variables.find(hasScope("letter-spacing"));
  const fontWeight = variables.find(hasScope("font-weight"));
  return { fontSize, lineHeight, letterSpacing, fontWeight };
}

function toFigmaScopeProperty(scope: AnyScope): string {
  return `figma:${scope}`;
}

function convertToTailwindConfig(indentCount: number, figConfigKeys: string[]) {
  const toScope = withArgs(toTwScope);
  const toScopeWithExtra = withArgs(toTwScopeWithExtraConfig, indentCount + 1);
  const applyIfDefined = withArgs(applyIfFigmaScopeIsDefined, figConfigKeys);

  const allColors = toFigmaScopeProperty("all-colors");
  const fillColors = toFigmaScopeProperty("fill-color");
  const strokeColors = toFigmaScopeProperty("stroke-color");
  const textColors = toFigmaScopeProperty("text-color");
  const effectColors = toFigmaScopeProperty("effect-color");

  const radiusNumbers = toFigmaScopeProperty("radius");
  const gapNumbers = toFigmaScopeProperty("gap");
  const strokeNumbers = toFigmaScopeProperty("stroke-width");

  const fontFamilyStrings = toFigmaScopeProperty("font-family");
  const fontSizeConfigs = toFigmaScopeProperty("font-size");
  const lineHeightNumbers = toFigmaScopeProperty("line-height");
  const letterSpacingNumbers = toFigmaScopeProperty("letter-spacing");
  const fontWeightNumbers = toFigmaScopeProperty("font-weight");

  return toMultilineObject(indentCount, [
    "...figConfig",
    `"extends": ${convertToTailwindExtendedConfig(figConfigKeys)}`,
    // colors
    ...applyIfDefined(allColors, () => [toScope("colors", [allColors])]),
    ...applyIfDefined(fillColors, () => [
      toScope("backgroundColor", ["colors", fillColors]),
      toScope("gradientColorStops", ["colors", fillColors]),
    ]),
    ...applyIfDefined(strokeColors, () => [
      toScope("borderColor", ["colors", strokeColors]),
      toScope("ringColor", ["colors", strokeColors]),
      toScope("ringOffsetColor", ["colors", strokeColors]),
      toScope("outlineColor", ["colors", strokeColors]),
    ]),
    ...applyIfDefined(textColors, () => [
      toScope("textColor", ["colors", textColors]),
      toScope("textDecorationColor", ["colors", textColors]),
      toScope("caretColor", ["colors", textColors]),
      toScope("placeholderColor", ["colors", textColors]),
    ]),
    ...applyIfDefined(effectColors, () => [
      toScope("boxShadowColor", ["colors", effectColors]),
    ]),
    // numbers
    ...applyIfDefined(radiusNumbers, () => [
      toScope("borderRadius", [radiusNumbers]),
    ]),
    ...applyIfDefined(gapNumbers, () => [
      toScope("padding", ["spacing", gapNumbers]),
      toScope("gap", ["spacing", gapNumbers]),
      toScope("space", ["spacing", gapNumbers]),
      toScope("scrollMargin", ["spacing", gapNumbers]),
      toScope("scrollPadding", ["spacing", gapNumbers]),
      toScope("borderSpacing", ["spacing", gapNumbers]),
    ]),
    ...applyIfDefined(strokeNumbers, () => [
      toScope("strokeWidth", [strokeNumbers]),
      toScope("outlineWidth", [strokeNumbers]),
      toScopeWithExtra("borderWidth", [strokeNumbers], {
        DEFAULT: "1px",
      }),
      toScopeWithExtra("ringWidth", [strokeNumbers], {
        DEFAULT: "3px",
      }),
    ]),
    // typography
    ...applyIfDefined(fontFamilyStrings, () => [
      toScope("fontFamily", [fontFamilyStrings]),
    ]),
    ...applyIfDefined(fontSizeConfigs, () => [
      toScope("fontSize", [fontSizeConfigs]),
    ]),
    ...applyIfDefined(lineHeightNumbers, () => [
      toScope("lineHeight", [lineHeightNumbers]),
    ]),
    ...applyIfDefined(letterSpacingNumbers, () => [
      toScope("letterSpacing", [letterSpacingNumbers]),
    ]),
    ...applyIfDefined(fontWeightNumbers, () => [
      toScope("fontWeight", [fontWeightNumbers]),
    ]),
  ]);
}

function convertToTailwindExtendedConfig(figConfigKeys: string[]) {
  const toScope = withArgs(toTwScope);
  const applyIfDefined = withArgs(applyIfFigmaScopeIsDefined, figConfigKeys);

  const fillColors = toFigmaScopeProperty("fill-color");
  const strokeColors = toFigmaScopeProperty("stroke-color");
  const allNumbers = toFigmaScopeProperty("all-numbers");
  const sizeNumbers = toFigmaScopeProperty("size");
  const gapNumbers = toFigmaScopeProperty("gap");

  return toMultilineObject(1, [
    ...applyIfDefined(fillColors, () => [
      toScope("fill", [fillColors]),
      toScope("accentColor", [fillColors]),
    ]),
    ...applyIfDefined(strokeColors, () => [toScope("stroke", [strokeColors])]),
    ...applyIfDefined(allNumbers, () => [toScope("spacing", [allNumbers])]),
    ...applyIfDefined(sizeNumbers, () => [
      toScope("size", [sizeNumbers]),
      toScope("width", [sizeNumbers]),
      toScope("minWidth", [sizeNumbers]),
      toScope("maxWidth", [sizeNumbers]),
      toScope("height", [sizeNumbers]),
      toScope("minHeight", [sizeNumbers]),
      toScope("maxHeight", [sizeNumbers]),
    ]),
    ...applyIfDefined(gapNumbers, () => [
      toScope("margin", [gapNumbers]),
      toScope("inset", [gapNumbers]),
    ]),
  ]);
}

function applyIfFigmaScopeIsDefined(
  figConfigKeys: string[],
  figScope: string,
  configure: () => string[],
) {
  return figConfigKeys.includes(figScope) ? configure() : [];
}

function toInlineObject(properties: string[]) {
  return `{ ${properties.join(", ")} }`;
}

function toMultilineObject(indentCount: number, properties: string[]) {
  const tabs = indent(indentCount);
  const innerTabs = indent(indentCount + 1);
  return [`{`, ...properties.map(it => `${innerTabs}${it},`), `${tabs}}`].join(
    "\n",
  );
}

function indent(count: number) {
  return "\t".repeat(count);
}

function toTwScope(scope: string, deps: string[]) {
  const args = toInlineObject(["theme"]);
  const body = toInlineObject(deps.map(it => `...theme("${it}")`));
  return `"${scope}": (${args}) => (${body})`;
}

function toTwScopeWithExtraConfig(
  indentCount: number,
  scope: string,
  deps: string[],
  extraConfig: Record<string, string>,
) {
  const extra = Object.entries(extraConfig);

  const args = toInlineObject(["theme"]);
  const body = toMultilineObject(indentCount, [
    ...deps.map(it => `...theme("${it}")`),
    ...extra.map(([key, value]) => `"${key}": "${value}"`),
  ]);

  return `"${scope}": (${args}) => (${body})`;
}

function formatTwProperty(variable: AnyVariable, { config }: Options) {
  return [
    formatKebabCase,
    trimKeywords(config),
    replaceRepeatedHyphens,
    trimStart,
    trimEnd,
  ].reduce((acc, fn) => fn(acc), variable.name);
}

function trimKeywords(config: Config) {
  return (name: string) =>
    config.trimKeywords.reduce(
      (acc, keyword) => acc.replaceAll(keyword, "-"),
      name,
    );
}

function formatTwReference(variable: AnyVariable, opts: Options) {
  const alias = {
    type: "alias",
    value: { key: variable.key },
  } satisfies AliasValue;
  return formatCssVariableRef(alias, variable, opts);
}

function formatTwColorReference(variable: ColorVariable, opts: Options) {
  const ref = formatTwReference(variable, opts);
  return `rgb(${ref} / <alpha-value>)`;
}

function formatTwFontSizeConfig(
  { fontSize, lineHeight, letterSpacing, fontWeight }: FontSizeTypographyConfig,
  opts: Options,
) {
  if (!some(lineHeight, letterSpacing, fontWeight)) {
    /**
     * returns tailwind simple configuration value, like
     * "fontSize": {
     *   "sm": "var(--typography-font-size-sm, .8em)",
     * }
     */
    return formatTwReference(fontSize, opts);
  }

  if (lineHeight != null && !some(letterSpacing, fontWeight)) {
    /**
     * returns tailwind configuration for fontSize and lineHeight, like
     * "fontSize": {
     *   "sm": [
     *     "var(--typography-font-size-sm, .8em)",
     *     "var(--typography-line-height-sm, 1em)",
     *   ],
     * }
     */
    return [
      formatTwReference(fontSize, opts),
      formatTwReference(lineHeight, opts),
    ];
  }

  /**
   * returns complete tailwind configuration for fontSize, lineHeight,
   *  letterSpacing and fontWeight like
   *  "fontSize": {
   *    "sm": [
   *      "var(--typography-font-size-sm, .8em)",
   *      {
   *        "lineHeight": "var(--typography-line-height-sm, 1em)",
   *        "letterSpacing": "var(--typography-letter-spacing-sm, 1px)",
   *        "fontWeight": "var(--typography-font-weight-sm, 500)",
   *      },
   *    ],
   *  }
   */
  return [
    formatTwReference(fontSize, opts),
    chain({
      lineHeight: lineHeight && formatTwReference(lineHeight, opts),
      letterSpacing: letterSpacing && formatTwReference(letterSpacing, opts),
      fontWeight: fontWeight && formatTwReference(fontWeight, opts),
    })
      .pickBy(isString)
      .value(),
  ];
}

function hasScope(...scopes: AnyScope[]) {
  return (variable: AnyVariable) =>
    variable.scopes.some(it => scopes.includes(it));
}

function isFontSizeConfig(
  config: Partial<TypographyConfig>,
): config is FontSizeTypographyConfig {
  return config.fontSize != null;
}

function isLineHeightConfig(
  config: Partial<TypographyConfig>,
): config is LineHeightTypographyConfig {
  return !isFontSizeConfig(config) && config.lineHeight != null;
}

function isLetterSpacingConfig(
  config: Partial<TypographyConfig>,
): config is LetterSpacingTypographyConfig {
  return !isFontSizeConfig(config) && config.letterSpacing != null;
}

function isFontWeightConfig(
  config: Partial<TypographyConfig>,
): config is FontWeightTypographyConfig {
  return !isFontSizeConfig(config) && config.fontWeight != null;
}

function some(...values: unknown[]) {
  return values.some(it => it != null);
}

interface TypographyConfig {
  fontSize: NumberVariable;
  lineHeight: NumberVariable;
  letterSpacing: NumberVariable;
  fontWeight: NumberVariable;
}

type FontSizeTypographyConfig = Pick<TypographyConfig, "fontSize"> &
  Partial<Omit<TypographyConfig, "fontSize">>;
type LineHeightTypographyConfig = Pick<TypographyConfig, "lineHeight">;
type LetterSpacingTypographyConfig = Pick<TypographyConfig, "letterSpacing">;
type FontWeightTypographyConfig = Pick<TypographyConfig, "fontWeight">;
