import React from "react";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import ButtonContainer from "./button-container";

describe("ButtonContainer", () => {
  it("should render children", () => {
    const { getByTestId } = render(
      <ButtonContainer>
        <div data-testid="under-test" />
      </ButtonContainer>,
    );

    expect(getByTestId("under-test")).toBeDefined();
  });

  it("should apply the className", () => {
    const { getByTestId } = render(
      <ButtonContainer data-testid="under-test" className="test-class" />,
    );

    expect(getByTestId("under-test").classList).toContain("test-class");
  });
});
