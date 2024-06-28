import clsx from "clsx";

export default function Button({ className, ...props }) {
  return (
    <button
      className={clsx(
        className,
        "bg-primary text-on-primary h-button-height px-lg rounded-full",
        "outline outline-primary/0 outline-0",
        "hover:bg-primary-variant active:bg-primary-variant",
        "focus-visible:outline-primary focus-visible:outline-2 focus-visible:outline-offset-2",
        "transition-all",
      )}
      {...props}
    />
  );
}
