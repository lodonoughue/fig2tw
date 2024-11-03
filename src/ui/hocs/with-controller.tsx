import React, {
  ChangeEventHandler,
  ComponentType,
  FocusEventHandler,
  LegacyRef,
} from "react";
import {
  FieldPath,
  FieldValues,
  useController,
  UseControllerProps,
} from "react-hook-form";

export default function withController<P extends Props>(
  Component: ComponentType<P>,
) {
  return function WithController<
    T extends FieldValues,
    N extends FieldPath<T>,
  >({
    name,
    control,
    rules,
    defaultValue,
    disabled,
    onChange,
    onBlur,
    ...props
  }: Omit<UseControllerProps<T, N> & P, "ref" | "value">) {
    const controllerProps = { name, control, rules, defaultValue, disabled };
    const { field } = useController(controllerProps);

    function _onChange(event: ChangeEvent<P>) {
      field.onChange(event);
      onChange?.(event);
    }

    function _onBlur(event: FocusEvent<P>) {
      field.onBlur();
      onBlur?.(event);
    }

    return (
      <Component
        {...(props as P)}
        ref={field.ref}
        name={field.name}
        value={field.value}
        disabled={field.disabled}
        onChange={_onChange}
        onBlur={_onBlur}
      />
    );
  };
}

interface Props {
  ref?: LegacyRef<unknown>;
  name?: string;
  value?: unknown;
  disabled?: boolean;
  onChange?: ChangeEventHandler<unknown>;
  onBlur?: FocusEventHandler<unknown>;
}

type ChangeEvent<P extends Props> = Parameters<NonNullable<P["onChange"]>>[0];
type FocusEvent<P extends Props> = Parameters<NonNullable<P["onBlur"]>>[0];
