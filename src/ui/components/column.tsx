import React, { ComponentProps } from "react";
import clsx from "clsx";

export default function Column({ className, ...rest }: ComponentProps<"div">) {
  return (
    <div
      {...rest}
      className={clsx(className, "flex flex-col grow basis-0 gap-md")}
    />
  );
}
