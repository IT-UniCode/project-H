import { useRef, type ReactNode } from "preact/compat";

export interface AccordionProps {
  children?: ReactNode;
  title: string;
}

const downSVG = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-6 h-6">
        <path fill-rule="evenodd" d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
      </svg>
    `;

const upSVG = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-6 h-6">
        <path fill-rule="evenodd" d="M11.78 9.78a.75.75 0 0 1-1.06 0L8 7.06 5.28 9.78a.75.75 0 0 1-1.06-1.06l3.25-3.25a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06Z" clip-rule="evenodd" />
      </svg>
    `;

function Accordion({ children, title }: AccordionProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);

  function toggleAccordion() {
    if (!contentRef.current || !iconRef.current) return;

    const content = contentRef.current;

    if (content.style.maxHeight && content.style.maxHeight !== "0px") {
      content.style.maxHeight = "0";
      iconRef.current.innerHTML = upSVG;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
      iconRef.current.innerHTML = downSVG;
    }
  }

  return (
    <div class="border-b border-slate-200 ">
      <button
        class="w-full flex justify-between items-center py-3 text-slate-800"
        onClick={toggleAccordion}
      >
        <span>{title}</span>
        <span
          ref={iconRef}
          class="text-slate-800 transition-transform duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            class="w-4 h-4"
          >
            <path
              fill-rule="evenodd"
              d="M11.78 9.78a.75.75 0 0 1-1.06 0L8 7.06 5.28 9.78a.75.75 0 0 1-1.06-1.06l3.25-3.25a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06Z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
      </button>
      <div
        ref={contentRef}
        class="max-h-0 overflow-hidden transition-all duration-300 ease-in-out"
      >
        {children}
      </div>
    </div>
  );
}

export default Accordion;
