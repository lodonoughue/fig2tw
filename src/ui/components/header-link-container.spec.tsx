import React from "react";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HeaderLinkContainer from "./header-link-container";

describe("HeaderLinkContainer", () => {
  it("should render children", () => {
    const { getByTestId } = render(
      <HeaderLinkContainer>
        <div data-testid="under-test" />
      </HeaderLinkContainer>,
    );

    expect(getByTestId("under-test")).toBeDefined();
  });

  it("should apply the className", () => {
    const { getByTestId } = render(
      <HeaderLinkContainer data-testid="under-test" className="test-class" />,
    );

    expect(getByTestId("under-test").classList).toContain("test-class");
  });
});
