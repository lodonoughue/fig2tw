import { render } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";
import Fig2Tw from "./fig2tw";

describe("Fig2Tw", () => {
  it("should apply the className", () => {
    const { getByTestId } = render(
      <Fig2Tw data-testid="under-test" className="test-class" />,
    );

    expect(getByTestId("under-test").classList).toContain("test-class");
  });
});
