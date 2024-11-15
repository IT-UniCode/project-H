import { useMyContext } from "@components/Chat/useMyContext";
import { addToast, removeToast } from "@components/Toast";
import { useForm } from "@hooks/useForm";
import type { IChatMessage } from "@interfaces/chat.message";
import type { ResponseBodyList } from "@interfaces/response.body.list";
import chatService from "@service/chat.service";
import socketService from "@service/socket.service";
import { useState, useRef, useEffect } from "preact/hooks";

export interface ChatProps {
  class?: string;
  setReadMessage: (chatId: number) => void;
  getChatById: (id: number) => Promise<void>;
}

interface Form {
  message: string;
}

interface Pagination {
  page: number;
  pageSize: number;
}

const pageSize = 30;

export const useChat = () => {
  const { chatId, setReadMessages } = useMyContext();

  const [messages, setMessages] = useState<ResponseBodyList<IChatMessage>>({
    data: [],
    meta: { pagination: { page: 1, pageSize: 1, pageCount: 1, total: 1 } },
  });

  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize,
  });

  const [hasLoadedMore, setHasLoadedMore] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { keys, onSubmit } = useForm<Form>({
    values: {
      message: {},
    },
    async onSubmit(values, context) {
      if (!values.message) return;
      try {
        const res = await chatService.sendMessage(chatId, values.message);
        setMessages((prev) => ({
          ...prev,
          data: [...prev.data, res],
        }));
        setReadMessages(chatId);
        setTimeout(() => {
          const container = containerRef.current;
          if (!container) return;

          container.scrollTop = container.scrollHeight;
        }, 0);
        context.reset();
      } catch (error) {
        addToast({ id: "Message", message: "Sending error", type: "error" });

        setTimeout(() => {
          removeToast("Message");
        }, 3000);
      }
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
            setReadMessages(chatId);
          })();
          setMessages((prev) => ({
            ...prev,
            data: [...prev.data, { ...data, unread: false }],
          }));
        }
        break;
      case "delete":
        setMessages((prev) => ({
          ...prev,
          data: prev.data.filter((item) => item.id !== data.id),
        }));

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
    setPagination({ page: 1, pageSize });
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

    chatId !== 0 && setReadMessages(chatId);
  }, [containerRef.current, chatId]);

  return { keys, onSubmit, containerRef, messages, setMessages };
};
