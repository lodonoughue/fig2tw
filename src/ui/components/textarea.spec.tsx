import React from "react";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import TextArea from "./textarea";
import userEvent from "@testing-library/user-event";

describe("TextArea", () => {
  it("should apply the className to the root element", () => {
    const { getByTestId } = render(<TextArea className="test-class" />, {
      wrapper: props => <div data-testid="wrapper" {...props} />,
    });

    const wrapper = getByTestId("wrapper");
    const root = wrapper.firstChild as HTMLElement;
    expect(root.classList).toContain("test-class");
  });

  it("should apply the id to the textarea element", () => {
    const { getByRole } = render(<TextArea id="under-test" />);

    const textarea = getByRole("textbox");
    expect(textarea.id).toBe("under-test");
  });

  it("sould apply the name to the textarea element", () => {
    const { getByRole } = render(<TextArea name="under-test" />);

    const textarea = getByRole("textbox") as HTMLTextAreaElement;
    expect(textarea.name).toBe("under-test");
  });

  it("should apply the value to the textarea element", () => {
    const { getByRole } = render(<TextArea value="under-test" readOnly />);

    const textarea = getByRole("textbox") as HTMLTextAreaElement;
    expect(textarea.value).toBe("under-test");
  });

  it("should call onChange when the textarea value changes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    const { getByRole } = render(<TextArea onChange={onChange} />);

    const textarea = getByRole("textbox") as HTMLTextAreaElement;
    await user.type(textarea, "under-test");

    expect(onChange).toHaveBeenCalled();
  });
});
