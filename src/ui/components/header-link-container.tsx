import React, { ComponentProps } from "react";
import { clsx } from "clsx";

export default function HeaderLinkContainer({
  className,
  ...rest
}: ComponentProps<"div">) {
  return <div {...rest} className={clsx(className, "flex flex-col gap-sm")} />;
}
