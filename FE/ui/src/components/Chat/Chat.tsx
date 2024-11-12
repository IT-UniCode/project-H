import { TextArea } from "@components/TextFields";
import { useForm } from "@hooks/index";
import type { ChatMessage } from "@interfaces/index";
import chatService from "@service/chat.service";
import soketService from "@service/soket.service";
import clsx from "clsx";
import { useEffect, useRef, useState } from "preact/compat";

export interface ChatProps {
  chatId: number;
  userId: number;
  class?: string;
}

interface Form {
  message: string;
}

function Chat({ chatId, class: className, userId }: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { keys, onSubmit } = useForm<Form>({
    values: {
      message: {},
    },
    async onSubmit(values, context) {
      if (!values.message) return;
      const res = await chatService.sendMessage(chatId, values.message);
      setMessages((prev) => [...prev, res]);
      context.reset();
    },
  });

  async function getMessages() {
    const res = await chatService.getMesages(chatId);
    setMessages(res);
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
        if (data.chatId === chatId) {
          setMessages((prev) => [...prev, data]);
        }
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (chatId <= 0) return;
    getMessages();
    soketService.addListener("message", handleMessage);

    return () => {
      soketService.removeListener("message", handleMessage);
    };
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <section class={clsx("flex-grow px-1 py-1 overflow-y-auto ", className)}>
        <div class="flex flex-col gap-y-2">
          {messages.map((v) => (
            <article
              class={clsx("py-1 px-2 rounded overflow-hidden max-w-[90%]", {
                "ml-auto bg-blue-200": v.userId === userId,
                "bg-gray-200 mr-auto": v.userId !== userId,
              })}
            >
              <p>{v.message}</p>
              <span
                class={clsx("text-xs text-gray-500 select-none", {
                  "text-end": v.userId === userId,
                })}
              >
                {new Date(v.createdAt).getHours().toString().padStart(2, "0")}:
                {new Date(v.createdAt).getMinutes().toString().padStart(2, "0")}
              </span>
            </article>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </section>
      <form
        class="flex min-h-16 max-h-16 md:min-h-20 md:h-20 flex-grow bg-white overflow-hidden"
        onSubmit={onSubmit}
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
