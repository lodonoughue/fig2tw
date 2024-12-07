import React from "react";
import { render } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Input from "./input";

describe("Input", () => {
  it("should apply the className to the root element", () => {
    const { getByTestId } = render(<Input className="test-class" />, {
      wrapper: props => <div data-testid="wrapper" {...props} />,
    });

    const wrapper = getByTestId("wrapper");
    const root = wrapper.firstChild as HTMLElement;
    expect(root.classList).toContain("test-class");
  });

  it("should apply the id to the input element", () => {
    const { getByRole } = render(<Input id="under-test" />);

    const input = getByRole("textbox");
    expect(input.id).toBe("under-test");
  });

  it("sould apply the name to the input element", () => {
    const { getByRole } = render(<Input name="under-test" />);

    const input = getByRole("textbox") as HTMLInputElement;
    expect(input.name).toBe("under-test");
  });

  it("should apply the value to the input element", () => {
    const { getByRole } = render(<Input value="under-test" readOnly />);

    const input = getByRole("textbox") as HTMLInputElement;
    expect(input.value).toBe("under-test");
  });

  it("should call onChange when the input value changes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    const { getByRole } = render(<Input onChange={onChange} />);

    const input = getByRole("textbox") as HTMLInputElement;
    await user.type(input, "under-test");

    expect(onChange).toHaveBeenCalled();
  });
});
