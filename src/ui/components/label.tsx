import React, { ComponentProps } from "react";
import clsx from "clsx";

export default function Label({ className, size = "regular", ...rest }: Props) {
  return (
    <span {...rest} className={clsx(className, SIZE_CLASS_MAPPING[size])} />
  );
}

const SIZE_CLASS_MAPPING = {
  regular: "font-label-medium text-label-medium",
  small: "font-label-small text-label-small",
} satisfies Record<NonNullable<Props["size"]>, string>;

type Props = ComponentProps<"span"> & {
  size?: "regular" | "small";
};
