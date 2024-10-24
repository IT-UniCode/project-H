import type { BaseEntity } from ".";

export interface Category extends BaseEntity {
  id: number;
  documentId: string;
  name: string;
}
