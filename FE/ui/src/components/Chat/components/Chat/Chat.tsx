import { TextArea } from "@components/TextFields";
import { useForm } from "@hooks/index";
import type { IChatMessage, ResponseBodyList } from "@interfaces/index";
import chatService from "@service/chat.service";
import socketService from "@service/socket.service";
import clsx from "clsx";
import { useEffect, useRef, useState } from "preact/compat";
import ChatMessage from "./ChatMessage";
import { addToast, removeToast } from "@components/Toast";
import { useMyContext } from "@components/Chat/useMyContext";
import { useChat } from "./useChat";

export interface ChatProps {
  class?: string;
  getChatById: (id: number) => Promise<void>;
}

interface Form {
  message: string;
}

interface Pagination {
  page: number;
  pageSize: number;
}

const pageSize = 30;

function Chat({ class: className, getChatById }: ChatProps) {
  const { chatId } = useMyContext();
  const { keys, onSubmit, containerRef, messages, setMessages } = useChat();

  return (
    <>
      <section
        ref={containerRef}
        class={clsx("flex-grow px-1 py-1 overflow-y-auto ", className)}
      >
        <div class="flex flex-col gap-y-2">
          {messages.data.map((msg) => (
            <ChatMessage
              message={{ ...msg }}
              onDelete={() => {
                setMessages((prev) => ({
                  ...prev,
                  data: prev.data.filter((item) => item.id !== msg.id),
                }));
                getChatById(chatId);
              }}
            />
          ))}
        </div>
      </section>
      <form
        class="flex min-h-16 max-h-16 md:min-h-20 md:h-20 flex-grow bg-white overflow-hidden"
        onSubmit={onSubmit}
        onKeyDown={(event) => {
          event.key === "Enter" && !event.shiftKey && onSubmit(event);
        }}
      >
        <TextArea
          class={clsx("rounded-none h-full resize-none bg-slate-100")}
          name={keys.message}
        />
        <div class="bg-gray-300 flex items-center">
          <button class="aspect-square h-10 text-xl">{">"}</button>
        </div>
      </form>
    </>
  );
}

export default Chat;
