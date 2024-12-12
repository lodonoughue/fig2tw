import React, {
  ComponentPropsWithoutRef,
  ForwardedRef,
  forwardRef,
} from "react";
import { clsx } from "clsx";

function HeaderWithRef(
  { className, ...rest }: ComponentPropsWithoutRef<"header">,
  ref: ForwardedRef<HTMLElement>,
) {
  return (
    <header
      {...rest}
      ref={ref}
      className={clsx(className, "px-md flex gap-sm")}
    />
  );
}

const Header = forwardRef(HeaderWithRef);
export default Header;
