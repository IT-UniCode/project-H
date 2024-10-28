import { storageName } from "@constant/storageName";
import { getSessionStorage, setSessionStorage } from "@helpers/sessionStorage";
import { useEffect, useState } from "preact/hooks";

export function useCanvass() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    window.addEventListener("storage", (e) => {
      if (e.key === storageName.CanvassModal && e.newValue) {
        setShow(JSON.parse(e.newValue));
      }
    });

    const state = getSessionStorage<boolean>(storageName.CanvassModal) ?? true;
    setShow(state);
  }, []);

  const hideModal = () => {
    setSessionStorage(storageName.CanvassModal, false);
  };

  return { hideModal, show };
}
