import clsx from "clsx";
import { createPortal, type ReactNode } from "preact/compat";
import { useEffect, useRef } from "preact/hooks";

export interface ModalProps {
  open: boolean;
  children: ReactNode;
  class: string;
}

function Modal({ open, children, class: className }: ModalProps) {
  const modalRef = useRef<HTMLDialogElement>(null);
  const container = document.getElementById("root");

  useEffect(() => {
    if (open) {
      modalRef.current?.showModal();
    } else {
      modalRef.current?.close();
    }
  }, [open]);

  if (!container) throw new Error("Not found container");

  return createPortal(
    <dialog
      class={clsx(
        "backdrop:bg-gray-500 backdrop:bg-opacity-40 max-w-6xl w-full rounded",
        className,
      )}
      ref={modalRef}
    >
      {children}
    </dialog>,
    container,
  );
}

export default Modal;
