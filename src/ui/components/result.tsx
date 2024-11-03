import React from "react";
import { PropsWithClassName } from "@ui/types";
import clsx from "clsx";
import { PropsWithChildren } from "react";
import { copyToClipboard } from "@ui/utils/clipboard";
import Button from "./button";

export default function Result({
  className,
  children,
  onReload,
  onDownload = () => {},
  onCopy = copyToClipboard,
}: Props) {
  return (
    <div className={clsx(className, "flex flex-col gap-sm")}>
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

interface Props extends PropsWithClassName, PropsWithChildren {
  children?: string | string[] | null;
  onReload?: () => void;
  onCopy?: (result: string) => void;
  onDownload?: (result: string) => void;
}
