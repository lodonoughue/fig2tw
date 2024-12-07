import React from "react";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import Link from "./link";

describe("Link", () => {
  it("should render children", () => {
    const { getByTestId } = render(
      <Link>
        <div data-testid="under-test" />
      </Link>,
    );

    expect(getByTestId("under-test")).toBeDefined();
  });

  it("should apply the className", () => {
    const { getByRole } = render(
      <Link href="#" className="test-class">
        under-test
      </Link>,
    );

    const link = getByRole("link", { name: "under-test" });
    expect(link.classList).toContain("test-class");
  });

  it("should apply href to the link", () => {
    const { getByRole } = render(
      <Link href="https://github.com/lodonoughue/fig2tw">under-test</Link>,
    );

    const link = getByRole("link", { name: "under-test" }) as HTMLAnchorElement;
    expect(link.href).toBe("https://github.com/lodonoughue/fig2tw");
  });
});
