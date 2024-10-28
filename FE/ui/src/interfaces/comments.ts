export interface IComments {
  id: number;
  content: string;
  documentType: string;
  documentId: string;
  userId: number;
  user: {
    id: number;
    name: string;
  };
  createdAt: string;
}
