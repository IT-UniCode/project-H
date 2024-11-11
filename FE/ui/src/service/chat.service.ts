import { ApiPath } from "@constant/api.path";
import apiService from "./api.service";
import type { IChat, ChatMessage } from "@interfaces/index";

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
    return apiService.post<ChatMessage>(`${ApiPath.chatMsg}/${chatId}/msg`, {
      body: { message },
    });
  }

  async getMesages(chatId: number) {
    return apiService.get<ChatMessage[]>(`${ApiPath.chatMsg}/${chatId}/msg`);
  }
}

export default new ChatService();
