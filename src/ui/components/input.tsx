import React from "react";
import clsx from "clsx";
import { ComponentProps } from "react";

export default function Input({ className, ...rest }: ComponentProps<"input">) {
  return (
    <div className={clsx(className, "bg-container rounded-sm p-xs flex")}>
      <input
        {...rest}
        className={clsx(
          "grow h-10 px-sm rounded-xs text-code font-code outline outline-2",
          "bg-container text-on-container outline-offset-2 outline-primary/0",
          "focus-visible:outline-primary hover:bg-primary-container transition",
        )}
      />
    </div>
  );
}
