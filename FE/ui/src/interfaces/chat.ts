import type { UserInfo } from "./user";

export interface IChat {
  id: number;
  firstUserId: number;
  firstUser: UserInfo;
  secondUserId: number;
  secondUser: UserInfo;
}
