import React, {
  ComponentPropsWithoutRef,
  ForwardedRef,
  forwardRef,
} from "react";
import clsx from "clsx";

function LabelWithRef(
  { className, size = "regular", ...rest }: Props,
  ref: ForwardedRef<HTMLSpanElement>,
) {
  return (
    <span
      {...rest}
      ref={ref}
      className={clsx(className, SIZE_CLASS_MAPPING[size])}
    />
  );
}

const SIZE_CLASS_MAPPING = {
  regular: "font-label-medium text-label-medium",
  small: "font-label-small text-label-small",
} satisfies Record<NonNullable<Props["size"]>, string>;

type Props = ComponentPropsWithoutRef<"span"> & {
  size?: "regular" | "small";
};

const Label = forwardRef(LabelWithRef);
export default Label;
