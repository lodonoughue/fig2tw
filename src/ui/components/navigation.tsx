import React from "react";
import { PropsWithClassName } from "@ui/types";
import clsx from "clsx";
import { PropsWithChildren } from "react";

export default function Navigation({ children, className }: Props) {
  return (
    <nav className={clsx(className, "flex flex-row px-md gap-md")}>
      {children}
    </nav>
  );
}

interface Props extends PropsWithClassName, PropsWithChildren {}
