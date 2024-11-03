import React, {
  ComponentType,
  createContext,
  ReactNode,
  useContext,
} from "react";
import { PropsWithClassName } from "@ui/types";
import { PropsWithChildren } from "react";
import clsx from "clsx";
import Label from "./label";
import { assert } from "@common/assert";
import WarningBox from "./warning-box";
import { isBlank } from "@common/formatters";

export default function FieldGroup({
  className,
  children,
  label,
  description,
  emptyWarning,
}: Props) {
  return (
    <div className={clsx(className, "flex flex-col gap-sm")}>
      <div className="flex flex-col gap-xs">
        <Label>{label}</Label>
        {description != null ? (
          <span className="font-body-small text-body-small">{description}</span>
        ) : null}
      </div>
      {shouldDisplayWarning(children, emptyWarning) ? (
        <WarningBox>{emptyWarning}</WarningBox>
      ) : (
        children
      )}
    </div>
  );
}

function shouldDisplayWarning(
  children: ReactNode | undefined,
  emptyWarning: string | undefined,
) {
  return !hasChildren(children) && !isBlank(emptyWarning);
}

function hasChildren(children: ReactNode | undefined) {
  if (!children) {
    return false;
  }

  if (Array.isArray(children)) {
    return children.some(hasChildren);
  }

  return true;
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
  emptyWarning?: string;
}

interface FieldContext {
  id: string;
}
