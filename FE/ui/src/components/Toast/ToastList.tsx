import { createPortal, useEffect } from "preact/compat";
import useToast from "./useToast";
import { Close } from "@icons/index";

export interface Toast {
  id: string;
  message: string;
  type: "success" | "error";
  onClose?: () => void;
  duration?: number;
}

function ToastList() {
  const { toasts, removeToast } = useToast();

  const container = document.getElementById("root");

  if (!container) throw new Error("Not found container");

  return (
    <div>
      {createPortal(
        <section class=" absolute right-2 top-2 flex flex-col">
          {toasts.map((toast, index) => (
            <div
              key={index}
              class={`flex gap-x-4 px-3 rounded items-center justify-center w-full min-h-10 text-white ${
                toast.type === "success" ? "bg-green-500" : "bg-red-500"
              }`}
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
            </div>
          ))}
        </section>,
        container,
      )}
    </div>
  );
}

export default ToastList;
