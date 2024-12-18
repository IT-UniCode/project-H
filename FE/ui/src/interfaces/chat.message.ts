export interface IChatMessage {
  id: number;
  chatId: number;
  message: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  unread: boolean;
}
