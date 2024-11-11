import clsx from "clsx";
import { useState } from "preact/hooks";
import Chat from "./Chat";
import { TextArea } from "@components/TextFields";

export interface ChatListProps {
  class?: string;
}

function ChatList({ class: className }: ChatListProps) {
  const [chat, setChat] = useState<any[]>([]);

  return (
    <section class={clsx("flex max-w-5xl w-full mx-auto", className)}>
      <section class="min-w-[100px] md:min-w-[250px] flex-[1_1_25%] bg-blue-200">
        {chat.map((item) => (
          <div key={item.id}>
            <h3>{item.name}</h3>
            <p>{item.message}</p>
          </div>
        ))}
      </section>
      <section class="flex flex-col flex-[1_1_75%] bg-violet-300">
        <Chat chatId="df" ownerChatId="56" />
        <form class="flex min-h-12 max-h-16 md:min-h-16 md:max-h-20 flex-grow bg-white rounded-t-md overflow-hidden">
          <TextArea class={clsx("rounded-none h-full resize-none")} />
          <div class="bg-gray-300 flex items-center">
            <button class="aspect-square h-10 text-xl">{">"}</button>
          </div>
        </form>
      </section>
    </section>
  );
}

export default ChatList;
