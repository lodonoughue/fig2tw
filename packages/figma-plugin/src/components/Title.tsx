import React, { h } from "preact";
import { clsx } from "clsx";
import { PropsWithChildren } from "preact/compat";
import { PropsWithClassName } from "../utils/types";
import Fig2Tw from "../icons/Fig2Tw";

export default function Title({ className, children }: Props) {
  return (
    <div className={clsx(className, "flex gap-sm items-center flex-1")}>
      <Fig2Tw className="w-6 h-6" />
      <h1 className="flex-grow font-heading text-heading">{children}</h1>
    </div>
  );
}

interface Props extends PropsWithChildren, PropsWithClassName {}
