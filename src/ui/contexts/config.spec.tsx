import React from "react";
import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ConfigProvider, useConfig } from "./config";
import { messageFixtures } from "@common/messages.fixtures";
import { configFixtures } from "@common/config.fixtures";
import { AnyScope } from "@common/variables";

const fixtures = { ...messageFixtures, ...configFixtures };

describe("useConfig", () => {
  it("should throw if used outside of ConfigProvider", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => renderHook(() => useConfig())).toThrow(
      "useConfig must be used within a ConfigProvider",
    );
  });

  it("should return isLoading=true until plugin response", () => {
    const broker = fixtures.createMessageBroker();
    broker.subscribe("LOAD_CONFIG_REQUEST", () => {
      // do not post LOAD_CONFIG_RESULT
    });

    const { result } = renderHook(() => useConfig(), {
      wrapper: props => <ConfigProvider broker={broker} {...props} />,
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.config).toBeNull();
    expect(result.current.scopes).toStrictEqual([]);
    expect(result.current.setConfig).toBeDefined();
  });

  it("should return result from broker", () => {
    const config = fixtures.createConfig({ baseFontSize: 42 });
    const scopes = ["all-colors", "all-numbers"] satisfies AnyScope[];

    const broker = fixtures.createMessageBroker();
    broker.subscribe("LOAD_CONFIG_REQUEST", () => {
      broker.post("LOAD_CONFIG_RESULT", { config, scopes });
    });

    const { result } = renderHook(() => useConfig(), {
      wrapper: props => <ConfigProvider broker={broker} {...props} />,
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.config).toStrictEqual(config);
    expect(result.current.scopes).toStrictEqual(scopes);
    expect(result.current.setConfig).toBeDefined();
  });

  it("should post SAVE_CONFIG_REQUEST when saving config", () => {
    const broker = fixtures.createMessageBroker();
    broker.subscribe("LOAD_CONFIG_REQUEST", () => {});

    vi.spyOn(broker, "post");

    const { result } = renderHook(() => useConfig(), {
      wrapper: props => <ConfigProvider broker={broker} {...props} />,
    });

    const newConfig = fixtures.createConfig({ baseFontSize: 42 });
    result.current.setConfig(newConfig);

    expect(broker.post).toHaveBeenCalledWith("SAVE_CONFIG_REQUEST", newConfig);
  });
});
