import { ApiPath } from "@constant/api.path";
import apiService from "./api.service";
import type { Comments } from "src/interfaces";

class CommentService {
  async create() {}

  async getAll(query: { documentType: string; documentId: string }) {
    return apiService.get<Comments[]>(ApiPath.comments, { query });
  }
}

export default new CommentService();
