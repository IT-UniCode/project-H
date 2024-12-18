import type {
  Fundraising,
  FundraisingCategory,
  FundraisingDetails,
  QueryApi,
  ResponseBody,
  ResponseBodyList,
} from "@interfaces/index";
import apiService from "./api.service";
import { ApiPath } from "@constant/api.path";

class FundraisingsService {
  async category(query: QueryApi) {
    return apiService.get<ResponseBodyList<FundraisingCategory>>(
      ApiPath.fundraisingsCategories,
      {
        query,
      },
    );
  }

  async getAll(query: QueryApi) {
    return apiService.get<ResponseBodyList<Fundraising>>(ApiPath.fundraisings, {
      query,
    });
  }

  async get(id: string) {
    return apiService.get<ResponseBody<FundraisingDetails>>(
      `${ApiPath.fundraisings}/${id}`,
    );
  }
}

export default new FundraisingsService();
