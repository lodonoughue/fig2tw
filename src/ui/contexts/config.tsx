import React, {
  ComponentType,
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from "react";
import { Config, defaultConfig } from "@common/config";
import { useResult } from "@ui/hooks/use-result";
import { MessageBroker } from "@common/messages";
import {
  LoadConfigRequest,
  LoadConfigResult,
  SaveConfigRequest,
} from "@common/channels";
import { AnyScope } from "@common/variables";

const ConfigContext = createContext<State | null>(null);

export function ConfigProvider({ children, broker }: Props) {
  const { isLoading, result } = useResult<LoadConfigRequest, LoadConfigResult>(
    broker,
    "LOAD_CONFIG_RESULT",
    "LOAD_CONFIG_REQUEST",
  );
  const { config, scopes } = result || { config: null, scopes: [] };

  const setConfig = useCallback(
    (config: Config) =>
      broker.post<SaveConfigRequest>("SAVE_CONFIG_REQUEST", config),
    [broker],
  );

  return (
    <ConfigContext.Provider value={{ isLoading, config, scopes, setConfig }}>
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

interface Props extends PropsWithChildren {
  broker: MessageBroker;
}

interface State {
  isLoading: boolean;
  config: Config | null;
  scopes: AnyScope[];
  setConfig: (config: Config) => void;
}

export const configProviderFixtures = {
  configProviderOf({
    isLoading = false,
    config = defaultConfig,
    scopes = [],
    setConfig,
  }: Partial<State>): ComponentType<PropsWithChildren> {
    return function ConfigProvider({ children }) {
      const [_config, _setConfig] = useState<Config | null>(config);
      return (
        <ConfigContext.Provider
          value={{
            isLoading,
            scopes,
            config: _config,
            setConfig: setConfig || _setConfig,
          }}>
          {children}
        </ConfigContext.Provider>
      );
    };
  },
};
