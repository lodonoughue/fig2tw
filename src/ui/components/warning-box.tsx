import React, {
  ComponentPropsWithoutRef,
  ForwardedRef,
  forwardRef,
} from "react";
import clsx from "clsx";

function WarningBoxWithRef(
  { className, children, ...rest }: ComponentPropsWithoutRef<"div">,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div
      {...rest}
      ref={ref}
      className={clsx(className, "bg-container p-xs rounded-sm")}>
      <p
        className={clsx(
          "bg-tertiary-container text-on-tertiary-container p-sm",
          "rounded-xs font-body-small text-body-small",
        )}>
        {children}
      </p>
    </div>
  );
}

const WarningBox = forwardRef(WarningBoxWithRef);
export default WarningBox;
