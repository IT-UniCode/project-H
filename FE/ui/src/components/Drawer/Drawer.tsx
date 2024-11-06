import clsx from "clsx";
import {
  createPortal,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "preact/compat";

export interface DrawerProps {
  open: boolean;
  children: ReactNode;
  class?: string;
  close: () => void;
}

function Drawer({ open, children, class: className, close }: DrawerProps) {
  const container = document.getElementById("root");
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (open) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.classList.add("overflow-hidden");
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      setIsAnimating(true);
    } else {
      document.body.classList.remove("overflow-hidden");
      document.body.style.paddingRight = "";
      setTimeout(() => {
        setIsAnimating(false);
      }, 450);
    }

    return () => clearTimeout(timer);
  }, [open]);

  if (!container) throw new Error("Not found container");

  return createPortal(
    <section
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
      class={clsx(
        "fixed bg-gray-200 bg-opacity-30 w-full h-full rounded z-50",
        {
          "translate-x-full": !isAnimating,
          "translate-x-0 ": isAnimating,
        },
        className,
      )}
    >
      <div
        class={clsx(
          "absolute top-0 right-0 pointer-events-auto max-w-lg w-full h-full bg-white shadow-xl ",
          "transform transition-transform duration-500",
          {
            "translate-x-full": !open,
          },
          className,
        )}
      >
        {children}
      </div>
    </section>,
    container,
  );
}

export default Drawer;
