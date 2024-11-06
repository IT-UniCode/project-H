import clsx from "clsx";
import type { ReactNode, SelectHTMLAttributes } from "preact/compat";

export interface SelectProps<T>
  extends SelectHTMLAttributes<HTMLSelectElement> {
  items: T[];
  render?: (item: T) => ReactNode;
}

interface Base {
  value: string;
  label: string;
}

function Select<T extends Base>(props: SelectProps<T>) {
  const { items, render } = props;
  return (
    <select
      {...props}
      class={clsx(
        "w-full px-3 py-2 text-base",
        "border border-slate-200 rounded-md",
      )}
    >
      {items.map((v) =>
        render ? render(v) : <option value={v.value}>{v.label}</option>,
      )}
    </select>
  );
}

export default Select;
