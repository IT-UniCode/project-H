export interface User {
  id: number;
  name: string;
  email: string;
}

export interface UserMsgInfo extends Pick<User, "name" | "email"> {
  unread: number;
}
