import React, { PropsWithChildren } from "react";
import { PropsWithClassName } from "@ui/types";
import clsx from "clsx";

export default function Section({
  className,
  children,
  direction = "col",
}: Props) {
  return (
    <div
      className={clsx(
        className,
        "flex grow px-md gap-md",
        DIRECTION_CLASS_MAPPING[direction],
      )}>
      {children}
    </div>
  );
}

const DIRECTION_CLASS_MAPPING = {
  row: "flex-row",
  col: "flex-col",
} as const;

interface Props extends PropsWithChildren, PropsWithClassName {
  direction?: "row" | "col";
}
