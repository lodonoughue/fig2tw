import React, { h } from "preact";
import { clsx } from "clsx";
import { PropsWithChildren } from "preact/compat";
import { PropsWithClassName } from "../utils/types";

export default function LinkContainer({ className, children }: Props) {
  return <div className={clsx(className, "flex gap-sm")}>{children}</div>;
}

interface Props extends PropsWithChildren, PropsWithClassName {}
