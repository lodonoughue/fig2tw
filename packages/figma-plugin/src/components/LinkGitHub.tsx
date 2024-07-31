import React, { ComponentProps, h } from "preact";
import { clsx } from "clsx";
import { PropsWithClassName } from "../utils/types";
import GitHub from "../icons/GitHub";
import Shape from "./Shape";

export default function LinkGitHub({ className, href }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      className={clsx(
        className,
        "group relative flex w-8 h-8 justify-center items-center outline-none",
      )}>
      <GitHub className="text-on-primary h-6 w-6 z-10" />
      <Shape
        type="primary"
        className={clsx(
          "absolute inset-0 rounded-b-sm",
          "group-focus:rounded-tr-sm group-active:rounded-tr-sm group-hover:rounded-tr-sm",
          "group-focus:rounded-br-none group-active:rounded-br-none group-hover:rounded-br-none",
        )}
      />
    </a>
  );
}

interface Props extends PropsWithClassName, Pick<ComponentProps<"a">, "href"> {}
