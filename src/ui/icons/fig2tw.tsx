import React, { ComponentProps } from "react";

export default function Fig2Tw(props: Props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" {...props}>
      <path
        d="M0 24C0 10.7452 10.7452 0 24 0L48 0V0C48 13.2548 37.2548 24 24 24H0V24Z"
        className="fill-secondary"
      />
      <path
        d="M0 48C0 34.7452 10.7452 24 24 24L48 24V24C48 37.2548 37.2548 48 24 48H0V48Z"
        className="fill-primary"
      />
    </svg>
  );
}

type Props = Omit<ComponentProps<"svg">, "children">;
