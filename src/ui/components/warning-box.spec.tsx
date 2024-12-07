import { render } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";
import WarningBox from "./warning-box";

describe("WarningBox", () => {
  it("should render children", () => {
    const { getByText } = render(<WarningBox>under-test</WarningBox>);
    expect(getByText("under-test")).toBeDefined();
  });

  it("should apply the className", () => {
    const { getByTestId } = render(
      <WarningBox data-testid="under-test" className="test-class" />,
    );

    expect(getByTestId("under-test").classList).toContain("test-class");
  });
});
