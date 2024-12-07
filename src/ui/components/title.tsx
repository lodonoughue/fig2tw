import React, { ComponentProps } from "react";
import { clsx } from "clsx";
import Fig2Tw from "@ui/icons/fig2tw";

export default function Title({
  className,
  children,
  ...rest
}: ComponentProps<"div">) {
  return (
    <div
      {...rest}
      className={clsx(className, "flex gap-sm items-center flex-1")}>
      <Fig2Tw className="w-12 h-12" />
      <h1 className="flex-grow font-heading text-heading">{children}</h1>
    </div>
  );
}
