import React, {
  ComponentPropsWithoutRef,
  ForwardedRef,
  forwardRef,
} from "react";
import clsx from "clsx";

function SectionWithRef(
  { className, direction = "col", ...rest }: Props,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div
      {...rest}
      ref={ref}
      className={clsx(
        className,
        "flex grow px-md gap-md",
        DIRECTION_CLASS_MAPPING[direction],
      )}
    />
  );
}

const DIRECTION_CLASS_MAPPING = {
  row: "flex-row",
  col: "flex-col",
} as const;

interface Props extends ComponentPropsWithoutRef<"div"> {
  direction?: "row" | "col";
}

const Section = forwardRef(SectionWithRef);
export default Section;
