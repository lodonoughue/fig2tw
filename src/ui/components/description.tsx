import React, {
  ComponentPropsWithoutRef,
  ForwardedRef,
  forwardRef,
} from "react";
import clsx from "clsx";

function DescriptionWithRef(
  { className, ...rest }: ComponentPropsWithoutRef<"p">,
  ref: ForwardedRef<HTMLParagraphElement>,
) {
  return (
    <p
      {...rest}
      ref={ref}
      className={clsx(className, "font-body-small text-body-small")}
    />
  );
}

const Description = forwardRef(DescriptionWithRef);
export default Description;
