import React from "react";
import { PropsWithClassName } from "@ui/types";
import clsx from "clsx";
import { PropsWithChildren } from "react";

export default function Tab({ className, isActive, onClick, children }: Props) {
  return (
    <button
      className={clsx(
        className,
        "flex grow shrink-0 basis-0 p-sm rounded-xs justify-center",
        "font-headline text-headline overflow-hidden text-ellipsis transition",
        "outline outline-2 outline-offset-2 outline-primary/0",
        "focus-visible:outline-primary focus-visible:relative",
        isActive
          ? "bg-primary-container-variant text-on-primary-container"
          : clsx(
              "bg-container text-on-container",
              "hover:bg-primary-container",
            ),
      )}
      onClick={onClick}>
      {children}
    </button>
  );
}

interface Props extends PropsWithClassName, PropsWithChildren {
  isActive: boolean;
  onClick: () => void;
}
