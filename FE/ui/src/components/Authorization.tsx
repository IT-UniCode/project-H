import { routes } from "src/routes";
import Link from "./Link";
import { storageName } from "src/constant/storageName";
import { useEffect } from "preact/hooks";
import { getLocalStorage } from "@helpers/localStorageHelper";
import { jwtDecode } from "jwt-decode";

function Authorization() {
  if (!globalThis.window || !localStorage.getItem(storageName.AccessToken)) {
    return (
      <section class="flex gap-x-4">
        <Link href={routes.Login}>Login</Link>
        <Link href={routes.SignUp}>Sign Up</Link>
      </section>
    );
  }

  useEffect(() => {
    const token = getLocalStorage<string>(storageName.AccessToken);
    if (!token) return;
    const decode = jwtDecode(token);

    if (!decode.exp || decode.exp * 1000 < Date.now()) {
      localStorage.removeItem(storageName.AccessToken);
      return;
    }
  }, []);

  return (
    <section class="flex gap-x-4">
      <Link href={routes.Profile}>Profile</Link>
      <Link
        href={routes.Login}
        onClick={() => {
          localStorage.removeItem(storageName.AccessToken);
        }}
      >
        Log Out
      </Link>
    </section>
  );
}

export default Authorization;
