import clsx from "clsx";
import React, {
  ComponentPropsWithoutRef,
  ForwardedRef,
  forwardRef,
  useId,
} from "react";

function RadioGroupWithRef<T extends string>(
  { id, name, label, className, value, choices, onChange, onBlur }: Props<T>,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const refIndex = value != null ? choices.indexOf(value) : 0;
  const defaultId = useId();
  name = name || defaultId;

  return (
    <div
      id={id}
      role="radiogroup"
      className={clsx(className, "flex flex-row gap-sm")}
      aria-label={label}>
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

function RadioWithRef(
  {
    id,
    name,
    className,
    value,
    checked,
    ...rest
  }: ComponentPropsWithoutRef<"input">,
  ref: ForwardedRef<HTMLInputElement>,
) {
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
        ref={ref}
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
    ComponentPropsWithoutRef<"input">,
    "id" | "name" | "onChange" | "onBlur" | "className"
  > {
  choices: T[];
  label?: string;
  value?: T;
}

const Radio = forwardRef(RadioWithRef);
const RadioGroup = forwardRef(RadioGroupWithRef);
export default RadioGroup;
