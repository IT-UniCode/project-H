import { createPortal, useRef, useState } from "preact/compat";
import { useCanvass } from "./useCanvass";
import clsx from "clsx";

function CanvassModal() {
  const container = document.getElementById("root");
  const { show, hideModal } = useCanvass();
  const [state, setState] = useState({ showDetails: false, canvass: false });
  const dialogRef = useRef<HTMLDialogElement>(null);

  function showDialog() {
    dialogRef?.current?.showModal();
    document.body.classList.add("overflow-hidden");
    setState((prev) => ({ ...prev, canvass: true }));
  }

  function hideDialog() {
    dialogRef?.current?.close();
    document.body.classList.remove("overflow-hidden");
    setState((prev) => ({ ...prev, canvass: false }));
  }

  if (!container) throw new Error("Not found container");
  return createPortal(
    show && (
      <section class="fixed flex flex-col right-2 bottom-5 ">
        <article class=" bg-gray-300 px-3 py-2 rounded">
          <button
            onClick={() =>
              setState((prev) => ({ ...prev, showDetails: !prev.showDetails }))
            }
          >
            Would you like to take a survey?
          </button>
          <button
            onClick={hideModal}
            class="ms-1 text-center text-sm text-gray-400 hover:text-black hover:underline"
          >
            hide
          </button>
          <section
            class={clsx(
              "flex flex-col gap-y-2 overflow-hidden transition-all ease-in-out duration-[1s]",
              {
                "max-h-[300px] mt-2": state.showDetails,
                "max-h-0 mt-0": !state.showDetails,
              },
            )}
          >
            <button
              onClick={showDialog}
              class="text-center rounded bg-slate-500 text-white text-lg "
            >
              Voite
            </button>
          </section>
        </article>

        <dialog
          ref={dialogRef}
          class="backdrop:bg-gray-500 backdrop:bg-opacity-40 max-w-xl w-full rounded"
        >
          <section class="flex flex-col py-3 px-2">
            Modal
            <button
              onClick={hideDialog}
              class="bg-gray-300 rounded py-1 text-lg hover:text-black hover:underline"
            >
              Close
            </button>
          </section>
        </dialog>
      </section>
    ),
    container,
  );
}

export default CanvassModal;
