import { ApiPath } from "@constant/api.path";
import apiService from "./api.service";
import type { IChat, ChatMessage, ResponseBodyList } from "@interfaces/index";

class ChatService {
  async createChat(userId: number) {
    return apiService.post<IChat>(ApiPath.chat, {
      body: { secondUserId: userId },
    });
  }

  async getChats() {
    return apiService.get<IChat[]>(ApiPath.chat);
  }

  async sendMessage(chatId: number, message: string) {
    return apiService.post<ChatMessage>(`${ApiPath.chat}/${chatId}/msg`, {
      body: { message },
    });
  }

  async getMesages(chatId: number) {
    return apiService.get<ResponseBodyList<ChatMessage>>(
      `${ApiPath.chat}/${chatId}/msg`,
    );
  }
}

export default new ChatService();
