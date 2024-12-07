import React, { ComponentProps } from "react";
import clsx from "clsx";

export default function Tab({ className, isSelected = false, ...rest }: Props) {
  return (
    <button
      role="tab"
      {...rest}
      aria-selected={isSelected}
      className={clsx(
        className,
        "flex grow shrink-0 basis-0 p-sm rounded-xs justify-center",
        "font-headline text-headline overflow-hidden text-ellipsis transition",
        "outline outline-2 outline-offset-2 outline-primary/0",
        "focus-visible:outline-primary focus-visible:relative",
        isSelected
          ? "bg-primary-container-variant text-on-primary-container"
          : clsx(
              "bg-container text-on-container",
              "hover:bg-primary-container",
            ),
      )}
    />
  );
}

interface Props extends ComponentProps<"button"> {
  isSelected?: boolean;
}
