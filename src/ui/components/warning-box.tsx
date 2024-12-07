import React, { ComponentProps } from "react";
import clsx from "clsx";

export default function WarningBox({
  className,
  children,
  ...rest
}: ComponentProps<"div">) {
  return (
    <div {...rest} className={clsx(className, "bg-container p-xs rounded-sm")}>
      <p
        className={clsx(
          "bg-tertiary-container text-on-tertiary-container p-sm",
          "rounded-xs font-body-small text-body-small",
        )}>
        {children}
      </p>
    </div>
  );
}
