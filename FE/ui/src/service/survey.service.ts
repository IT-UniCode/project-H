import { ApiPath } from "@constant/api.path";
import apiService from "./api.service";
import type { ISurvey, QueryApi, ResponseBodyList } from "@interfaces/index";

class SurveyService {
  async getAll(query: QueryApi) {
    return apiService.get<ResponseBodyList<ISurvey>>(ApiPath.surveys, {
      query,
    });
  }

  async vote(body: { surveyId: string; answers: string[] }) {
    return apiService.post<ResponseBodyList<ISurvey>>(ApiPath.surveys, {
      body,
    });
  }
}

export default new SurveyService();
