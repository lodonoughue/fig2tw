import { render } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";
import Label from "./label";

describe("Label", () => {
  it("should render children", () => {
    const { getByText } = render(<Label>under-test</Label>);
    expect(getByText("under-test")).toBeDefined();
  });

  it("should apply the className", () => {
    const { getByTestId } = render(
      <Label data-testid="under-test" className="test-class" />,
    );

    expect(getByTestId("under-test").classList).toContain("test-class");
  });
});
