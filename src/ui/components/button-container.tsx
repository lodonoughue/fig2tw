import React, {
  ComponentPropsWithoutRef,
  ForwardedRef,
  forwardRef,
} from "react";
import clsx from "clsx";

function ButtonContainerWithRef(
  { className, ...rest }: ComponentPropsWithoutRef<"div">,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div
      {...rest}
      ref={ref}
      className={clsx(className, "flex flex-row items-center")}
    />
  );
}

const ButtonContainer = forwardRef(ButtonContainerWithRef);
export default ButtonContainer;
