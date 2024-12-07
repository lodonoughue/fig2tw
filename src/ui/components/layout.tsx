import React, { ComponentProps } from "react";
import clsx from "clsx";

export default function Layout({ className, ...rest }: ComponentProps<"div">) {
  return (
    <div
      {...rest}
      className={clsx(
        className,
        "bg-surface text-on-surface h-full flex flex-col gap-md py-md overflow-auto",
      )}
    />
  );
}
