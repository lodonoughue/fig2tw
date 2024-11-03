import React, { PropsWithChildren } from "react";
import clsx from "clsx";
import { PropsWithClassName } from "@ui/types";

export default function ButtonContainer({ className, children }: Props) {
  return (
    <div className={clsx(className, "flex flex-row items-center")}>
      {children}
    </div>
  );
}

interface Props extends PropsWithClassName, PropsWithChildren {}
