import type { QueryApi, ResponseBody } from "@interfaces/index";
import apiService from "./api.service";
import { ApiPath } from "@constant/api.path";
import type { IVoting } from "@interfaces/voting";

class VotingService {
  async getAll(query?: QueryApi) {
    return apiService.get<ResponseBody<IVoting>>(ApiPath.votings, { query });
  }

  async vote(data: { votingId: string; answer: string }) {
    return apiService.post<ResponseBody<IVoting>>(ApiPath.votings, {
      body: data,
    });
  }
}

export default new VotingService();
