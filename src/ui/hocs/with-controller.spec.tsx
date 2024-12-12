import React, { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";
import withController from "./with-controller";
import Input from "@ui/components/input";
import { useForm } from "react-hook-form";
import { fireEvent, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("withController", () => {
  const ControlledInput = withController(Input);

  function Form({ defaultValue, onBlur, onChange }: FormProps) {
    const { control } = useForm({
      defaultValues: { input: defaultValue },
    });

    return (
      <ControlledInput
        name="input"
        control={control}
        onBlur={onBlur}
        onChange={onChange}
      />
    );
  }

  it("should control input value", () => {
    const { getByRole } = render(<Form defaultValue="under-test" />);

    const input = getByRole("textbox") as HTMLInputElement;

    expect(input.value).toBe("under-test");
  });

  it("should handle onChange event", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    const { getByRole } = render(
      <Form defaultValue="under-test" onChange={onChange} />,
    );

    const input = getByRole("textbox") as HTMLInputElement;
    await user.type(input, "changed-value");

    expect(onChange).toHaveBeenCalled();
  });

  it("should handle onBlur event", async () => {
    const onBlur = vi.fn();

    const { getByRole } = render(
      <Form defaultValue="under-test" onBlur={onBlur} />,
    );

    const input = getByRole("textbox") as HTMLInputElement;
    fireEvent.blur(input);

    expect(onBlur).toHaveBeenCalled();
  });
});

interface FormProps {
  defaultValue: string;
  onChange?: ComponentProps<"input">["onChange"];
  onBlur?: ComponentProps<"input">["onBlur"];
}
