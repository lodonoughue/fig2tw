import React, { ComponentProps } from "react";
import clsx from "clsx";

export default function TabContainer({
  className,
  ...rest
}: ComponentProps<"div">) {
  return (
    <div
      role="tablist"
      {...rest}
      className={clsx(className, "flex flex-row p-xs rounded-sm bg-container")}
    />
  );
}
