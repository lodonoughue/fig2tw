import React from "react";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Tab from "./tab";

describe("Tab", () => {
  it("should render children", () => {
    const { getByTestId } = render(
      <Tab>
        <div data-testid="under-test" />
      </Tab>,
    );

    expect(getByTestId("under-test")).toBeDefined();
  });

  it("should apply the className", () => {
    const { getByTestId } = render(
      <Tab data-testid="under-test" className="test-class" />,
    );

    expect(getByTestId("under-test").classList).toContain("test-class");
  });

  it.each([{ isSelected: true }, { isSelected: false }])(
    "should apply the tab role and aria-selected properties (selected=$isSelected)",
    ({ isSelected }) => {
      const { getByRole } = render(<Tab isSelected={isSelected} />);

      const tab = getByRole("tab", { selected: isSelected });
      expect(tab).toBeDefined();
    },
  );
});
