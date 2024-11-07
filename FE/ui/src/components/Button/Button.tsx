import clsx from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "preact/compat";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void;
  children?: ReactNode;
  class?: string;
}

function Button(props: ButtonProps) {
  return (
    <button
      {...props}
      class={clsx(
        "bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline h-auto w-auto",
        "duration-700",
        props.className,
        props.class,
      )}
    >
      {props.children}
    </button>
  );
}

export default Button;
