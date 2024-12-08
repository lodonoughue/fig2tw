import React, {
  ComponentProps,
  ComponentPropsWithoutRef,
  ComponentType,
  createContext,
  ForwardedRef,
  forwardRef,
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
      className={clsx(className, "flex flex-col gap-xs")}>
      <Label size={labelSize}>{label}</Label>
      {description != null ? (
        <span className="font-body-small text-body-small">{description}</span>
      ) : null}
      <Context.Provider value={{ id }}>{children}</Context.Provider>
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
  return function WithFieldContext(props: Omit<P, keyof FieldContext>) {
    const context = useFieldContext();
    return <Component {...(props as P)} {...context} />;
  };
}

interface Props extends Omit<ComponentPropsWithoutRef<"label">, "htmlFor"> {
  label: string;
  labelSize?: ComponentProps<typeof Label>["size"];
  description?: string;
}

interface FieldContext {
  id: string | null | undefined;
}

const Field = forwardRef(FieldWithRef);
export default Field;
