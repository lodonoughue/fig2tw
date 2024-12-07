import clsx from "clsx";
import React, { ComponentProps, useId } from "react";

export default function RadioGroup<T extends string>({
  ref,
  id,
  name,
  className,
  value,
  choices,
  onChange,
  onBlur,
}: Props<T>) {
  const refIndex = value != null ? choices.indexOf(value) : 0;
  const defaultId = useId();
  name = name || id || defaultId;

  return (
    <div role="radiogroup" className={clsx(className, "flex flex-row gap-sm")}>
      {choices.map((it, index) => (
        <Radio
          key={it}
          ref={index === refIndex ? ref : undefined}
          name={name}
          className="flex-grow"
          value={it}
          checked={value === it}
          onChange={onChange}
          onBlur={onBlur}
          readOnly={onChange == null}
        />
      ))}
    </div>
  );
}

function Radio({
  id,
  name,
  className,
  value,
  checked,
  ...rest
}: ComponentProps<"input">) {
  const defaultId = useId();
  id = id || defaultId;

  return (
    <div
      className={clsx(
        className,
        "flex flex-row basis-0 gap-sm rounded-full p-xs justify-center items-center",
        "bg-container",
      )}>
      <input
        id={id}
        name={name}
        type="radio"
        className="peer fixed opacity-0 w-0 h-0 pointer-events-none"
        value={value}
        checked={checked}
        {...rest}
      />
      <label
        htmlFor={id}
        className={clsx(
          "px-sm py-xs flex-grow text-on-surface font-body-medium text-body-medium",
          "rounded-full outline outline-2 outline-offset-2 outline-primary/0",
          "cursor-pointer text-center peer-focus-visible:outline-primary transition",
          checked
            ? "bg-secondary-container-variant"
            : "bg-container peer-hover:bg-primary-container",
        )}>
        {value}
      </label>
    </div>
  );
}

interface Props<T extends string>
  extends Pick<
    ComponentProps<"input">,
    "ref" | "id" | "name" | "onChange" | "onBlur" | "className"
  > {
  choices: T[];
  value?: T;
}
