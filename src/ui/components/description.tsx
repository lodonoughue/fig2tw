import React, { ComponentProps } from "react";
import clsx from "clsx";

export default function Description({
  className,
  ...rest
}: ComponentProps<"p">) {
  return (
    <p
      {...rest}
      className={clsx(className, "font-body-small text-body-small")}
    />
  );
}
