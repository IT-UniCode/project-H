import clsx from "clsx";
import type { IChatMessage } from "@interfaces/index";
import chatService from "@service/chat.service";

interface ChatMessageProps {
  message: IChatMessage;
  userId: number;
  onDelete: () => void;
}

export function ChatMessage({ message, userId, onDelete }: ChatMessageProps) {
  return (
    <article
      class={clsx("py-1 px-2 rounded overflow-hidden max-w-[85%] flex", {
        "ml-auto bg-blue-200": message.userId === userId,
        "bg-gray-200 mr-auto": message.userId !== userId,
      })}
    >
      <div class={clsx({ hidden: message.userId !== userId })}>
        <button
          onClick={async () => {
            await chatService.deleteMessage(message.chatId, message.id);
            onDelete();
          }}
          class={
            "text-rose-700 text-lg h-6 mr-2 mt-2 flex items-center justify-center opacity-70 hover:opacity-100"
          }
        >
          &times;
        </button>
      </div>
      <div>
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
      </div>
    </article>
  );
}

export default ChatMessage;
