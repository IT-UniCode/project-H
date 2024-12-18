import { ApiPath } from "@constant/api.path";
import apiService from "./api.service";
import type { IComments, ResponseBodyList } from "src/interfaces";

class CommentService {
  async create(body: {
    documentId: string;
    content: string;
    documentType: string;
  }) {
    return apiService.post<IComments>(ApiPath.comments, { body });
  }

  async getAll(query: {
    documentType: string;
    documentId: string;
    page?: number;
    pageSize?: number;
  }) {
    return apiService.get<ResponseBodyList<IComments>>(ApiPath.comments, {
      query,
    });
  }
}

export default new CommentService();
