import clsx from "clsx";
import type { IChatMessage } from "@interfaces/index";

interface ChatMessageProps {
  message: IChatMessage;
  userId: number;
}

export function ChatMessage({ message, userId }: ChatMessageProps) {
  return (
    <article
      class={clsx("relative py-1 px-2 rounded overflow-hidden max-w-[90%]", {
        "ml-auto bg-blue-200": message.userId === userId,
        "bg-gray-200 mr-auto": message.userId !== userId,
      })}
    >
      <p class="whitespace-pre-line">{message.message}</p>
      <span
        class={clsx("text-xs text-gray-500 select-none ", {
          "text-end": message.userId === userId,
        })}
      >
        {new Date(message.createdAt).getHours().toString().padStart(2, "0")}:
        {new Date(message.createdAt).getMinutes().toString().padStart(2, "0")}{" "}
        {new Date(message.createdAt).toLocaleDateString()}
      </span>
    </article>
  );
}

export default ChatMessage;
