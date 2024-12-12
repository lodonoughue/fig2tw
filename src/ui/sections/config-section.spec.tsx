import React from "react";
import { messageFixtures } from "@common/messages.fixtures";
import { render } from "@testing-library/react";
import { useResult } from "@ui/hooks/use-result";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ConfigSection from "./config-section";
import { configFixtures } from "@common/config.fixtures";
import { ConfigProvider } from "@ui/contexts/config";

vi.mock("@ui/hooks/use-result", async importOriginal => {
  const original =
    await importOriginal<typeof import("@ui/hooks/use-result")>();
  vi.spyOn(original, "useResult");
  return original;
});

const fixtures = { ...messageFixtures, ...configFixtures };

describe("ConfigSection", () => {
  beforeEach(() => {
    vi.mocked(useResult).mockClear().mockReturnValue({
      result: [],
      isLoading: false,
      reload: vi.fn(),
    });
  });

  it.each([
    {
      role: "textbox",
      name: "Root selector",
      value: "under-test",
      config: fixtures.createConfig({ rootSelector: "under-test" }),
    },
    {
      role: "spinbutton",
      name: "Base font size (px)",
      value: "42",
      config: fixtures.createConfig({ baseFontSize: 42 }),
    },
    {
      role: "textbox",
      name: "Trim keywords",
      value: "def, bc, a",
      config: fixtures.createConfig({ trimKeywords: ["a", "bc", "def"] }),
    },
  ])("should bind $name field with config", ({ role, name, value, config }) => {
    const broker = fixtures.createMessageBroker();

    const { getByRole } = render(<ConfigSection broker={broker} />, {
      wrapper: props => <ConfigProvider {...props} defaultConfig={config} />,
    });

    const input = getByRole(role, { name }) as HTMLInputElement;
    expect(input.value).toBe(value);
  });
});
