import React from "react";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Section from "./section";

describe("Section", () => {
  it("should render children", () => {
    const { getByTestId } = render(
      <Section>
        <div data-testid="under-test" />
      </Section>,
    );

    expect(getByTestId("under-test")).toBeDefined();
  });

  it("should apply the className", () => {
    const { getByTestId } = render(
      <Section data-testid="under-test" className="test-class" />,
    );

    expect(getByTestId("under-test").classList).toContain("test-class");
  });
});
