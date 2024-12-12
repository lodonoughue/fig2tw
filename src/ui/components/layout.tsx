import React, {
  ComponentPropsWithoutRef,
  ForwardedRef,
  forwardRef,
} from "react";
import clsx from "clsx";

function LayoutWithRef(
  { className, ...rest }: ComponentPropsWithoutRef<"div">,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div
      {...rest}
      ref={ref}
      className={clsx(
        className,
        "bg-surface text-on-surface h-full flex flex-col gap-md py-md overflow-auto",
      )}
    />
  );
}

const Layout = forwardRef(LayoutWithRef);
export default Layout;
