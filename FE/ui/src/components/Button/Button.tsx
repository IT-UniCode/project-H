import clsx from "clsx";
import type { ReactNode } from "preact/compat";

interface ButtonProps {
  onClick?: () => void;
  children?: ReactNode;
  class?: string;
}

function Button({ children, class: className, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      class={clsx(
        "bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline h-auto w-auto",
        className,
      )}
    >
      {children}
    </button>
  );
}

export default Button;
