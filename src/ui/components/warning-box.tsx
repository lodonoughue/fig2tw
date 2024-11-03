import React, { PropsWithChildren } from "react";
import { PropsWithClassName } from "@ui/types";
import clsx from "clsx";

export default function WarningBox({ className, children }: Props) {
  return (
    <div className={clsx(className, "bg-container p-xs rounded-sm")}>
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

interface Props extends PropsWithClassName, PropsWithChildren {}
