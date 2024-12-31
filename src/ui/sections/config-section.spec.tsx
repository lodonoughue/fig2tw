import React from "react";
import { messageFixtures } from "@common/messages.fixtures";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ConfigSection from "./config-section";
import { configFixtures } from "@common/config.fixtures";
import { configProviderFixtures } from "@ui/contexts/config";
import userEvent from "@testing-library/user-event";

const fixtures = {
  ...messageFixtures,
  ...configFixtures,
  ...configProviderFixtures,
};

describe("ConfigSection", () => {
  it("should render null when loading", () => {
    const broker = fixtures.createMessageBroker();

    const { container } = render(<ConfigSection broker={broker} />, {
      wrapper: fixtures.configProviderOf({ isLoading: true, config: null }),
    });

    expect(container.children).toHaveLength(0);
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
      value: "a, bc, def",
      config: fixtures.createConfig({ trimKeywords: ["a", "bc", "def"] }),
    },
  ])("should bind $name field with config", ({ role, name, value, config }) => {
    const broker = fixtures.createMessageBroker();

    const { getByRole } = render(<ConfigSection broker={broker} />, {
      wrapper: fixtures.configProviderOf({ config }),
    });

    const input = getByRole(role, { name }) as HTMLInputElement;
    expect(input.value).toBe(value);
  });

  it.each([
    {
      role: "textbox",
      name: "Root selector",
      typeValue: "under-test",
      expectValue: "under-test",
    },
    {
      role: "spinbutton",
      name: "Base font size (px)",
      typeValue: "42",
      expectValue: "42",
    },
    {
      role: "textbox",
      name: "Trim keywords",
      typeValue: "a, bc, def",
      expectValue: "a, bc, def",
    },
    {
      role: "textbox",
      name: "Trim keywords",
      typeValue: " ",
      expectValue: "",
    },
  ])(
    "should update field value when $name field is changed",
    async ({ role, name, typeValue, expectValue }) => {
      const user = userEvent.setup();
      const broker = fixtures.createMessageBroker();
      const config = fixtures.createConfig();

      const { getByRole } = render(<ConfigSection broker={broker} />, {
        wrapper: fixtures.configProviderOf({ config }),
      });

      const input = getByRole(role, { name }) as HTMLInputElement;

      await user.clear(input);
      await user.type(input, typeValue);
      await user.tab();

      expect(input.value).toBe(expectValue);
    },
  );

  it.each([
    { name: "All number scopes", scope: "all-numbers", unit: "px" },
    { name: "All number scopes", scope: "all-numbers", unit: "em" },
    { name: "Corner radius", scope: "radius", unit: "px" },
    { name: "Corner radius", scope: "radius", unit: "em" },
    { name: "Width and height", scope: "size", unit: "px" },
    { name: "Width and height", scope: "size", unit: "em" },
    { name: "Gap (auto layout)", scope: "gap", unit: "px" },
    { name: "Gap (auto layout)", scope: "gap", unit: "em" },
    { name: "Stroke", scope: "stroke-width", unit: "px" },
    { name: "Stroke", scope: "stroke-width", unit: "em" },
    { name: "Font size", scope: "font-size", unit: "px" },
    { name: "Font size", scope: "font-size", unit: "em" },
    { name: "Line height", scope: "line-height", unit: "px" },
    { name: "Line height", scope: "line-height", unit: "em" },
    { name: "Letter spacing", scope: "letter-spacing", unit: "px" },
    { name: "Letter spacing", scope: "letter-spacing", unit: "em" },
  ] as const)(
    "should bind $name to config ($unit) when $scope is defined",
    ({ name, scope, unit }) => {
      const broker = fixtures.createMessageBroker();

      const config = fixtures.createConfig({
        units: fixtures.createUnitsConfig({ [scope]: unit }),
      });

      const { getByRole } = render(<ConfigSection broker={broker} />, {
        wrapper: fixtures.configProviderOf({ config, scopes: [scope] }),
      });

      const group = getByRole("radiogroup", { name }) as HTMLInputElement;
      const input = group.querySelector("input[checked]") as HTMLInputElement;

      expect(input.value).toBe(unit);
    },
  );

  it.each([
    { name: "All number scopes", scope: "all-numbers" },
    { name: "Corner radius", scope: "radius" },
    { name: "Width and height", scope: "size" },
    { name: "Gap (auto layout)", scope: "gap" },
    { name: "Stroke", scope: "stroke-width" },
    { name: "Font size", scope: "font-size" },
    { name: "Line height", scope: "line-height" },
    { name: "Letter spacing", scope: "letter-spacing" },
  ])("should not render $name when $scope is not defined", ({ name }) => {
    const broker = fixtures.createMessageBroker();
    const config = fixtures.createConfig();

    const { queryByRole } = render(<ConfigSection broker={broker} />, {
      wrapper: fixtures.configProviderOf({ config }),
    });

    const group = queryByRole("radiogroup", { name }) as HTMLInputElement;

    expect(group).toBe(null);
  });
});
