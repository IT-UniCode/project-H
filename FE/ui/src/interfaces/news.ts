import type { BaseEntity } from ".";
import type { Category } from "./category";

export interface News extends BaseEntity {
  id: number;
  documentId: string;
  createdAt: string;
  title: string;
  content: string;
  category: Category;
}
