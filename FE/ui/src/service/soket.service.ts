import { storageName } from "@constant/storageName";
import { useLocalStorage } from "@helpers/localStorageHelper";
import type { ChatMessage } from "@interfaces/index";
import { io, Socket } from "socket.io-client";

export interface SocketMessageDetail {
  data: ChatMessage;
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
  }

  addListener(
    eventType: string,
    listener: (event: CustomEvent<SocketMessageDetail>) => void,
  ) {
    this.addEventListener(eventType, listener as EventListener);
  }

  removeListener(
    eventType: string,
    listener: (event: CustomEvent<SocketMessageDetail>) => void,
  ) {
    this.removeEventListener(eventType, listener as EventListener);
  }
}

export default new SocketService();
