import { storageName } from "@constant/storageName";
import { io, Socket } from "socket.io-client";

class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io(import.meta.env.PUBLIC_API_URL, {
      extraHeaders: {
        authorization: `Bearer ${localStorage.getItem(storageName.AccessToken)}`,
      },
    });

    this.socket.on("connect", () => {
      console.log("Connected to the socket server");
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from the socket server");
    });

    this.socket.on("message", (type: string) => {
      console.log("Disconnected from the socket server", type);
    });
  }

  on(event: string, callback: (...args: any[]) => void) {
    this.socket.on(event, callback);
  }

  off(event: string, callback: (...args: any[]) => void) {
    this.socket.off(event, callback);
  }
}

export default new SocketService();
