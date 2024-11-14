import { TextArea } from "@components/TextFields";
import { useForm } from "@hooks/index";
import type { IChatMessage, ResponseBodyList } from "@interfaces/index";
import chatService from "@service/chat.service";
import socketService from "@service/socket.service";
import clsx from "clsx";
import { useEffect, useRef, useState } from "preact/compat";
import ChatMessage from "./ChatMessage";

export interface ChatProps {
  chatId: number;
  userId: number;
  class?: string;
  setReadMessage: (chatId: number) => void;
  onDelete: () => Promise<void>;
}

interface Form {
  message: string;
}

interface Pagination {
  page: number;
  pageSize: number;
}

function Chat({
  chatId,
  class: className,
  userId,
  setReadMessage,
  onDelete,
}: ChatProps) {
  const [messages, setMessages] = useState<ResponseBodyList<IChatMessage>>({
    data: [],
    meta: { pagination: { page: 1, pageSize: 1, pageCount: 1, total: 1 } },
  });

  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 30,
  });

  const [hasLoadedMore, setHasLoadedMore] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { keys, onSubmit } = useForm<Form>({
    values: {
      message: {},
    },
    async onSubmit(values, context) {
      if (!values.message) return;
      const res = await chatService.sendMessage(chatId, values.message);
      setMessages((prev) => ({
        ...prev,
        data: [...prev.data, res],
      }));
      setReadMessage(chatId);
      setTimeout(() => {
        const container = containerRef.current;
        if (!container) return;

        container.scrollTop = container.scrollHeight;
      }, 0);
      context.reset();
    },
  });

  async function getMessages(
    options: { load?: boolean; default?: boolean } = {},
  ) {
    const chatContainer = containerRef.current;
    if (!chatContainer) return;

    const pages = Math.ceil(
      messages.meta.pagination.total / pagination.pageSize,
    );
    const nextPage =
      pages >= pagination.page + 1 ? pagination.page + 1 : pagination.page;

    if (pages < pagination.page + 1 && options?.default !== true) {
      return;
    }

    const res = await chatService.getMessages(
      chatId,
      options?.default === true
        ? { page: 1, pageSize: pagination.pageSize * pagination.page }
        : {
            page: options?.load ? nextPage : pagination.page,
            pageSize: pagination.pageSize,
          },
    );

    const currentScrollHeight = chatContainer.scrollHeight;
    const currentScrollTop = chatContainer.scrollTop;
    setMessages((prev) => ({
      ...prev,
      data: [...res.data.reverse(), ...prev.data],
      meta: res.meta,
    }));

    setPagination((prev) => ({
      ...prev,
      page: res.meta.pagination.page,
      pageSize: prev.pageSize,
    }));

    setTimeout(() => {
      if (!options?.default) {
        const newScrollHeight = chatContainer.scrollHeight;
        chatContainer.scrollTop =
          newScrollHeight - currentScrollHeight + currentScrollTop;
      } else {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }

      setHasLoadedMore(false);
    }, 0);
  }

  const handleMessage = async ({
    detail: { data, type },
  }: {
    detail: {
      type: string;
      data: IChatMessage;
    };
  }) => {
    switch (type) {
      case "create":
        setTimeout(() => {
          const container = containerRef.current;
          if (!container) return;

          container.scrollTop = container.scrollHeight;
        }, 0);

        if (data.chatId === chatId) {
          (async () => {
            setReadMessage(chatId);
          })();
          setMessages((prev) => ({
            ...prev,
            data: [...prev.data, { ...data, unread: false }],
          }));
        }
        break;
      default:
        break;
    }
  };

  function handleScroll() {
    const container = containerRef.current;
    if (!container) return;

    if (container.scrollTop < container.scrollHeight * 0.01 && !hasLoadedMore) {
      setHasLoadedMore(true);
      getMessages({ load: true });
    }
  }

  useEffect(() => {
    if (chatId <= 0) return;
    setMessages({
      data: [],
      meta: { pagination: { page: 1, pageSize: 1, pageCount: 1, total: 1 } },
    });
    setPagination({ page: 1, pageSize: 30 });
    setHasLoadedMore(false);

    setTimeout(() => {
      getMessages({ default: true });
    }, 0);

    socketService.addListener("message", handleMessage);

    return () => {
      socketService.removeListener("message", handleMessage);
    };
  }, [chatId]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [hasLoadedMore, containerRef.current, chatId, messages]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.scrollTop = container.scrollHeight;

    setReadMessage(chatId);
  }, [containerRef.current, chatId]);

  return (
    <>
      <section
        ref={containerRef}
        class={clsx("flex-grow px-1 py-1 overflow-y-auto ", className)}
      >
        <div class="flex flex-col gap-y-2">
          {messages.data.map((msg) => (
            <ChatMessage
              message={{ ...msg }}
              userId={userId}
              onDelete={() => {
                onDelete();
              }}
            />
          ))}
        </div>
      </section>
      <form
        class="flex min-h-16 max-h-16 md:min-h-20 md:h-20 flex-grow bg-white overflow-hidden"
        onSubmit={onSubmit}
      >
        <TextArea
          class={clsx("rounded-none h-full resize-none bg-slate-100")}
          name={keys.message}
        />
        <div class="bg-gray-300 flex items-center">
          <button class="aspect-square h-10 text-xl">{">"}</button>
        </div>
      </form>
    </>
  );
}

export default Chat;
