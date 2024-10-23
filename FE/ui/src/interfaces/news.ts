import type { Category } from "./category";

export interface News {
  id: number;
  documentId: string;
  createdAt: string;
  title: string;
  content: string;
  category: Category;
}
