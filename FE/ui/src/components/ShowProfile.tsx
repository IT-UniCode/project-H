import userService from "@service/user.service";
import { useEffect, useState } from "preact/hooks";
import type { User } from "src/interfaces";

function ShowProfile() {
  const [user, setUser] = useState<User>();

  async function getProfile() {
    try {
      const res = await userService.getProfile();
      setUser(res);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getProfile();
  }, []);

  if (!user) {
    return <p>Loading</p>;
  }

  return (
    <section>
      <p>{user.id}</p>
      <p>{user.name}</p>
      <p>{user.email}</p>
    </section>
  );
}

export default ShowProfile;
