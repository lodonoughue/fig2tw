import React, {
  ComponentPropsWithoutRef,
  ForwardedRef,
  forwardRef,
} from "react";
import clsx from "clsx";

function TabWithRef(
  { className, isSelected = false, ...rest }: Props,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  return (
    <button
      role="tab"
      {...rest}
      ref={ref}
      aria-selected={isSelected}
      className={clsx(
        className,
        "flex grow shrink-0 basis-0 p-sm rounded-xs justify-center",
        "font-headline text-headline overflow-hidden text-ellipsis transition",
        "outline outline-2 outline-offset-2 outline-primary/0",
        "focus-visible:outline-primary focus-visible:relative",
        isSelected
          ? "bg-primary-container-variant text-on-primary-container"
          : clsx(
              "bg-container text-on-container",
              "hover:bg-primary-container",
            ),
      )}
    />
  );
}

interface Props extends ComponentPropsWithoutRef<"button"> {
  isSelected?: boolean;
}

const Tab = forwardRef(TabWithRef);
export default Tab;
