import { routes } from "src/routes";
import Link from "./Link";
import { storageName } from "src/constant/storageName";

function Authorization() {
  if (!globalThis.window || !localStorage.getItem(storageName.AccessToken)) {
    return (
      <section class="flex gap-x-4">
        <Link href={routes.Login}>Login</Link>
        <Link href={routes.SignUp}>SignUp</Link>
      </section>
    );
  }

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
