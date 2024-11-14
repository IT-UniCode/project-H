import { TextField } from "@components/TextFields";
import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import SearchItem from "./SearchItem";
import userService from "@service/user.service";
import type { User } from "@interfaces/user";

const Search = () => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<{ search: User[]; open: boolean }>({
    search: [],
    open: false,
  });

  useMemo(async () => {
    if (!search) {
      setUsers({ open: false, search: [] });
      return;
    }
    const response = await userService.search(search);
    setUsers((prev) => ({ ...prev, search: response }));
  }, [search]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setUsers((prev) => ({ ...prev, open: false }));
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div class="relative mb-2" ref={dropdownRef}>
      <TextField
        class="bg-white rounded-none"
        onChange={(e: any) => {
          setUsers((prev) => ({ ...prev, open: true }));
          setSearch(e.target.value);
        }}
        onFocus={() => {
          setUsers((prev) => ({ ...prev, open: true }));
        }}
      />
      {users.open && users.search && (
        <div class={"absolute top-[100%] left-0 right-0 z-50 "}>
          {users.search.map((user) => (
            <SearchItem {...user} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
