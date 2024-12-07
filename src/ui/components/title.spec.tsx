import { render } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";
import Title from "./title";

describe("Title", () => {
  it("should render children", () => {
    const { getByTestId } = render(
      <Title>
        <div data-testid="under-test" />
      </Title>,
    );

    expect(getByTestId("under-test")).toBeDefined();
  });

  it("should apply the className", () => {
    const { getByTestId } = render(
      <Title data-testid="under-test" className="test-class" />,
    );

    expect(getByTestId("under-test").classList).toContain("test-class");
  });
});
