import React, { PropsWithChildren } from "react";
import clsx from "clsx";
import { PropsWithClassName } from "@ui/types";

export default function Layout({ className, children }: Props) {
  return (
    <div
      className={clsx(
        className,
        "bg-surface text-on-surface h-full flex flex-col gap-md py-md overflow-auto",
      )}>
      {children}
    </div>
  );
}

interface Props extends PropsWithChildren, PropsWithClassName {}
