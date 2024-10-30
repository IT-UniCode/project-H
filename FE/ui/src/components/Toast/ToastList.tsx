import { createPortal, useEffect } from "preact/compat";
import useToast from "./useToast";
import { Close } from "@icons/index";
import clsx from "clsx";

export interface Toast {
  id: string;
  message: string;
  type: "success" | "error";
  onClose?: () => void;
  duration?: number;
}

const styles = {
  error: "bg-red-500",
  success: "bg-green-500",
};

function ToastList() {
  const { toasts, removeToast } = useToast();

  const container = document.getElementById("root");

  if (!container) throw new Error("Not found container");

  return (
    <div>
      {createPortal(
        <section class="fixed right-2 top-2 flex flex-col gap-y-2 max-w-md w-full">
          {toasts.map((toast, index) => (
            <section
              key={index}
              class={clsx(
                "px-3 py-1 rounded w-full min-h-10 text-white",
                "flex items-center justify-between gap-x-4",
                styles[toast.type],
              )}
              style={{ transition: "opacity 0.5s" }}
            >
              <p>{toast.message}</p>

              <button
                class="hover:shadow-sm hover:shadow-gray-600 rounded-full p-1 transition-all duration-500"
                onClick={() => {
                  if (toast.onClose) toast.onClose();
                  removeToast(toast.id);
                }}
              >
                <img src={Close.src} width={20} />
              </button>
            </section>
          ))}
        </section>,
        container,
      )}
    </div>
  );
}

export default ToastList;
