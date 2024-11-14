import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import Chat from "./Chat";
import { TextField } from "@components/TextFields";
import userService from "@service/user.service";
import type { ChatMessage, IChat, User } from "@interfaces/index";
import chatService from "@service/chat.service";
import { useAuth } from "@hooks/useAuth";
import socketService from "@service/socket.service";
import { addToast } from "@components/Toast";

export interface ChatListProps {
  class?: string;
}

interface ChatState {
  selected: number;
  chats: IChat[];
}

function ChatList({ class: className }: ChatListProps) {
  const [chat, setChat] = useState<ChatState>({ selected: 0, chats: [] });
  const [search, setSearch] = useState("");
  const { payload } = useAuth();

  const [users, setUsers] = useState<{ search: User[]; open: boolean }>({
    search: [],
    open: false,
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  async function getChats() {
    const res = await chatService.getChats();

    setChat((prev) => ({ ...prev, chats: res }));
  }

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
    }
  }

  const handleMessage = ({
    detail: { data, type },
  }: {
    detail: {
      type: string;
      data: ChatMessage;
    };
  }) => {
    switch (type) {
      case "create":
        getChats();
        if (chat.selected !== data.chatId) {
          setChat((prev) => ({
            ...prev,
            chats: prev.chats.map((c) =>
              c.id === data.chatId
                ? {
                    ...c,
                    firstUser: {
                      ...c.firstUser,
                      unread:
                        c.firstUserId === payload?.id
                          ? c.firstUser.unread + 1
                          : c.firstUser.unread,
                    },
                    secondUser: {
                      ...c.secondUser,
                      unread:
                        c.secondUserId === payload?.id
                          ? c.secondUser.unread + 1
                          : c.secondUser.unread,
                    },
                    messages: [{ ...c.messages[0] }],
                  }
                : c,
            ),
          }));
        }
        break;
      default:
        break;
    }
  };

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
    socketService.addListener("message", handleMessage);

    getChats();

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      socketService.removeListener("message", handleMessage);
    };
  }, [payload]);

  if (!payload) {
    return <div>Loading...</div>;
  }
  return (
    <section
      class={clsx("flex max-w-5xl w-full mx-auto  max-h-[85vh]", className)}
    >
      <section class="min-w-[100px] md:min-w-[250px] flex-[1_1_25%] bg-gray-100 border">
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
                <div
                  class="min-h-10 mt-2 bg-white shadow-md px-2 py-1 hover:cursor-pointer"
                  onClick={() => {
                    createChat(user.id);
                  }}
                >
                  <h4 class="pointer-events-none">Name: {user.name}</h4>
                  <p class="text-xs text-gray-500 pointer-events-none">
                    Email: {user.email}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div class="overflow-y-auto scroll-smooth">
          <section class="flex flex-col">
            {chat.chats.map((item) => (
              <div
                key={item.id}
                class={clsx(
                  "flex  px-2 py-1 gap-x-2 min-h-16 duration-100 border-black select-none",
                  {
                    "shadow-inner  bg-gray-200": item.id === chat.selected,
                    "bg-white": item.id !== chat.selected,
                  },
                  "border-b ",
                )}
                onClick={() => {
                  setChat((prev) => ({ ...prev, selected: item.id }));
                }}
              >
                <div class="rounded-full bg-gray-400 flex-[1_1_20%] aspect-square h-full my-auto hidden md:block"></div>
                <article class="flex-[2_1_80%]">
                  <div class="flex justify-between">
                    <span>
                      {item.firstUserId !== payload.id
                        ? item.firstUser?.name
                        : item.secondUser?.name}
                    </span>

                    {(item.firstUserId === payload.id
                      ? item.firstUser?.unread || ""
                      : item.secondUser?.unread || "") && (
                      <span
                        class={clsx(
                          "rounded-full aspect-square w-6 text-center bg-blue-100 ",
                        )}
                      >
                        {item.firstUserId === payload.id
                          ? item.firstUser?.unread || ""
                          : item.secondUser?.unread || ""}
                      </span>
                    )}
                  </div>
                  <p>
                    {item.messages &&
                      item.messages[0] &&
                      item.messages[0].message}
                  </p>
                </article>
              </div>
            ))}
          </section>
        </div>
      </section>
      <section class="flex flex-col flex-[1_1_75%] bg-gray-50 border">
        {!!chat.selected && (
          <Chat
            chatId={chat.selected}
            userId={payload?.sub}
            setReadMessage={async (chatId: number) => {
              await chatService.setReadMessage(chatId);
              getChats();
            }}
          />
        )}
      </section>
    </section>
  );
}

export default ChatList;
