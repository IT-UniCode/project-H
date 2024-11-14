import clsx from "clsx";
import { useEffect, useState } from "preact/hooks";
import Chat from "./components/Chat/Chat";
import type { IChatMessage, IChat } from "@interfaces/index";
import chatService from "@service/chat.service";
import { useAuth } from "@hooks/useAuth";
import socketService from "@service/socket.service";
import Search from "./components/ChatList/Search";
import List from "./components/ChatList/List";

export interface ChatListProps {
  class?: string;
}

export interface ChatState {
  selected: number;
  chats: IChat[];
}

function ChatList({ class: className }: ChatListProps) {
  const [chat, setChat] = useState<ChatState>({ selected: 0, chats: [] });
  const { payload } = useAuth();

  async function getChats() {
    const res = await chatService.getChats();

    setChat((prev) => ({ ...prev, chats: res }));
  }

  const handleMessage = ({
    detail: { type },
  }: {
    detail: {
      type: string;
      data: IChatMessage;
    };
  }) => {
    switch (type) {
      case "create":
        getChats();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    socketService.addListener("message", handleMessage);

    getChats();

    return () => {
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
        <Search setChat={setChat} />
        <List
          setChat={setChat}
          chatId={chat.selected}
          chats={chat.chats}
          userId={payload.id}
        />
      </section>
      <section class="flex flex-col flex-[1_1_75%] bg-gray-50 border">
        {!!chat.selected ? (
          <Chat
            chatId={chat.selected}
            userId={payload?.sub}
            setReadMessage={async (chatId: number) => {
              await chatService.setReadMessage(chatId);
              getChats();
            }}
            onDelete={getChats}
          />
        ) : (
          <section class="flex-grow flex justify-center items-center">
            <p class="text-lg">Select a chat to start a conversation</p>
          </section>
        )}
      </section>
    </section>
  );
}

export default ChatList;
