import clsx from "clsx";
import React, { h } from "preact";
import { PropsWithClassName } from "../utils/types";

const styles = ["w-2/3", "w-1/2", "w-3/4", "w-1/4", "w-1/3"];

export default function Skeleton({ index, className }: Props) {
  return (
    <span
      aria-hidden
      className={clsx(
        className,
        styles[index % styles.length],
        "rounded-sm h-2 flex bg-on-surface",
      )}
    />
  );
}

interface Props extends PropsWithClassName {
  index: number;
}
