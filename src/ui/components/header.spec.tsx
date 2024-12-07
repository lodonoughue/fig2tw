import React from "react";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Header from "./header";

describe("Header", () => {
  it("should render children", () => {
    const { getByTestId } = render(
      <Header>
        <div data-testid="under-test" />
      </Header>,
    );

    expect(getByTestId("under-test")).toBeDefined();
  });

  it("should apply the className", () => {
    const { getByTestId } = render(
      <Header data-testid="under-test" className="test-class" />,
    );

    expect(getByTestId("under-test").classList).toContain("test-class");
  });
});
