import React from "react";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import RadioGroup from "./radio-group";
import userEvent from "@testing-library/user-event";

describe("RadioGroup", () => {
  it("should apply the className to the root element", () => {
    const { getByTestId } = render(
      <RadioGroup className="test-class" choices={[]} />,
      { wrapper: props => <div data-testid="wrapper" {...props} /> },
    );

    const wrapper = getByTestId("wrapper");
    const root = wrapper.firstChild as HTMLElement;
    expect(root.classList).toContain("test-class");
  });

  it("should apply the radiogroup role", () => {
    const { getByRole } = render(<RadioGroup choices={[]} />);

    expect(getByRole("radiogroup")).toBeDefined();
  });

  it.each([
    { choices: ["foo"] },
    { choices: ["foo", "bar"] },
    { choices: ["foo", "bar", "baz"] },
  ])(
    "should render a radio for each choice (length=$choices.length)",
    ({ choices }) => {
      const { getAllByRole } = render(
        <RadioGroup choices={choices} name="under-test" />,
      );

      const radios = getAllByRole("radio");
      expect(radios).toHaveLength(choices.length);
    },
  );

  it("should check the radio matching the value", () => {
    const { getByRole } = render(
      <RadioGroup choices={["foo", "bar", "baz"]} value="bar" />,
    );

    const radio = getByRole("radio", { name: "bar", checked: true });
    expect(radio).toBeDefined();
  });

  it("should not check the radios that don't match the value", () => {
    const { getAllByRole } = render(
      <RadioGroup choices={["foo", "bar", "baz"]} value="baz" />,
    );

    const radios = getAllByRole("radio", {
      checked: false,
    }) as HTMLInputElement[];
    expect(radios.map(it => it.value)).toEqual(["foo", "bar"]);
  });

  it("should call the onChange handler when a radio is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    const { getByRole } = render(
      <RadioGroup choices={["foo", "bar", "baz"]} onChange={onChange} />,
    );

    const radio = getByRole("radio", { name: "bar" });
    await user.click(radio);
    expect(onChange).toHaveBeenCalled();
  });
});
