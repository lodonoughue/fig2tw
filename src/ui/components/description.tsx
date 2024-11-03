import { PropsWithClassName } from "@ui/types";
import clsx from "clsx";
import React, { PropsWithChildren } from "react";

export default function Description({ className, children }: Props) {
  return (
    <p className={clsx(className, "font-body-small text-body-small")}>
      {children}
    </p>
  );
}

interface Props extends PropsWithChildren, PropsWithClassName {}
