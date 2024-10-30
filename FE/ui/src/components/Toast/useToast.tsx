import { useLocalStorage } from "@helpers/index";
import type { Toast } from "./ToastList";
import { useEffect, useState } from "preact/hooks";

export default function useToast() {
  const toastKey = "toast-list";

  const [toastList, setToastList] = useState<Toast[]>([]);
  const { get, remove, set } = useLocalStorage(toastKey);

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

    set([...list, toast]);
  };

  const removeToast = (id: string) => {
    const list = get<Toast[]>() || [];
    set(list.filter((v) => v.id !== id));
  };
  return { addToast, removeToast, toasts: toastList };
}
