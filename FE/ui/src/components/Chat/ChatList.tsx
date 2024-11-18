import clsx from "clsx";
import Chat from "./components/Chat/Chat";
import type { IChat } from "@interfaces/index";
import Search from "./components/ChatList/Search";
import List from "./components/ChatList/List";
import { Context, useMyContext, value } from "./useMyContext";
import { useAuth } from "@hooks/useAuth";
import type React from "preact/compat";
import { useEffect } from "preact/compat";

export interface ChatListProps {
  class?: string;
}

export interface ChatState {
  selected: number;
  chats: IChat[];
}

function ChatList({ class: className }: ChatListProps) {
  const { chatId, usePayload, getChatById } = useMyContext();

  const payload = usePayload();

  if (!payload) {
    return <div>Loading...</div>;
  }

  return (
    <section
      class={clsx("flex max-w-5xl w-full mx-auto  max-h-[85vh]", className)}
    >
      <section class="min-w-[100px] md:min-w-[250px] flex-[1_1_25%] bg-gray-100 border">
        <Search />
        <List userId={payload.id} />
      </section>
      <section class="flex flex-col flex-[1_1_75%] bg-gray-50 border">
        {chatId !== 0 ? (
          <Chat getChatById={() => getChatById(chatId)} />
        ) : (
          <section class="flex-grow flex justify-center items-center">
            <p class="text-lg">Select a chat to start a conversation</p>
          </section>
        )}
      </section>
    </section>
  );
}

function WithProvider(Component: React.ElementType) {
  return function WrappedComponent(props: any) {
    return (
      <Context.Provider value={value()}>
        <Component {...props} />
      </Context.Provider>
    );
  };
}

export default WithProvider(ChatList);
