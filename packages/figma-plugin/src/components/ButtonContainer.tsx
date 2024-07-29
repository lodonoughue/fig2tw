import React, { h } from "preact";
import { clsx } from "clsx";
import { PropsWithChildren } from "preact/compat";
import { PropsWithClassName } from "../utils/types";

export default function ButtonContainer({ className, children }: Props) {
  return (
    <div className={clsx(className, "flex flex-row gap-sm justify-center")}>
      {children}
    </div>
  );
}

interface Props extends PropsWithChildren, PropsWithClassName {}
