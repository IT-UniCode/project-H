import type { FC } from "preact/compat";

interface DeleteModalProps {
  onCancel: () => void;
  onConfirm: () => void;
  name: string;
}

const DeleteModal: FC<DeleteModalProps> = ({ onCancel, onConfirm, name }) => {
  return (
    <div class={"flex flex-col gap-4 py-4 text-xl items-center justify-center"}>
      <h3>Want to delete chat with {name}?</h3>
      <div class={"flex gap-6"}>
        <button
          onClick={onCancel}
          class={"border rounded py-1 px-2 bg-gray-400"}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          class={"border rounded py-1 px-2 bg-red-400"}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default DeleteModal;
