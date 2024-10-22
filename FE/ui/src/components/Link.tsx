import clsx from "clsx";
import type { ReactNode } from "preact/compat";

export interface LinkProps {
  href?: string;
  onClick?: () => void;
  children?: ReactNode;
  class?: string;
}

function Link({ children, href, class: className, onClick }: LinkProps) {
  return (
    <a
      href={href}
      onClick={onClick}
      class={clsx(
        "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline",
        className,
      )}
    >
      {children}
    </a>
  );
}

export default Link;
