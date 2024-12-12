import React, {
  ComponentPropsWithoutRef,
  ForwardedRef,
  forwardRef,
} from "react";
import clsx from "clsx";

function TextAreaWithRef(
  { className, ...rest }: Props,
  ref: ForwardedRef<HTMLTextAreaElement>,
) {
  return (
    <div className={clsx(className, "bg-container rounded-sm p-xs flex ")}>
      <textarea
        {...rest}
        ref={ref}
        className={clsx(
          "min-h-32 grow p-sm rounded-xs text-code font-code outline outline-2",
          "bg-container text-on-container resize-none outline-offset-2",
          "outline-primary/0 transition",
          "focus-visible:outline-primary hover:bg-primary-container",
        )}
      />
    </div>
  );
}

interface Props extends Omit<ComponentPropsWithoutRef<"textarea">, "children"> {
  value?: string;
}

const TextArea = forwardRef(TextAreaWithRef);
export default TextArea;
