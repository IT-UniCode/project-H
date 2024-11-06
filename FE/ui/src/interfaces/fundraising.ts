import type { Donation } from "./donation";
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

export interface FundraisingDetails {
  id: number;
  documentId: string;
  title: string;
  previewText: string;
  content: string;
  goal_sum: number;
  current_sum: any;
  slug: string;
  state: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  fundraising_category: FundraisingCategory;
  previewImage: string;
  topDonations: Donation[];
}
