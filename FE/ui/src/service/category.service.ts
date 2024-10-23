import { ApiPath } from "@constant/api.path";
import apiService from "./api.service";
import type {
  Category,
  Pagination,
  QueryApi,
  ResponseBody,
} from "src/interfaces";

class CategoryService {
  async getAll(query?: QueryApi) {
    return apiService.get<
      ResponseBody<
        Category,
        {
          pagination: Pagination;
        }
      >
    >(ApiPath.categories, { query });
  }
}

export default new CategoryService();
