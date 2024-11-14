import clsx from "clsx";
import type { Dispatch, StateUpdater } from "preact/hooks";
import type { ChatState } from "../../ChatList";
import type { FC } from "preact/compat";
import type { IChat } from "@interfaces/chat";

interface ListProps {
  chats: IChat[];
  setChat: Dispatch<StateUpdater<ChatState>>;
  chatId: number;
  userId: number;
}

const List: FC<ListProps> = ({ chats, setChat, chatId, userId }) => {
  const getShortMessage = (item: IChat) => {
    return `${item.messages[0].userId === userId ? "You: " : ""}${item.messages[0].message.length > 23 ? item.messages[0].message.slice(0, 20) + "..." : item.messages[0].message}`;
  };

  return (
    <div class="overflow-y-auto scroll-smooth">
      <section class="flex flex-col">
        {chats.map((item) => (
          <div
            key={item.id}
            class={clsx(
              "flex  px-2 py-1 gap-x-2 min-h-16 duration-100 border-black select-none",
              {
                "shadow-inner  bg-gray-200": item.id === chatId,
                "bg-white": item.id !== chatId,
              },
              "border-b ",
            )}
            onClick={() => {
              setChat((prev) => ({ ...prev, selected: item.id }));
            }}
          >
            <div class="rounded-full bg-gray-400 flex-[1_1_20%] aspect-square h-full my-auto hidden md:block"></div>
            <article class="flex-[2_1_80%]">
              <div class="flex justify-between">
                <span>
                  {item.firstUserId !== userId
                    ? item.firstUser?.name
                    : item.secondUser?.name}
                </span>

                {(item.firstUserId === userId
                  ? item.firstUser?.unread || ""
                  : item.secondUser?.unread || "") && (
                  <span
                    class={clsx(
                      "rounded-full aspect-square w-6 text-center bg-blue-100 ",
                    )}
                  >
                    {item.firstUserId === userId
                      ? item.firstUser?.unread || ""
                      : item.secondUser?.unread || ""}
                  </span>
                )}
              </div>
              <p>
                {item.messages && item.messages[0] && getShortMessage(item)}
              </p>
            </article>
          </div>
        ))}
      </section>
    </div>
  );
};

export default List;
