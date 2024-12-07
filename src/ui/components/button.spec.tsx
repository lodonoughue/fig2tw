import React from "react";
import { describe, expect, it, vi } from "vitest";
import Button from "./button";
import { render } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

describe("Button", () => {
  it("should render children", () => {
    const { getAllByTestId } = render(
      <Button>
        <div data-testid="under-test" />
      </Button>,
    );

    const elements = getAllByTestId("under-test");
    expect(elements.length).toBeGreaterThan(0);
  });

  it("should apply the className", () => {
    const { getByRole } = render(
      <Button className="test-class">under-test</Button>,
    );

    const button = getByRole("button", { name: "under-test" });
    expect(button.classList).toContain("test-class");
  });

  it("should handle click", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    const { getByRole } = render(<Button onClick={onClick}>under-test</Button>);

    const button = getByRole("button", { name: "under-test" });
    await user.click(button);

    expect(onClick).toHaveBeenCalled();
  });
});
