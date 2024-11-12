export interface User {
  id: number;
  name: string;
  email: string;
}

export interface UserInfo extends Pick<User, "name" | "email"> {}
