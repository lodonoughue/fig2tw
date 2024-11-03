import clsx from "clsx";
import React from "react";
import { ComponentProps } from "react";

export default function Label({ className, size = "regular", ...rest }: Props) {
  return (
    <span className={clsx(className, SIZE_CLASS_MAPPING[size])} {...rest} />
  );
}

const SIZE_CLASS_MAPPING = {
  regular: "font-label-medium text-label-medium",
  small: "font-label-small text-label-small",
} satisfies Record<NonNullable<Props["size"]>, string>;

type Props = ComponentProps<"span"> & {
  size?: "regular" | "small";
};
