import React, { ComponentType, createContext, useContext } from "react";
import { PropsWithClassName } from "@ui/types";
import { PropsWithChildren } from "react";
import clsx from "clsx";
import Label from "./label";
import { assert } from "@common/assert";

export default function FieldGroup({
  className,
  children,
  label,
  description,
}: Props) {
  return (
    <div className={clsx(className, "flex flex-col gap-sm")}>
      <div className="flex flex-col gap-xs">
        <Label>{label}</Label>
        {description != null ? (
          <span className="font-body-small text-body-small">{description}</span>
        ) : null}
      </div>
      {children}
    </div>
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
): ComponentType<P> {
  return function WithFieldContext(props: P) {
    const context = useFieldContext();
    return <Component {...context} {...props} />;
  };
}

interface Props extends PropsWithClassName, PropsWithChildren {
  label: string;
  description?: string;
}

interface FieldContext {
  id: string;
}
