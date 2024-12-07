import React, { ComponentProps } from "react";
import clsx from "clsx";

export default function ButtonContainer({
  className,
  ...rest
}: ComponentProps<"div">) {
  return (
    <div {...rest} className={clsx(className, "flex flex-row items-center")} />
  );
}
