import React, { ComponentProps } from "react";
import clsx from "clsx";

export default function Section({
  className,
  direction = "col",
  ...rest
}: Props) {
  return (
    <div
      {...rest}
      className={clsx(
        className,
        "flex grow px-md gap-md",
        DIRECTION_CLASS_MAPPING[direction],
      )}
    />
  );
}

const DIRECTION_CLASS_MAPPING = {
  row: "flex-row",
  col: "flex-col",
} as const;

interface Props extends ComponentProps<"div"> {
  direction?: "row" | "col";
}
