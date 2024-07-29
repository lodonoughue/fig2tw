import React, { h } from "preact";
import { PropsWithClassName } from "../utils/types";
import clsx from "clsx";
import { PropsWithChildren } from "preact/compat";
import Bullet from "./Bullet";

export default function Collection({ index, className, children }: Props) {
  return (
    <div className={clsx(className, "flex flex-row gap-xs")}>
      <Bullet index={index} />
      <span className="flex font-heading text-code flex-grow items-center">
        {children}
      </span>
    </div>
  );
}

interface Props extends PropsWithClassName, PropsWithChildren {
  index: number;
}
