import { getLocalStorage, setLocalStorage } from "@helpers/localStorageHelper";
import type { Toast } from "./ToastList";
import { useEffect, useState } from "preact/hooks";

export default function useToast() {
  const toastKey = "toast-list";
  const toasts = getLocalStorage<Toast[]>(toastKey);
  if (!toasts) setLocalStorage(toastKey, []);

  const [toastList, setToastList] = useState(toasts || []);

  useEffect(() => {
    window.addEventListener("storage", (e) => {
      if (e.key === toastKey && e.newValue) {
        setToastList(JSON.parse(e.newValue));
      }
    });
  }, []);

  const addToast = (toast: Toast) => {
    const list = getLocalStorage<Toast[]>(toastKey) || [];
    const exist = list.find((v) => v.id === toast.id);

    if (exist) {
      return;
    }

    setLocalStorage(toastKey, [...list, toast]);
  };

  const removeToast = (id: string) => {
    const list = getLocalStorage<Toast[]>(toastKey) || [];
    setLocalStorage(
      toastKey,
      list.filter((v) => v.id !== id),
    );
  };
  return { addToast, removeToast, toasts: toastList };
}
