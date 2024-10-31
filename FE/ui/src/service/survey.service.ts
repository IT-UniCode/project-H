import { ApiPath } from "@constant/api.path";
import apiService from "./api.service";
import type { ISurvey, QueryApi, ResponseBody } from "@interfaces/index";

class SurveyService {
  async getAll(query: QueryApi) {
    return apiService.get<ResponseBody<ISurvey>>(ApiPath.surveys, { query });
  }

  async vote(body: { surveyId: string; answers: string[] }) {
    return apiService.post<ResponseBody<ISurvey>>(ApiPath.surveys, { body });
  }
}

export default new SurveyService();
