import React, {
  ComponentPropsWithoutRef,
  ForwardedRef,
  forwardRef,
} from "react";
import clsx from "clsx";

function ColumnWithRef(
  { className, ...rest }: ComponentPropsWithoutRef<"div">,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div
      {...rest}
      ref={ref}
      className={clsx(className, "flex flex-col grow basis-0 gap-md")}
    />
  );
}

const Column = forwardRef(ColumnWithRef);
export default Column;
