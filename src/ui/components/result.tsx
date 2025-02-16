import React, {
  ComponentPropsWithoutRef,
  ForwardedRef,
  forwardRef,
} from "react";
import clsx from "clsx";
import { copyToClipboard } from "@ui/utils/clipboard";
import Button from "./button";
import { useAnalytics } from "@ui/contexts/analytics";

function ResultWithRef(
  {
    className,
    children,
    onReload,
    onDownload,
    onCopy = copyToClipboard,
    ...rest
  }: Props,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const { track } = useAnalytics();

  function _onReload() {
    track("Reload");
    onReload?.();
  }

  function _onCopy() {
    const result = sanitize(children);
    track("Copy");
    onCopy?.(result);
  }

  function _onDownload() {
    const result = sanitize(children);
    track("Download");
    onDownload?.(result);
  }

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
        <Button variant="regular" onClick={_onReload}>
          Reload
        </Button>
        <Button variant="regular" onClick={_onCopy}>
          Copy
        </Button>
        <Button variant="accent" onClick={_onDownload}>
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
