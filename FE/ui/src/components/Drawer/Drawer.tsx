import clsx from "clsx";
import { createPortal, useEffect, useRef, type ReactNode } from "preact/compat";

export interface DrawerProps {
  open: boolean;
  children: ReactNode;
  class?: string;
}

function Drawer({ open, children, class: className }: DrawerProps) {
  const modalRef = useRef<HTMLDialogElement>(null);
  const container = document.getElementById("root");

  useEffect(() => {
    console.log(open);

    if (open) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      //   modalRef.current?.showModal();
      document.body.classList.add("overflow-hidden");
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      //   modalRef.current?.close();
      document.body.classList.remove("overflow-hidden");
      document.body.style.paddingRight = "";
    }
  }, [open]);

  if (!container) throw new Error("Not found container");

  return createPortal(
    <section
      class={clsx(
        "fixed bg-gray-200 bg-opacity-30 w-full h-full rounded duration-500",
        {
          "translate-x-full": !open,
          "translate-x-0": open,
        },
        className,
      )}
    >
      <div
        class={clsx(
          "absolute right-0 pointer-events-auto max-w-lg w-full  h-full bg-white shadow-xl transform transition-transform duration-500",
          //   open ? "translate-x-0" : "translate-x-full", // animate slide-in
          {
            "translate-x-full": !open,
          },
          className,
        )}
      >
        {children}
      </div>
    </section>,
    container,
  );
}

export default Drawer;
