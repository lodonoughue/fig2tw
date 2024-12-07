import React from "react";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Column from "./column";

describe("Column", () => {
  it("should render children", () => {
    const { getByTestId } = render(
      <Column>
        <div data-testid="under-test" />
      </Column>,
    );

    expect(getByTestId("under-test")).toBeDefined();
  });

  it("should apply the className", () => {
    const { getByTestId } = render(
      <Column data-testid="under-test" className="test-class" />,
    );

    expect(getByTestId("under-test").classList).toContain("test-class");
  });
});
