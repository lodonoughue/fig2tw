import React, {
  ComponentPropsWithoutRef,
  ForwardedRef,
  forwardRef,
} from "react";
import clsx from "clsx";

function NavigationWithRef(
  { className, ...rest }: ComponentPropsWithoutRef<"nav">,
  ref: ForwardedRef<HTMLElement>,
) {
  return (
    <nav
      {...rest}
      ref={ref}
      className={clsx(className, "flex flex-row px-md gap-md")}
    />
  );
}

const Navigation = forwardRef(NavigationWithRef);
export default Navigation;
