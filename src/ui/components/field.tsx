import React, {
  ComponentProps,
  ComponentType,
  createContext,
  useContext,
} from "react";
import { PropsWithClassName } from "@ui/types";
import { PropsWithChildren, useId } from "react";
import clsx from "clsx";
import Label from "./label";
import { assert } from "@common/assert";

export default function Field({
  className,
  children,
  label,
  labelSize,
  description,
}: Props) {
  const id = useId();
  return (
    <label htmlFor={id} className={clsx(className, "flex flex-col gap-xs")}>
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

interface Props extends PropsWithClassName, PropsWithChildren {
  label: string;
  labelSize?: LabelProps["size"];
  description?: string;
}

interface FieldContext {
  id: string;
}

type LabelProps = ComponentProps<typeof Label>;
