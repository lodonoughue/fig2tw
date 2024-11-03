import React, { PropsWithChildren } from "react";
import { clsx } from "clsx";
import { PropsWithClassName } from "@ui/types";

export default function HeaderLinkContainer({ className, children }: Props) {
  return (
    <div className={clsx(className, "flex flex-col gap-sm")}>{children}</div>
  );
}

interface Props extends PropsWithChildren, PropsWithClassName {}
