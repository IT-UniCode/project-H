import { useLocalStorage } from "@helpers/index";
import type { Toast } from "./ToastList";
import { useEffect, useState } from "preact/hooks";

const toastKey = "toast-list";
export default function useToast() {
  const [toastList, setToastList] = useState<Toast[]>([]);
  const { get, set } = useLocalStorage(toastKey);

  useEffect(() => {
    window.addEventListener("storage", (e) => {
      if (e.key === toastKey && e.newValue) {
        setToastList(JSON.parse(e.newValue));
      }
    });
    const toasts = get<Toast[]>();
    if (!toasts) set([]);
    else setToastList(toasts);
  }, []);

  const addToast = (toast: Toast) => {
    const list = get<Toast[]>() || [];
    const exist = list.find((v) => v.id === toast.id);

    if (exist) {
      return;
    }

    set([toast, ...list]);
  };

  const removeToast = (id: string) => {
    const list = get<Toast[]>() || [];
    set(list.filter((v) => v.id !== id));
  };
  return { addToast, removeToast, toasts: toastList };
}

export function removeToast(id: string) {
  const { get, set } = useLocalStorage(toastKey);
  const list = get<Toast[]>() || [];
  set(list.filter((v) => v.id !== id));
}

export function addToast(toast: Toast) {
  const { get, set } = useLocalStorage(toastKey);
  const list = get<Toast[]>() || [];
  const exist = list.find((v) => v.id === toast.id);

  if (exist) {
    return;
  }

  set([toast, ...list]);
}
