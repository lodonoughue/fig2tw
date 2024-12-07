import React, { ComponentProps } from "react";
import { clsx } from "clsx";

export default function Link({ className, ...rest }: ComponentProps<"a">) {
  return (
    <a
      target="_blank"
      {...rest}
      className={clsx(
        className,
        "text-on-surface text-label-small font-label-small underline rounded-xs",
        "outline outline-2 outline-offset-2 outline-primary/0 decoration-surface",
        "focus-visible:outline-primary hover:decoration-on-surface transition",
      )}
    />
  );
}
