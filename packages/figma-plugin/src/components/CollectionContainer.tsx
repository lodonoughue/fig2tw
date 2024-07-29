import React, { h } from "preact";
import { PropsWithChildren } from "preact/compat";
import { PropsWithClassName } from "../utils/types";
import clsx from "clsx";

export default function CollectionContainer({ className, children }: Props) {
  return (
    <div className={clsx(className, "grid grid-cols-2 px-sm gap-xs")}>
      {children}
    </div>
  );
}

interface Props extends PropsWithChildren, PropsWithClassName {}
