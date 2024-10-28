import { storageName } from "@constant/storageName";
import { getLocalStorage, setLocalStorage } from "@helpers/index";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "preact/hooks";

export function useAuth() {
  const [isAuth, setIsAuth] = useState(false);

  const logOut = () => {
    localStorage.removeItem(storageName.AccessToken);
    setIsAuth(false);
  };

  const setAuth = (token: string): boolean => {
    const decode = jwtDecode(token);

    if (!decode.exp || decode.exp * 1000 < Date.now()) {
      logOut();
      return false;
    }

    setLocalStorage(storageName.AccessToken, token);
    setIsAuth(true);
    return true;
  };

  const checkLiveToken = () => {
    const token = getLocalStorage<string>(storageName.AccessToken);
    if (!token) return;
    const decode = jwtDecode(token);

    if (!decode.exp || decode.exp * 1000 < Date.now()) {
      logOut();
      return;
    }

    setIsAuth(true);
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
    isAuth,
    logOut,
    setAuth,
  };
}
