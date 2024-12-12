import React, { ComponentPropsWithRef, ForwardedRef, forwardRef } from "react";
import { clsx } from "clsx";

function HeaderLinkContainerWithRef(
  { className, ...rest }: ComponentPropsWithRef<"div">,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div
      {...rest}
      ref={ref}
      className={clsx(className, "flex flex-col gap-sm")}
    />
  );
}

const HeaderLinkContainer = forwardRef(HeaderLinkContainerWithRef);
export default HeaderLinkContainer;
