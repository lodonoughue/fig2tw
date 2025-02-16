import React from "react";
import { ComponentType, PropsWithChildren } from "react";

export function composeComponents(
  ...components: ComponentType<PropsWithChildren>[]
): ComponentType<PropsWithChildren> {
  return function ComposedComponents({ children }) {
    return components.reduceRight(
      (acc, Component) => <Component>{acc}</Component>,
      children,
    );
  };
}
