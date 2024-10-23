import { ApiPath } from "@constant/api.path";
import apiService from "./api.service";
import type { Category, Pagination, ResponseBody } from "src/interfaces";

class CategoryService {
  async getAll() {
    return apiService.get<
      ResponseBody<
        Category,
        {
          pagination: Pagination;
        }
      >
    >(`${ApiPath.categories}`);
  }
}

export default new CategoryService();
