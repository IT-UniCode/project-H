import type { User } from "@interfaces/user";
import type { FC } from "preact/compat";

interface Props {
  name: string;
  email: string;
  id: number;
  createChat: (id: number) => Promise<void>;
}

const SearchItem: FC<Props> = ({ name, id, email, createChat }) => {
  return (
    <div
      class="min-h-10 mt-2 bg-white shadow-md px-2 py-1 hover:cursor-pointer"
      onClick={() => {
        createChat(id);
      }}
    >
      <h4 class="pointer-events-none">Name: {name}</h4>
      <p class="text-xs text-gray-500 pointer-events-none">Email: {email}</p>
    </div>
  );
};

export default SearchItem;
