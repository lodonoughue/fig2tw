import React, {
  ComponentPropsWithoutRef,
  ForwardedRef,
  forwardRef,
} from "react";
import clsx from "clsx";

function InputWithRef(
  { className, ...rest }: ComponentPropsWithoutRef<"input">,
  ref: ForwardedRef<HTMLInputElement>,
) {
  return (
    <div className={clsx(className, "bg-container rounded-sm p-xs flex")}>
      <input
        {...rest}
        ref={ref}
        className={clsx(
          "grow h-10 px-sm rounded-xs text-code font-code outline outline-2",
          "bg-container text-on-container outline-offset-2 outline-primary/0",
          "focus-visible:outline-primary hover:bg-primary-container transition",
        )}
      />
    </div>
  );
}

const Input = forwardRef(InputWithRef);
export default Input;
