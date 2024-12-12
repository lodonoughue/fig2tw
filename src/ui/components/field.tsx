import React, {
  ComponentProps,
  ComponentPropsWithoutRef,
  ComponentType,
  createContext,
  ForwardedRef,
  forwardRef,
  PropsWithoutRef,
  useContext,
} from "react";
import { useId } from "react";
import clsx from "clsx";
import Label from "./label";
import { assert } from "@common/assert";

function FieldWithRef(
  { className, children, label, labelSize, description, ...rest }: Props,
  ref: ForwardedRef<HTMLLabelElement>,
) {
  const id = useId();
  return (
    <label
      {...rest}
      ref={ref}
      htmlFor={id}
      className={clsx(className, "flex flex-col gap-xs")}
      aria-label={label}
      aria-description={description}>
      <Label size={labelSize}>{label}</Label>
      {description != null ? (
        <span className="font-body-small text-body-small">{description}</span>
      ) : null}
      <Context.Provider value={{ id, label }}>{children}</Context.Provider>
    </label>
  );
}

const Context = createContext<FieldContext | null>(null);

function useFieldContext() {
  const context = useContext(Context);
  assert(context != null, "withFieldContext must be used within a <Field />.");
  return context;
}

export function withFieldContext<P extends object>(
  Component: ComponentType<FieldContext & P>,
) {
  function WithFieldContextWithRef(
    props: PropsWithoutRef<Omit<P, keyof FieldContext>>,
    ref: ForwardedRef<Omit<P, keyof FieldContext>>,
  ) {
    const context = useFieldContext();
    return <Component {...(props as unknown as P)} {...context} ref={ref} />;
  }

  return forwardRef(WithFieldContextWithRef);
}

interface Props extends Omit<ComponentPropsWithoutRef<"label">, "htmlFor"> {
  label: string;
  labelSize?: ComponentProps<typeof Label>["size"];
  description?: string;
}

interface FieldContext {
  id: string | null | undefined;
  label: string | null | undefined;
}

const Field = forwardRef(FieldWithRef);
export default Field;
