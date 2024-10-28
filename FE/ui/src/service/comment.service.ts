import { ApiPath } from "@constant/api.path";
import apiService from "./api.service";
import type { IComments } from "src/interfaces";

class CommentService {
  async create({}) {
    return apiService.post<IComments>(ApiPath.comments, { body: {} });
  }

  async getAll(query: { documentType: string; documentId: string }) {
    return apiService.get<IComments[]>(ApiPath.comments, { query });
  }
}

export default new CommentService();
