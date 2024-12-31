import { Config, defaultConfig } from "@common/config";

const CONFIG_KEY = "config";

export function loadConfig(): Config {
  const partialConfig = getPluginConfig();
  const config = sanitizeConfig(partialConfig);
  return config;
}

export function saveConfig(config: Config): Config {
  const sanitized = sanitizeConfig(config);
  setPluginConfig(sanitized);
  return sanitized;
}

// Returns Partial<Config> to force consumer to account for configs saved in
// prior versions of the plugins with missing values.
function getPluginConfig(): Partial<Config> {
  try {
    return JSON.parse(figma.root.getPluginData(CONFIG_KEY)) || {};
  } catch (_) {
    return {};
  }
}

function setPluginConfig(config: Config) {
  figma.root.setPluginData(CONFIG_KEY, JSON.stringify(config));
}

function sanitizeConfig({
  units: partialUnits,
  trimKeywords: partialTrimKeywords,
  ...partialConfig
}: Partial<Config>): Config {
  const units = { ...defaultConfig.units, ...partialUnits };
  const trimKeywords = sanitizeTrimKeywords(
    partialTrimKeywords || defaultConfig.trimKeywords,
  );
  return { ...defaultConfig, ...partialConfig, units, trimKeywords };
}

function sanitizeTrimKeywords(trimKeywords: Config["trimKeywords"]) {
  const keywords = [...trimKeywords];
  return keywords.sort(byLengthDesc);
}

function byLengthDesc(a: string, b: string) {
  return b.length - a.length;
}
