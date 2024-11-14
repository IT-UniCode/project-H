import type { IChatMessage } from "./chat.message";
import type { UserMsgInfo } from "./user";

export interface IChat {
  id: number;
  firstUserId: number;
  firstUser: UserMsgInfo;
  secondUserId: number;
  secondUser: UserMsgInfo;
  messages: IChatMessage[];
}
