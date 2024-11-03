import React from "react";
import clsx from "clsx";
import { ComponentProps } from "react";

export default function TextArea({ className, ...rest }: Props) {
  return (
    <div className={clsx(className, "bg-container rounded-sm p-xs flex ")}>
      <textarea
        className={clsx(
          className,
          "min-h-32 grow p-sm rounded-xs text-code font-code outline outline-2",
          "bg-container text-on-container resize-none outline-offset-2",
          "outline-primary/0 transition",
          "focus-visible:outline-primary hover:bg-primary-container",
        )}
        {...rest}
      />
    </div>
  );
}

interface Props extends Omit<ComponentProps<"textarea">, "children"> {
  value?: string;
}
