import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import Chat from "./Chat";
import { TextField } from "@components/TextFields";
import userService from "@service/user.service";
import type { ChatMessage, IChat, User } from "@interfaces/index";
import chatService from "@service/chat.service";
import { useAuth } from "@hooks/useAuth";
import soketService from "@service/soket.service";

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
    if (!search) return;
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
    soketService.addListener("message", handleMessage);

    getChats();

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      soketService.removeListener("message", handleMessage);
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
              setSearch(e.target.value);
            }}
            onFocus={() => {
              setUsers((prev) => ({ ...prev, open: true }));
            }}
          />
          {users.open && users.search && (
            <div
              class="absolute top-[100%] left-0 right-0 z-50 min-h-10 mt-2 bg-white shadow-md px-2 py-1"
              onClick={createChat}
            >
              <h4 class="">Name: {users.search?.name}</h4>
              <p class="text-xs text-gray-500">Email: {users.search?.email}</p>
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
                        ? item.firstUser.name
                        : item.secondUser.name}
                    </span>

                    {(item.firstUserId === payload.id
                      ? item.firstUser.unread || ""
                      : item.secondUser.unread || "") && (
                      <span
                        class={clsx(
                          "rounded-full aspect-square w-6 text-center bg-blue-100 ",
                        )}
                      >
                        {item.firstUserId === payload.id
                          ? item.firstUser.unread || ""
                          : item.secondUser.unread || ""}
                      </span>
                    )}
                  </div>
                  <p>{item.messages[0] && item.messages[0].message}</p>
                </article>
              </div>
            ))}
          </section>
        </div>
      </section>
      <section class="flex flex-col flex-[1_1_75%] bg-gray-50 border">
        <Chat
          chatId={chat.selected}
          userId={payload?.sub}
          setReadMessage={async () => {
            const res = await chatService.setReadMessage(chat.selected);
            setChat((prev) => ({
              ...prev,
              chats: prev.chats.map((c) =>
                c.id === chat.selected
                  ? {
                      ...c,
                      firstUser: {
                        ...c.firstUser,
                        unread: 0,
                      },
                      secondUser: {
                        ...c.secondUser,
                        unread: 0,
                      },
                    }
                  : c,
              ),
            }));
          }}
        />
      </section>
    </section>
  );
}

export default ChatList;