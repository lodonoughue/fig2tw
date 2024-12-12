import React, {
  ComponentProps,
  ComponentPropsWithoutRef,
  ForwardedRef,
  forwardRef,
} from "react";
import clsx from "clsx";

function ButtonWithRef(
  { className, variant = "accent", children, ...rest }: Props,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  return (
    <button
      {...rest}
      ref={ref}
      className={clsx(
        className,
        BUTTON_CLASS_MAPPING[variant],
        "relative group outline outline-2 outline-offset-2 outline-primary/0",
        "rounded-sm focus-visible:outline-primary transition",
      )}>
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
} satisfies Record<NonNullable<Props["variant"]>, string>;

const PANEL_CLASS_MAPPING = {
  accent: "bg-tertiary-variant text-on-tertiary",
  regular: "bg-container text-on-container",
} satisfies Record<NonNullable<Props["variant"]>, string>;

interface Props extends ComponentPropsWithoutRef<"button"> {
  variant?: "accent" | "regular";
}

const Button = forwardRef(ButtonWithRef);
export default Button;
