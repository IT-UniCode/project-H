import { TextField } from "@components/TextFields";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type StateUpdater,
} from "preact/hooks";
import SearchItem from "./SearchItem";
import userService from "@service/user.service";
import type { User } from "@interfaces/user";
import chatService from "@service/chat.service";
import { addToast, removeToast } from "@components/Toast";
import type { Dispatch, FC } from "preact/compat";
import type { ChatState } from "../../ChatList";

interface SearchProps {
  setChat: Dispatch<StateUpdater<ChatState>>;
}

const Search: FC<SearchProps> = ({ setChat }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<{ search: User[]; open: boolean }>({
    search: [],
    open: false,
  });

  async function createChat(userId: number) {
    try {
      const res = await chatService.createChat(userId);

      setChat((prev) => ({
        ...prev,
        chats: [...prev.chats, res],
        selected: res.id,
      }));
      setUsers((prev) => ({ ...prev, search: [], open: false }));
    } catch (e) {
      addToast({ id: "Chat", type: "error", message: "can't create" });
      setTimeout(() => {
        removeToast("Chat");
      }, 3000);
    }
  }

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
  });

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
            <SearchItem {...user} createChat={createChat} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
