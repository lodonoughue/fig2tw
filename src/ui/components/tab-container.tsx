import React, { PropsWithChildren } from "react";
import clsx from "clsx";
import { PropsWithClassName } from "@ui/types";

export default function TabContainer({ className, children }: Props) {
  return (
    <div
      className={clsx(className, "flex flex-row p-xs rounded-sm bg-container")}>
      {children}
    </div>
  );
}

interface Props extends PropsWithClassName, PropsWithChildren {}
