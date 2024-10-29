import type { BaseDate } from "./base.date";

export interface BaseEntity extends BaseDate {
  id: number;
  documentId: string;
}
