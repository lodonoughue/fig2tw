import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from "react";
import { Config, defaultConfig } from "@common/config";

const ConfigContext = createContext<State | null>(null);

export function ConfigProvider({ children }: PropsWithChildren) {
  const [config, _setConfig] = useState<Config>(sanitize(defaultConfig));

  const setConfig = useCallback((config: Config) => {
    _setConfig(sanitize(config));
  }, []);

  return (
    <ConfigContext.Provider value={{ config, setConfig }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
}

function sanitize(config: Config) {
  const { trimKeywords } = config;
  return {
    ...config,
    // sort by length descending to prevent keywords (eg. size) contained
    // in bigger keywords (eg. font-size) to break the latter keyword
    // (eg. font-[size])
    trimKeywords: trimKeywords.sort(byLengthDesc),
  };
}

interface State {
  config: Config;
  setConfig: (config: Config) => void;
}

function byLengthDesc(a: string, b: string) {
  return b.length - a.length;
}
