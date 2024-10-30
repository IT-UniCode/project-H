import { storageName } from "@constant/storageName";
import { useSessionStorage } from "@helpers/index";
import { useEffect, useState } from "preact/hooks";

export function useCanvass() {
  const [show, setShow] = useState(true);
  const { get, set } = useSessionStorage(storageName.CanvassModal);

  useEffect(() => {
    window.addEventListener("storage", (e) => {
      if (e.key === storageName.CanvassModal && e.newValue) {
        setShow(JSON.parse(e.newValue));
      }
    });

    const state = get<boolean>() ?? true;
    setShow(state);
  }, []);

  const hideModal = () => {
    set(false);
  };

  return { hideModal, show };
}