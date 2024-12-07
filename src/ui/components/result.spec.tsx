import React from "react";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Result from "./result";
import userEvent from "@testing-library/user-event";

describe("Result", () => {
  it("should render children", () => {
    const { getByText } = render(<Result>under-test</Result>);

    expect(getByText("under-test")).toBeDefined();
  });

  it("should apply the className", () => {
    const { getByTestId } = render(
      <Result data-testid="under-test" className="test-class" />,
    );

    expect(getByTestId("under-test").classList).toContain("test-class");
  });

  it("should should handle onReload", async () => {
    const user = userEvent.setup();
    const onReload = vi.fn();

    const { getByRole } = render(<Result onReload={onReload} />);

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

      const { getByRole } = render(<Result onCopy={onCopy}>{result}</Result>);

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
      );

      const button = getByRole("button", { name: "Download" });
      await user.click(button);

      expect(onDownload).toHaveBeenCalledWith(value);
    },
  );
});
