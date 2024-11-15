import { ApiPath } from "@constant/api.path";
import apiService from "./api.service";
import type {
  IChat,
  IChatMessage,
  ResponseBodyList,
  Pagination,
} from "@interfaces/index";

class ChatService {
  async createChat(userId: number) {
    return apiService.post<IChat>(ApiPath.chat, {
      body: { secondUserId: userId },
    });
  }

  async getChats() {
    return apiService.get<IChat[]>(ApiPath.chat);
  }

  async getChatById(chatId: number) {
    return apiService.get<IChat>(`${ApiPath.chat}/${chatId}`);
  }

  async deleteChat(chatId: number) {
    return apiService.delete(`${ApiPath.chat}/${chatId}`);
  }

  async setReadMessage(chatId: number) {
    return apiService.post(`${ApiPath.chat}/${chatId}/read`, { body: {} });
  }

  async sendMessage(chatId: number, message: string) {
    return apiService.post<IChatMessage>(`${ApiPath.chat}/${chatId}/msg`, {
      body: { message },
    });
  }

  async getMessages(
    chatId: number,
    query?: { page?: number; pageSize?: number },
  ) {
    return apiService.get<
      ResponseBodyList<
        IChatMessage,
        { pagination: Pagination; totalUnread: number }
      >
    >(`${ApiPath.chat}/${chatId}/msg`, { query });
  }

  async deleteMessage(chatId: number, msgId: number) {
    return apiService.delete<204>(`${ApiPath.chat}/${chatId}/msg/${msgId}`);
  }
}

export default new ChatService();
