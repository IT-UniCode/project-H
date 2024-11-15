import { storageName } from "@constant/storageName";
import { useLocalStorage } from "@helpers/localStorageHelper";
import type { IChatMessage } from "@interfaces/index";
import { io, Socket } from "socket.io-client";

export interface SocketMessageDetail {
  data: IChatMessage;
  type: string;
}

interface SocketChatDetail {
  chatId: number;
  type: string;
}

class SocketService extends EventTarget {
  private socket: Socket;

  constructor() {
    super();

    const { get } = useLocalStorage(storageName.AccessToken);

    this.socket = io(import.meta.env.PUBLIC_API_URL, {
      auth: {
        authorization: `Bearer ${get()}`,
      },
    });

    this.socket.on("connect", () => {});

    this.socket.on("disconnect", () => {});

    this.socket.on("message", (response) => {
      this.dispatchEvent(new CustomEvent("message", { detail: response }));
    });

    this.socket.on("chat", (response) => {
      this.dispatchEvent(new CustomEvent("chat", { detail: response }));
    });
  }

  addListener<T = SocketMessageDetail | SocketChatDetail>(
    eventType: string,
    listener: (event: CustomEvent<T>) => void,
  ) {
    this.addEventListener(eventType, listener as EventListener);
  }

  removeListener<T = SocketMessageDetail | SocketChatDetail>(
    eventType: string,
    listener: (event: CustomEvent<T>) => void,
  ) {
    this.removeEventListener(eventType, listener as EventListener);
  }
}

export default new SocketService();
