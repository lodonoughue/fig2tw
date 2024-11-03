import React, { PropsWithChildren } from "react";
import { PropsWithClassName } from "@ui/types";
import clsx from "clsx";

export default function Column({ className, children }: Props) {
  return (
    <div className={clsx(className, "flex flex-col grow basis-0 gap-md")}>
      {children}
    </div>
  );
}

interface Props extends PropsWithClassName, PropsWithChildren {}
