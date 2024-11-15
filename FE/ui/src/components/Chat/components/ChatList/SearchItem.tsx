import { Context } from "@components/Chat/ChatList";
import { addToast, removeToast } from "@components/Toast";
import chatService from "@service/chat.service";
import { useContext, type FC } from "preact/compat";

interface Props {
  name: string;
  email: string;
  id: number;
  onClick: () => void;
}

const SearchItem: FC<Props> = ({ name, id, email, onClick }) => {
  const { chats, set } = useContext(Context);

  async function createChat(userId: number) {
    try {
      const res = await chatService.createChat(userId);

      set((prev) => ({
        ...prev,
        chats: [...chats, res],
        chatId: res.id,
      }));
    } catch (e) {
      addToast({ id: "Chat", type: "error", message: "can't create" });
      setTimeout(() => {
        removeToast("Chat");
      }, 3000);
    }
  }

  return (
    <div
      class="min-h-10 mt-2 bg-white shadow-md px-2 py-1 hover:cursor-pointer"
      onClick={() => {
        createChat(id);
        onClick();
      }}
    >
      <h4 class="pointer-events-none">Name: {name}</h4>
      <p class="text-xs text-gray-500 pointer-events-none">Email: {email}</p>
    </div>
  );
};

export default SearchItem;
