import clsx from "clsx";
import React, { h } from "preact";
import { PropsWithClassName } from "../utils/types";

const styles = [
  "bg-primary before:bg-primary-underline",
  "bg-secondary before:bg-secondary-underline",
  "bg-tertiary before:bg-tertiary-underline",
  "bg-quaternary before:bg-quaternary-underline",
  "bg-quinary before:bg-quinary-underline",
];

export default function Bullet({ className, index }: Props) {
  return (
    <span
      aria-hidden
      className={clsx(
        className,
        styles[index % styles.length],
        "rounded-full w-3 h-3 flex flex-grow-0 flex-shrink-0",
        "justify-center items-center before:w-1 before:h-1 before:rounded-full",
      )}
    />
  );
}

interface Props extends PropsWithClassName {
  index: number;
}
