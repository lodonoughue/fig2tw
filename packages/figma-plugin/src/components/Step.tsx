import React, { h } from "preact";
import { PropsWithClassName } from "../utils/types";
import { PropsWithChildren } from "preact/compat";
import clsx from "clsx";

export default function Step({
  title,
  description,
  className,
  children,
}: Props) {
  return (
    <div className={clsx(className, "flex flex-col px-4 gap-md")}>
      <div className="flex flex-col">
        <h2 className="font-body text-body">{title}</h2>
        <p className="font-body text-code">{description}</p>
      </div>
      {children}
    </div>
  );
}

interface Props extends PropsWithClassName, PropsWithChildren {
  title: string;
  description: string;
}
