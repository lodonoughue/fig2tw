import React, { ComponentProps } from "react";
import { clsx } from "clsx";

export default function Link({
  className,
  href,
  ...rest
}: ComponentProps<"a">) {
  return (
    <a
      {...rest}
      href={href}
      target="_blank"
      className={clsx(
        className,
        "text-on-surface text-label-small font-label-small underline rounded-xs",
        "outline outline-2 outline-offset-2 outline-primary/0 decoration-surface",
        "focus-visible:outline-primary hover:decoration-on-surface transition",
      )}
    />
  );
}
