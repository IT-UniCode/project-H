import type { BaseEntity } from "./base.entity";

export interface IForum extends BaseEntity {
  title: string;
  userId: number;
  content: string;
  slug: string;
  state: string;
}
