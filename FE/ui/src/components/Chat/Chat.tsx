import clsx from "clsx";
import { useState } from "preact/compat";

export interface ChatProps {
  chatId: string;
  ownerChatId: string;
  class?: string;
}

function Chat({ chatId, class: className, ownerChatId }: ChatProps) {
  const [messages, setMessages] = useState<any[]>([
    { message: "Hello, this is a chat!", ownerId: "df" },
    { message: "This is a test message!", ownerId: "56" },
    {
      message:
        "This is another test message! It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.",
      ownerId: "df",
    },
  ]);

  return (
    <section
      class={clsx(
        "flex-grow flex flex-col gap-y-2 px-1 py-1 overflow-y-auto",
        className,
      )}
    >
      {messages.map((v) => (
        <article
          class={clsx(
            "flex flex-col bg-gray-200 w-fit px-2 rounded overflow-hidden max-w-[90%]",
            { "ml-auto": v.ownerId === ownerChatId },
          )}
        >
          <p>{v.message}</p>
          <span
            class={clsx("text-xs text-gray-500", {
              "text-end": v.ownerId === ownerChatId,
            })}
          >
            10:30
          </span>
        </article>
      ))}
    </section>
  );
}

export default Chat;
