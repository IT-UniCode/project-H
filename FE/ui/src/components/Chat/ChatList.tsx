import clsx from "clsx";
import {
  useContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type StateUpdater,
} from "preact/hooks";
import Chat from "./components/Chat/Chat";
import type { IChatMessage, IChat } from "@interfaces/index";
import chatService from "@service/chat.service";
import { useAuth } from "@hooks/useAuth";
import socketService from "@service/socket.service";
import Search from "./components/ChatList/Search";
import List from "./components/ChatList/List";
import { createContext } from "preact";

export interface ChatListProps {
  class?: string;
}

export interface ChatState {
  selected: number;
  chats: IChat[];
}
export const Context = createContext<{
  chats: IChat[];
  chatId: number;
  userId: number;
  set: Dispatch<
    StateUpdater<{ chats: IChat[]; chatId: number; userId: number }>
  >;
}>({
  chats: [],
  chatId: 0,
  userId: 0,
  set: () => {},
});
function ChatList({ class: className }: ChatListProps) {
  const { payload } = useAuth();

  const [storeValue, setStoreValue] = useState<{
    chats: IChat[];
    chatId: number;
    userId: number;
  }>({
    chats: [],
    chatId: 0,
    userId: 0,
  });

  const store = { ...storeValue, set: setStoreValue };

  async function getChats() {
    const res = await chatService.getChats();
    setStoreValue((prev) => ({ ...prev, chats: res }));
  }

  async function getChatById(chatId: number) {
    const res = await chatService.getChatById(chatId);
    setStoreValue((prev) => ({
      ...prev,
      chats: prev.chats.map((chat) => {
        if (chat.id === chatId) {
          return res;
        }
        return chat;
      }),
    }));
  }

  const handleMessage = ({
    detail: { data, type },
  }: {
    detail: {
      type: string;
      data: IChatMessage;
    };
  }) => {
    switch (type) {
      case "create":
        (async () => {
          getChatById(data.chatId);
        })();
        break;
      case "delete":
        (async () => {
          getChatById(data.chatId);
        })();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    socketService.addListener("message", handleMessage);

    getChats();

    if (payload) {
      setStoreValue((prev) => ({
        ...prev,
        userId: payload.id,
      }));
    }

    return () => {
      socketService.removeListener("message", handleMessage);
    };
  }, [payload]);

  if (!payload) {
    return <div>Loading...</div>;
  }
  return (
    <Context.Provider value={store}>
      <section
        class={clsx("flex max-w-5xl w-full mx-auto  max-h-[85vh]", className)}
      >
        <section class="min-w-[100px] md:min-w-[250px] flex-[1_1_25%] bg-gray-100 border">
          <Search />
          <List userId={payload.id} />
        </section>
        <section class="flex flex-col flex-[1_1_75%] bg-gray-50 border">
          {storeValue.chatId !== 0 ? (
            <Chat
              setReadMessage={async (chatId: number) => {
                await chatService.setReadMessage(chatId);
                getChatById(chatId);
              }}
              getChatById={getChatById}
            />
          ) : (
            <section class="flex-grow flex justify-center items-center">
              <p class="text-lg">Select a chat to start a conversation</p>
            </section>
          )}
        </section>
      </section>
    </Context.Provider>
  );
}

export default ChatList;
