import React, { ComponentProps, h } from "preact";
import clsx from "clsx";

const styles = {
  primary:
    "bg-primary text-on-primary outline-primary-underline active:bg-primary-variant",
  secondary:
    "bg-secondary text-on-secondary outline-secondary-underline active:bg-secondary-variant",
  tertiary:
    "bg-tertiary text-on-tertiary outline-tertiary-underline active:bg-tertiary-variant",
  quaternary:
    "bg-quaternary text-on-quaternary outline-quaternary-underline active:bg-quaternary-variant",
  quinary:
    "bg-quinary text-on-quinary outline-quinary-underline active:bg-quinary-variant",
};

export default function Button({ className, children, type, ...rest }: Props) {
  return (
    <button
      className={clsx(
        className,
        styles[type],
        "flex flex-row px-md py-xs font-heading text-body flex-grow-0 rounded-full",
        "outline outline-offset-0 outline-0 transition-all",
        "focus:outline-2 focus:outline-offset-2",
        "focus:rounded-tr-none focus:rounded-bl-none hover:rounded-tr-none hover:rounded-bl-none",
      )}
      {...rest}>
      {children}
    </button>
  );
}

interface Props extends ComponentProps<"button"> {
  type: keyof typeof styles;
}
