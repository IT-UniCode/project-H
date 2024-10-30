import type { BaseEntity } from "./base.entity";

export interface IVoting extends BaseEntity {
  name: string;
  content: string;
  state: string;
  slug: string;
}