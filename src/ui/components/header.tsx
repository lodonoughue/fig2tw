import React, { ComponentProps } from "react";
import { clsx } from "clsx";

export default function Header({
  className,
  ...rest
}: ComponentProps<"header">) {
  return <header {...rest} className={clsx(className, "px-md flex gap-sm")} />;
}
