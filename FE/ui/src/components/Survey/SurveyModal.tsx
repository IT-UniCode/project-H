import { createPortal, useRef, useState } from "preact/compat";
import { useSurvey } from "./useSurvey";
import SurveyList from "./SurveyList";

function SurveyModal() {
  const container = document.getElementById("root");
  const { show, hideModal } = useSurvey();
  const dialogRef = useRef<HTMLDialogElement>(null);

  function showDialog() {
    dialogRef?.current?.showModal();
    document.body.classList.add("overflow-hidden");
  }

  function hideDialog() {
    dialogRef?.current?.close();
    document.body.classList.remove("overflow-hidden");
  }

  if (!container) throw new Error("Not found container");
  return createPortal(
    show && (
      <section class="fixed flex flex-col right-2 bottom-5 ">
        <article class="bg-gray-300 px-3 py-2 rounded">
          <button class="hover:underline" onClick={showDialog}>
            Would you like to take a survey?
          </button>
          <button
            onClick={hideModal}
            class="ms-1 text-center text-sm text-gray-400 hover:text-black hover:underline"
          >
            hide
          </button>
        </article>

        <dialog
          ref={dialogRef}
          class="backdrop:bg-gray-500 backdrop:bg-opacity-40 max-w-xl w-full rounded"
        >
          <section class="flex flex-col gap-y-4 py-3 px-2">
            <SurveyList />
            <button
              onClick={hideDialog}
              class="bg-gray-300 rounded py-1 text-lg hover:text-black hover:bg-gray-400 duration-300"
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

export default SurveyModal;
