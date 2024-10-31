import { ApiPath } from "@constant/api.path";
import apiService from "./api.service";
import type {
  IForum,
  QueryApi,
  ResponseBody,
  ResponseBodyList,
} from "@interfaces/index";

class ForumService {
  async create(body: { title: string; content: string }) {
    return apiService.post(ApiPath.forums, { body });
  }

  async getAll(query: QueryApi) {
    return apiService.get<ResponseBodyList<IForum>>(ApiPath.forums, { query });
  }

  async getById(id: string) {
    return apiService.get<ResponseBody<IForum>>(`${ApiPath.forums}/${id}`);
  }
}

export default new ForumService();
