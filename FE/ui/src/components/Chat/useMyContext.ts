import type { IChat } from "@interfaces/chat";
import type { IChatMessage } from "@interfaces/chat.message";
import chatService from "@service/chat.service";
import socketService from "@service/socket.service";
import { createContext } from "preact";
import {
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type StateUpdater,
} from "preact/hooks";
import { useAuth } from "@hooks/useAuth";
import type { JwtPayload } from "@interfaces/jwt.payload";

interface StoreState {
  chats: IChat[];
  chatId: number;
  userId: number;
  name: string;

  getChatById: (chatId: number) => Promise<void>;
  getChats: () => Promise<void>;
  setReadMessages: (chatId: number) => Promise<void>;
  usePayload: () => JwtPayload | null;
}

export const Context = createContext<{
  chats: IChat[];
  chatId: number;
  userId: number;
  name: string;
  getChats: () => Promise<void>;
  getChatById: (chatId: number) => Promise<void>;
  usePayload: () => JwtPayload | null;
  setReadMessages: (chatId: number) => Promise<void>;
  set: Dispatch<StateUpdater<StoreState>>;
}>({
  chats: [],
  chatId: 0,
  userId: 0,
  name: "",
  set: () => {},
  getChatById: () => Promise.resolve(),
  getChats: () => Promise.resolve(),
  setReadMessages: () => Promise.resolve(),
  usePayload: () => null,
});

export const value = () => {
  const [store, set] = useState<StoreState>({
    chats: [],
    chatId: 0,
    userId: 0,
    name: "",
    getChatById,
    getChats,
    setReadMessages,
    usePayload,
  });

  const [payload, setPayload] = useState<JwtPayload | null>(null);

  function usePayload() {
    const { payload } = useAuth();
    setPayload(payload);
    return payload;
  }

  async function setReadMessages(chatId: number) {
    await chatService.setReadMessage(chatId);
    getChatById(chatId);
  }

  async function getChats() {
    const res = await chatService.getChats();
    set((prev) => ({ ...prev, chats: res }));
  }

  async function getChatById(chatId: number) {
    const res = await chatService.getChatById(chatId);
    const chat = store.chats.find((chat) => chat.id === chatId);

    if (!chat) {
      getChats();
      return;
    }

    set((prev) => ({
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

          set((prev) => ({
            ...prev,
            // chatId,
            chats: [...prev.chats, res],
          }));
        })();
        break;
      case "delete":
        set((prev) => ({
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
    socketService.addListener("message", handleMessage);
    socketService.addListener("chat", handleChat);

    getChats();

    if (payload) {
      set((prev) => ({
        ...prev,
        userId: payload!.id,
      }));
    }

    return () => {
      socketService.removeListener("message", handleMessage);
      socketService.removeListener("chat", handleChat);
    };
  }, [payload]);

  return {
    ...store,
    set,
  };
};

export const useMyContext = () => useContext(Context);
