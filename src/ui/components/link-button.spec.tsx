import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import LinkButton from "./link-button";

describe("LinkButton", () => {
  it("should render children", () => {
    const { getByTestId } = render(
      <LinkButton>
        <div data-testid="under-test" />
      </LinkButton>,
    );

    expect(getByTestId("under-test")).toBeDefined();
  });

  it("should apply the className", () => {
    const { getByRole } = render(
      <LinkButton className="test-class">under-test</LinkButton>,
    );

    const button = getByRole("button", { name: "under-test" });
    expect(button.classList).toContain("test-class");
  });

  it("should handle click", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    const { getByRole } = render(
      <LinkButton onClick={onClick}>under-test</LinkButton>,
    );

    const button = getByRole("button", { name: "under-test" });
    await user.click(button);

    expect(onClick).toHaveBeenCalled();
  });
});
