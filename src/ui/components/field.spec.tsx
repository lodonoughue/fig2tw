import React from "react";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Field, { withFieldContext } from "./field";

describe("Field", () => {
  it("should apply the className", () => {
    const { getByTestId } = render(
      <Field data-testid="under-test" className="test-class" label="Foo bar" />,
    );
    expect(getByTestId("under-test").classList).toContain("test-class");
  });

  it("should render children", () => {
    const { getByText } = render(<Field label="Foo bar">under-test</Field>);
    expect(getByText("under-test")).toBeDefined();
  });

  it("should render label", () => {
    const { getByText } = render(<Field label="under-test" />);
    expect(getByText("under-test")).toBeDefined();
  });

  it("should render description", () => {
    const { getByText } = render(
      <Field label="Foo bar" description="under-test" />,
    );
    expect(getByText("under-test")).toBeDefined();
  });
});

describe("withFieldContext", () => {
  it("should throw if used outside of Field", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const Component = vi.fn().mockReturnValue(null);
    const WithFieldContext = withFieldContext(Component);

    expect(() => render(<WithFieldContext />)).toThrowError(
      "withFieldContext must be used within a <Field />.",
    );
  });

  it("should pass field context to component", () => {
    const Component = vi.fn().mockReturnValue(null);
    const WithFieldContext = withFieldContext(Component);

    render(
      <Field label="Foo bar">
        <WithFieldContext />
      </Field>,
    );

    expect(Component).toHaveBeenCalledWith(
      { id: expect.any(String), label: "Foo bar" },
      expect.anything(),
    );
  });
});
