import clsx from "clsx";
import type { InputHTMLAttributes } from "preact/compat";

export interface TextFielsProps extends InputHTMLAttributes<HTMLInputElement> {}

function TextField(props: TextFielsProps) {
  return (
    <input
      {...props}
      class={clsx(
        "w-full ",
        "placeholder:text-slate-400 text-slate-700 text-sm",
        "bg-transparent border border-slate-200 rounded-md hover:border-slate-300 shadow-sm",
        "px-3 py-2",
        "transition duration-300 ease",
        "focus:outline-none focus:border-slate-400 focus:shadow",
      )}
    />
  );
}

export default TextField;
