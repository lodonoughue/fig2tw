import React, { ComponentProps } from "react";
import { PropsWithClassName } from "@ui/types";
import clsx from "clsx";
import { PropsWithChildren } from "react";

export default function Button({
  className,
  variant = "accent",
  children,
  onClick,
}: Props) {
  return (
    <button
      className={clsx(
        className,
        BUTTON_CLASS_MAPPING[variant],
        "relative group outline outline-2 outline-offset-2 outline-primary/0",
        "rounded-sm focus-visible:outline-primary transition",
      )}
      onClick={onClick}>
      <Panel
        aria-hidden
        className={clsx(
          PANEL_CLASS_MAPPING[variant],
          "absolute left-0 right-0 transition bottom-1 group-active:bottom-0",
        )}>
        {children}
      </Panel>
      <Panel>{children}</Panel>
    </button>
  );
}

function Panel({ className, ...rest }: ComponentProps<"div">) {
  return (
    <div
      {...rest}
      className={clsx(
        className,
        "font-body-medium text-body-medium p-sm rounded-sm",
      )}
    />
  );
}

const BUTTON_CLASS_MAPPING = {
  accent: "bg-tertiary",
  regular: "bg-primary-container-variant",
};

const PANEL_CLASS_MAPPING = {
  accent: "bg-tertiary-variant text-on-tertiary",
  regular: "bg-container text-on-container",
};

interface Props extends PropsWithClassName, PropsWithChildren {
  variant?: "accent" | "regular";
  onClick?: () => void;
}
