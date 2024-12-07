import React from "react";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Description from "./description";

describe("Description", () => {
  it("should render children", () => {
    const { getByText } = render(<Description>under-test</Description>);
    expect(getByText("under-test")).toBeDefined();
  });

  it("should apply the className", () => {
    const { getByTestId } = render(
      <Description data-testid="under-test" className="test-class" />,
    );

    expect(getByTestId("under-test").classList).toContain("test-class");
  });
});
