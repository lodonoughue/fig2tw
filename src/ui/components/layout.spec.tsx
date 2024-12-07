import React from "react";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import Layout from "./layout";

describe("Layout", () => {
  it("should render children", () => {
    const { getByTestId } = render(
      <Layout>
        <div data-testid="under-test" />
      </Layout>,
    );

    expect(getByTestId("under-test")).toBeDefined();
  });

  it("should apply the className", () => {
    const { getByTestId } = render(
      <Layout data-testid="under-test" className="test-class" />,
    );

    expect(getByTestId("under-test").classList).toContain("test-class");
  });
});
