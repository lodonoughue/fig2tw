import React, {
  ComponentPropsWithoutRef,
  ForwardedRef,
  forwardRef,
  useEffect,
} from "react";
import clsx from "clsx";
import { useAnalytics } from "@ui/contexts/analytics";

function SectionWithRef(
  { className, direction = "col", ...rest }: Props,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const { track } = useAnalytics();

  useEffect(() => {
    track("Page Viewed");
  }, [track]);

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
