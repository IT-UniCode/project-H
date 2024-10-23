import { ApiPath } from "@constant/api.path";
import apiService from "./api.service";
import type { News, Pagination, ResponseBody } from "src/interfaces";

class NewsService {
  async getAll() {
    return apiService.get<
      ResponseBody<
        News,
        {
          pagination: Pagination;
        }
      >
    >(ApiPath.news);
  }

  async getById(id: number) {
    return apiService.get<News>(`${ApiPath.news}/${id}`);
  }
}

export default new NewsService();
