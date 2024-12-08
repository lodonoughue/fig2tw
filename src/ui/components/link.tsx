import React, {
  ComponentPropsWithoutRef,
  ForwardedRef,
  forwardRef,
} from "react";
import { clsx } from "clsx";

function LinkWithRef(
  { className, ...rest }: ComponentPropsWithoutRef<"a">,
  ref: ForwardedRef<HTMLAnchorElement>,
) {
  return (
    <a
      target="_blank"
      {...rest}
      ref={ref}
      className={clsx(
        className,
        "text-on-surface text-label-small font-label-small underline rounded-xs",
        "outline outline-2 outline-offset-2 outline-primary/0 decoration-surface",
        "focus-visible:outline-primary hover:decoration-on-surface transition",
      )}
    />
  );
}

const Link = forwardRef(LinkWithRef);
export default Link;
