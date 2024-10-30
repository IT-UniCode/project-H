import type { QueryApi, ResponseBody } from "@interfaces/index";
import apiService from "./api.service";
import { ApiPath } from "@constant/api.path";
import type { IVoting } from "@interfaces/voting";

class VotingService {
  async getAll(query?: QueryApi) {
    return apiService.get<ResponseBody<IVoting>>(ApiPath.votings, { query });
  }
}

export default new VotingService();