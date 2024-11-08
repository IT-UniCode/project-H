import clsx from "clsx";
import { useState } from "preact/hooks";
import Chat from "./Chat";

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
      <Chat chatId="df" ownerChatId="56" class="flex-[1_1_75%] bg-violet-300" />
    </section>
  );
}

export default ChatList;
