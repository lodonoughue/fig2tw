import React, { h } from "preact";
import clsx from "clsx";
import { PropsWithClassName } from "../utils/types";

const styles = {
  primary:
    "bg-primary text-on-primary outline-primary-underline group-active:bg-primary-variant",
  secondary:
    "bg-secondary text-on-secondary outline-secondary-underline group-active:bg-secondary-variant",
  tertiary:
    "bg-tertiary text-on-tertiary outline-tertiary-underline group-active:bg-tertiary-variant",
  quaternary:
    "bg-quaternary text-on-quaternary outline-quaternary-underline group-active:bg-quaternary-variant",
  quinary:
    "bg-quinary text-on-quinary outline-quinary-underline group-active:bg-quinary-variant",
};

export default function Shape({ className, type }: Props) {
  return (
    <div
      className={clsx(
        className,
        styles[type],
        "outline outline-offset-0 outline-0 transition-all",
        "group-focus:outline-2 group-focus:outline-offset-2",
        "group-focus:-rotate-90 group-hover:-rotate-90",
      )}
    />
  );
}

interface Props extends PropsWithClassName {
  type: keyof typeof styles;
}
