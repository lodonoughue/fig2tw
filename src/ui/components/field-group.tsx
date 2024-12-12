import React, {
  ComponentPropsWithoutRef,
  ForwardedRef,
  forwardRef,
  ReactNode,
} from "react";
import clsx from "clsx";
import Label from "./label";
import WarningBox from "./warning-box";
import { isBlank } from "@common/formatters";

function FieldGroupWithRef(
  { className, children, label, description, emptyWarning, ...rest }: Props,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div
      {...rest}
      ref={ref}
      className={clsx(className, "flex flex-col gap-sm")}>
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

interface Props extends ComponentPropsWithoutRef<"div"> {
  label: string;
  description?: string;
  emptyWarning?: string;
}

const FieldGroup = forwardRef(FieldGroupWithRef);
export default FieldGroup;
