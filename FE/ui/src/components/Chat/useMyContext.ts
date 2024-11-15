import type { IChat } from "@interfaces/chat";
import type { IChatMessage } from "@interfaces/chat.message";
import chatService from "@service/chat.service";
import socketService from "@service/socket.service";
import { createContext } from "preact";
import {
  useEffect,
  useState,
  type Dispatch,
  type StateUpdater,
} from "preact/hooks";
import { useAuth } from "@hooks/useAuth";

interface StoreState {
  chats: IChat[];
  chatId: number;
  userId: number;
  name: string;
}

export const Context = createContext<{
  chats: IChat[];
  chatId: number;
  userId: number;
  name: string;
  set: Dispatch<StateUpdater<StoreState>>;
}>({
  chats: [],
  chatId: 0,
  userId: 0,
  name: "",
  set: () => {},
});

export const useMyContext = () => {
  const { payload } = useAuth();

  const [storeValue, setStoreValue] = useState<StoreState>({
    chats: [],
    chatId: 0,
    userId: 0,
    name: "",
  });

  const setReadMessages = async (chatId: number) => {
    await chatService.setReadMessage(chatId);
    getChatById(chatId);
  };

  async function getChats() {
    const res = await chatService.getChats();
    setStoreValue((prev) => ({ ...prev, chats: res }));
  }

  async function getChatById(chatId: number) {
    const res = await chatService.getChatById(chatId);
    const chat = storeValue.chats.find((chat) => chat.id === chatId);

    if (!chat) {
      getChats();
      return;
    }

    setStoreValue((prev) => ({
      ...prev,
      chats: prev.chats.map((oldData) => {
        if (oldData.id === chatId) {
          return res;
        }
        return oldData;
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
          await getChatById(data.chatId);
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

  const handleChat = ({
    detail: { chatId, type },
  }: {
    detail: { chatId: number; type: string };
  }) => {
    switch (type) {
      case "create":
        (async () => {
          const res = await chatService.getChatById(chatId);
          console.log(res);

          setStoreValue((prev) => ({
            ...prev,
            chatId,
            chats: [...prev.chats, res],
          }));
        })();
        break;
      case "delete":
        setStoreValue((prev) => ({
          ...prev,
          chatId: prev.chatId === chatId ? 0 : prev.chatId,
          chats: prev.chats.filter((chat) => chat.id !== chatId),
        }));
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    console.log("connected to socket");

    socketService.addListener("message", handleMessage);
    socketService.addListener("chat", handleChat);

    getChats();

    if (payload) {
      setStoreValue((prev) => ({
        ...prev,
        userId: payload.id,
      }));
    }

    return () => {
      socketService.removeListener("message", handleMessage);
      socketService.removeListener("chat", handleChat);
    };
  }, [payload]);

  return {
    store: storeValue,
    ...storeValue,
    set: setStoreValue,
    payload,
    getChatById,
    getChats,
    setReadMessages,
  };
};
