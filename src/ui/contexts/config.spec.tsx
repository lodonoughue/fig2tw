import React from "react";
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ConfigProvider, useConfig } from "./config";
import { Config } from "@common/config";

describe("useConfig", () => {
  it("should throw if used outside of ConfigProvider", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => renderHook(() => useConfig())).toThrow(
      "useConfig must be used within a ConfigProvider",
    );
  });

  it("should return state from ConfigProvider", () => {
    const { result } = renderHook(() => useConfig(), {
      wrapper: props => <ConfigProvider {...props} />,
    });

    expect(result.current.config).toBeDefined();
    expect(result.current.setConfig).toBeDefined();
  });

  it("should update state when setConfig is called", () => {
    const { result } = renderHook(() => useConfig(), {
      wrapper: props => <ConfigProvider {...props} />,
    });

    const newConfig = { trimKeywords: ["foo", "bar"] } as Config;
    act(() => result.current.setConfig(newConfig));

    expect(result.current.config).toEqual(newConfig);
  });

  it("should sort trimKeywords by length descending", () => {
    const { result } = renderHook(() => useConfig(), {
      wrapper: props => <ConfigProvider {...props} />,
    });

    const newConfig = { trimKeywords: ["a", "bc", "def"] } as Config;
    act(() => result.current.setConfig(newConfig));

    expect(result.current.config.trimKeywords).toEqual(["def", "bc", "a"]);
  });
});
