import React, { PropsWithChildren } from "react";
import { clsx } from "clsx";
import { PropsWithClassName } from "@ui/types";

export default function Header({ className, children }: Props) {
  return (
    <header className={clsx(className, "px-md flex gap-sm")}>{children}</header>
  );
}

interface Props extends PropsWithChildren, PropsWithClassName {}
