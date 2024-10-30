import userService from "@service/user.service";
import { useEffect, useState } from "preact/hooks";
import type { User } from "src/interfaces";
import { useToast } from "./Toast";

function ShowProfile() {
  const [user, setUser] = useState<User>();
  const { addToast } = useToast();

  async function getProfile() {
    try {
      const res = await userService.getProfile();
      setUser(res);
    } catch (error) {
      addToast({
        id: "error-load-profile",
        message: "Error loading profile",
        type: "error",
      });
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
