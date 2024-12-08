import React, {
  ComponentPropsWithoutRef,
  ForwardedRef,
  forwardRef,
} from "react";
import { clsx } from "clsx";
import Fig2Tw from "@ui/icons/fig2tw";

function TitleWithRef(
  { className, children, ...rest }: ComponentPropsWithoutRef<"div">,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div
      {...rest}
      ref={ref}
      className={clsx(className, "flex gap-sm items-center flex-1")}>
      <Fig2Tw className="w-12 h-12" />
      <h1 className="flex-grow font-heading text-heading">{children}</h1>
    </div>
  );
}

const Title = forwardRef(TitleWithRef);
export default Title;
