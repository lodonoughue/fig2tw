import { render } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";
import Navigation from "./navigation";

describe("Navigation", () => {
  it("should render children", () => {
    const { getByTestId } = render(
      <Navigation>
        <div data-testid="under-test" />
      </Navigation>,
    );

    expect(getByTestId("under-test")).toBeDefined();
  });

  it("should apply the className", () => {
    const { getByTestId } = render(
      <Navigation data-testid="under-test" className="test-class" />,
    );

    expect(getByTestId("under-test").classList).toContain("test-class");
  });

  it("should have navigation role", () => {
    const { getByRole } = render(<Navigation />);

    expect(getByRole("navigation")).toBeDefined();
  });
});
