import React from "react";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Result from "./result";
import userEvent from "@testing-library/user-event";
import { copyToClipboard } from "@ui/utils/clipboard";
import { analyticsProviderFixtures } from "@ui/contexts/analytics";

vi.mock("@ui/utils/clipboard", async importOriginal => {
  const original = await importOriginal<typeof import("@ui/utils/clipboard")>();
  vi.spyOn(original, "copyToClipboard");
  return original;
});

const fixtures = {
  ...analyticsProviderFixtures,
};

describe("Result", () => {
  it("should render children", () => {
    const { getByText } = render(<Result>under-test</Result>, {
      wrapper: fixtures.analyticsProviderOf({}),
    });

    expect(getByText("under-test")).toBeDefined();
  });

  it("should apply the className", () => {
    const { getByTestId } = render(
      <Result data-testid="under-test" className="test-class" />,
      { wrapper: fixtures.analyticsProviderOf({}) },
    );

    expect(getByTestId("under-test").classList).toContain("test-class");
  });

  it.each([
    { prop: "onReload", name: "Reload" },
    { prop: "onCopy", name: "Copy" },
    { prop: "onDownload", name: "Download" },
  ])("should do not throw when $prop is not provided", async ({ name }) => {
    const user = userEvent.setup();
    vi.mocked(copyToClipboard).mockImplementation(() => Promise.resolve());

    const { getByRole } = render(<Result />, {
      wrapper: fixtures.analyticsProviderOf({}),
    });

    const button = getByRole("button", { name });
    await user.click(button);
  });

  it("should should handle onReload", async () => {
    const user = userEvent.setup();
    const onReload = vi.fn();

    const { getByRole } = render(<Result onReload={onReload} />, {
      wrapper: fixtures.analyticsProviderOf({}),
    });

    const button = getByRole("button", { name: "Reload" });
    await user.click(button);

    expect(onReload).toHaveBeenCalled();
  });

  it.each([
    { result: null, value: "" },
    { result: "", value: "" },
    { result: "foo bar baz", value: "foo bar baz" },
    { result: ["foo", "bar", "baz"], value: "foo\nbar\nbaz" },
  ])(
    "should should handle onCopy (result=$result)",
    async ({ result, value }) => {
      const user = userEvent.setup();
      const onCopy = vi.fn();

      const { getByRole } = render(<Result onCopy={onCopy}>{result}</Result>, {
        wrapper: fixtures.analyticsProviderOf({}),
      });

      const button = getByRole("button", { name: "Copy" });
      await user.click(button);

      expect(onCopy).toHaveBeenCalledWith(value);
    },
  );

  it.each([
    { result: null, value: "" },
    { result: "", value: "" },
    { result: "foo bar baz", value: "foo bar baz" },
    { result: ["foo", "bar", "baz"], value: "foo\nbar\nbaz" },
  ])(
    "should should handle onDownload (result=$result)",
    async ({ result, value }) => {
      const user = userEvent.setup();
      const onDownload = vi.fn();

      const { getByRole } = render(
        <Result onDownload={onDownload}>{result}</Result>,
        { wrapper: fixtures.analyticsProviderOf({}) },
      );

      const button = getByRole("button", { name: "Download" });
      await user.click(button);

      expect(onDownload).toHaveBeenCalledWith(value);
    },
  );
});
