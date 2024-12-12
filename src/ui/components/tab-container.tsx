import React, {
  ComponentPropsWithoutRef,
  ForwardedRef,
  forwardRef,
} from "react";
import clsx from "clsx";

function TabContainerWithRef(
  { className, ...rest }: ComponentPropsWithoutRef<"div">,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div
      role="tablist"
      {...rest}
      ref={ref}
      className={clsx(className, "flex flex-row p-xs rounded-sm bg-container")}
    />
  );
}

const TabContainer = forwardRef(TabContainerWithRef);
export default TabContainer;
