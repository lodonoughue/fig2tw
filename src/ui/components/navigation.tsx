import React, { ComponentProps } from "react";
import clsx from "clsx";

export default function Navigation({
  className,
  ...rest
}: ComponentProps<"nav">) {
  return (
    <nav {...rest} className={clsx(className, "flex flex-row px-md gap-md")} />
  );
}
