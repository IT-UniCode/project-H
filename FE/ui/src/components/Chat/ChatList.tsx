import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import Chat from "./Chat";
import { TextArea, TextField } from "@components/TextFields";
import userService from "@service/user.service";
import type { IChat, User } from "@interfaces/index";
import chatService from "@service/chat.service";
import { useAuth } from "@hooks/useAuth";

export interface ChatListProps {
  class?: string;
}

interface ChatState {
  selected: number;
  chats: IChat[];
}

function ChatList({ class: className }: ChatListProps) {
  const [chat, setChat] = useState<ChatState>({ selected: -1, chats: [] });
  const [search, setSearch] = useState("");
  const { payload } = useAuth();

  const [users, setUsers] = useState<{ search: User | null; open: boolean }>({
    search: null,
    open: false,
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  async function getChats() {
    const res = await chatService.getChats();
    setChat((prev) => ({ ...prev, chats: res }));
  }

  async function createChat() {
    if (!users.search?.id) {
      return;
    }
    try {
      const res = await chatService.createChat(users.search?.id);
      setChat((prev) => ({ ...prev, chats: [...prev.chats, res] }));
      setUsers((prev) => ({ ...prev, search: null, open: false }));
    } catch (e) {}
  }

  useMemo(async () => {
    if (!search) return;
    const response = await userService.search(search);
    setUsers((prev) => ({ ...prev, search: response }));
  }, [search]);

  useEffect(() => {
    console.log(users);
  }, [users]);

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

    getChats();

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!payload) {
    return <div>Loading...</div>;
  }
  return (
    <section
      class={clsx("flex max-w-5xl w-full mx-auto  max-h-[85vh]", className)}
    >
      <section class="min-w-[100px] md:min-w-[250px] flex-[1_1_25%] bg-blue-200">
        <div class="relative mb-2" ref={dropdownRef}>
          <TextField
            class="bg-white rounded-none"
            onChange={(e: any) => {
              setSearch(e.target.value);
            }}
            onFocus={() => {
              setUsers((prev) => ({ ...prev, open: true }));
            }}
          />
          {/* {(users.search && users.open) + "d"} */}
          {users.open && users.search && (
            <div
              class="absolute top-[100%] min-h-10 mt-2 left-0 right-0 bg-white shadow-md px-2 py-1"
              onClick={createChat}
            >
              <h4 class="">Name: {users.search?.name}</h4>
              <p class="text-xs text-gray-500">Email: {users.search?.email}</p>
            </div>
          )}
        </div>

        <div class="overflow-y-auto scroll-smooth">
          <section class="flex flex-col divide-y">
            {chat.chats.map((item) => (
              <div
                key={item.id}
                class="flex bg-white px-2 py-1 gap-x-2 min-h-16"
                onClick={() => {
                  setChat((prev) => ({ ...prev, selected: item.id }));
                }}
              >
                <div class="rounded-full bg-gray-400 flex-[1_1_20%] aspect-square h-full my-auto hidden md:block"></div>
                <article class="flex-[2_1_80%]">
                  <h3>{item.firstUserId}</h3>
                  <p>
                    {item.secondUserId} ChatId: {item.id}
                  </p>
                </article>
              </div>
            ))}
          </section>
        </div>
      </section>
      <section class="flex flex-col flex-[1_1_75%] bg-violet-300">
        <Chat chatId={chat.selected} userId={payload?.sub} />
      </section>
    </section>
  );
}

export default ChatList;
