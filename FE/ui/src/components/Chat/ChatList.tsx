import clsx from "clsx";
import Chat from "./components/Chat/Chat";
import type { IChat } from "@interfaces/index";
import Search from "./components/ChatList/Search";
import List from "./components/ChatList/List";
import { Context, useMyContext } from "./useMyContext";

export interface ChatListProps {
  class?: string;
}

export interface ChatState {
  selected: number;
  chats: IChat[];
}

function ChatList({ class: className }: ChatListProps) {
  const { store, set, payload, getChatById } = useMyContext();

  const contextValue = { ...store, set };

  if (!payload) {
    return <div>Loading...</div>;
  }
  return (
    <Context.Provider value={contextValue}>
      <section
        class={clsx("flex max-w-5xl w-full mx-auto  max-h-[85vh]", className)}
      >
        <section class="min-w-[100px] md:min-w-[250px] flex-[1_1_25%] bg-gray-100 border">
          <Search />
          <List userId={payload.id} />
        </section>
        <section class="flex flex-col flex-[1_1_75%] bg-gray-50 border">
          {store.chatId !== 0 ? (
            <Chat getChatById={() => getChatById(store.chatId)} />
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
