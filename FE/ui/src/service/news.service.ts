import { ApiPath } from "@constant/api.path";
import apiService from "./api.service";
import type { News, Pagination, QueryApi, ResponseBody } from "src/interfaces";

class NewsService {
  async getAll(query?: QueryApi) {
    return apiService.get<
      ResponseBody<
        News,
        {
          pagination: Pagination;
        }
      >
    >(ApiPath.news, { query });
  }

  async getById(id: number) {
    return apiService.get<News>(`${ApiPath.news}/${id}`);
  }
}

export default new NewsService();
