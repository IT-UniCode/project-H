import type { FundraisingCategory } from "./fundraising.category";

export interface Fundraising {
  id: number;
  documentId: string;
  title: string;
  previewText: string;
  slug: string;
  createdAt: string;
  fundraising_category: FundraisingCategory;
  previewImage: string;
}
