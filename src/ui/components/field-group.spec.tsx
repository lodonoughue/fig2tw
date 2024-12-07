import { render } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";
import FieldGroup from "./field-group";

describe("FieldGroup", () => {
  it("should apply the className", () => {
    const { getByTestId } = render(
      <FieldGroup
        data-testid="under-test"
        className="test-class"
        label="Foo bar"
      />,
    );

    expect(getByTestId("under-test").classList).toContain("test-class");
  });

  it("should render children", () => {
    const { getByTestId } = render(
      <FieldGroup className="test-class" label="Foo bar">
        <div data-testid="under-test" />
      </FieldGroup>,
    );

    expect(getByTestId("under-test")).toBeDefined();
  });

  it("should render label", () => {
    const { getByText } = render(<FieldGroup label="under-test" />);
    expect(getByText("under-test")).toBeDefined();
  });

  it("should render description", () => {
    const { getByText } = render(
      <FieldGroup label="Foo bar" description="under-test" />,
    );

    expect(getByText("under-test")).toBeDefined();
  });

  it("should render warnings when there is no children", () => {
    const { getByText } = render(
      <FieldGroup label="Foo bar" emptyWarning="under-test" />,
    );

    expect(getByText("under-test")).toBeDefined();
  });

  it.each([
    { children: <div /> },
    { children: [<div key="1" />, <div key="2" />] },
  ])(
    "should not render warnings when there are children $children",
    ({ children }) => {
      const { queryByText } = render(
        <FieldGroup label="Foo bar" emptyWarning="under-test">
          {children}
        </FieldGroup>,
      );
      expect(queryByText("under-test")).toBeNull();
    },
  );
});
