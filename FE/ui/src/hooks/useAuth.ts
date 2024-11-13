import { storageName } from "@constant/storageName";
import { useLocalStorage } from "@helpers/index";
import type { JwtPayload } from "@interfaces/index";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "preact/hooks";

interface Store {
  isAuth: boolean;
  payload: JwtPayload | null;
}

export function useAuth() {
  const [store, setStore] = useState<Store>({ isAuth: false, payload: null });
  const { get, set } = useLocalStorage(storageName.AccessToken);

  const logOut = () => {
    localStorage.removeItem(storageName.AccessToken);
    setStore({ isAuth: false, payload: null });
  };

  const setAuth = (token: string): boolean => {
    const decode = jwtDecode(token) as JwtPayload;

    if (!decode.exp || decode.exp * 1000 < Date.now()) {
      logOut();
      return false;
    }

    set(token);

    setStore({ isAuth: true, payload: decode });
    return true;
  };

  const checkLiveToken = () => {
    const token = get<string>();
    if (!token) return;
    const decode = jwtDecode(token) as JwtPayload;

    if (!decode.exp || decode.exp * 1000 < Date.now()) {
      logOut();
      return;
    }

    setStore({ isAuth: true, payload: decode });
  };

  useEffect(() => {
    window.addEventListener("storage", (e) => {
      if (e.key === storageName.AccessToken && e.newValue) {
        checkLiveToken();
      }
    });

    checkLiveToken();
  }, []);

  return {
    isAuth: store.isAuth,
    payload: store.payload,
    logOut,
    setAuth,
  };
}
