import React from "react";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TabContainer from "./tab-container";

describe("TabContainer", () => {
  it("should render children", () => {
    const { getByTestId } = render(
      <TabContainer>
        <div data-testid="under-test" />
      </TabContainer>,
    );

    expect(getByTestId("under-test")).toBeDefined();
  });

  it("should apply the className", () => {
    const { getByTestId } = render(
      <TabContainer data-testid="under-test" className="test-class" />,
    );

    expect(getByTestId("under-test").classList).toContain("test-class");
  });

  it("should apply the tablist role", () => {
    const { getByRole } = render(<TabContainer />);

    expect(getByRole("tablist")).toBeDefined();
  });
});
