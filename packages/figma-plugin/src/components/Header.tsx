import React, { h } from "preact";
import { clsx } from "clsx";
import { PropsWithChildren } from "preact/compat";
import { PropsWithClassName } from "../utils/types";

export default function Header({ className, children }: Props) {
  return (
    <header className={clsx(className, "p-md flex gap-sm items-center")}>
      {children}
    </header>
  );
}

interface Props extends PropsWithChildren, PropsWithClassName {}
