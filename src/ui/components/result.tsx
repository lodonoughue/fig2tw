import React, {
  ComponentPropsWithoutRef,
  ForwardedRef,
  forwardRef,
} from "react";
import clsx from "clsx";
import { copyToClipboard } from "@ui/utils/clipboard";
import Button from "./button";

function ResultWithRef(
  {
    className,
    children,
    onReload,
    onDownload = () => {},
    onCopy = copyToClipboard,
    ...rest
  }: Props,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div
      {...rest}
      ref={ref}
      className={clsx(className, "flex flex-col gap-sm")}>
      <div
        className={clsx(
          "p-sm rounded-sm overflow-auto basis-0 grow",
          "bg-container text-on-container",
        )}>
        <pre className="font-code text-code">{children}</pre>
      </div>
      <div className="flex flex-row justify-end gap-sm">
        <Button variant="regular" onClick={onReload}>
          Reload
        </Button>
        <Button variant="regular" onClick={() => onCopy(sanitize(children))}>
          Copy
        </Button>
        <Button variant="accent" onClick={() => onDownload(sanitize(children))}>
          Download
        </Button>
      </div>
    </div>
  );
}

function sanitize(result: Props["children"]) {
  return Array.isArray(result) ? result.join("\n") : result || "";
}

interface Props
  extends Omit<ComponentPropsWithoutRef<"div">, "children" | "onCopy"> {
  children?: string | string[] | null;
  onReload?: () => void;
  onCopy?: (result: string) => void;
  onDownload?: (result: string) => void;
}

const Result = forwardRef(ResultWithRef);
export default Result;
