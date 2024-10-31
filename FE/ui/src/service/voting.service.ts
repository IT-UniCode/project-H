import type { QueryApi, ResponseBodyList } from "@interfaces/index";
import apiService from "./api.service";
import { ApiPath } from "@constant/api.path";
import type { IVoting } from "@interfaces/voting";

class VotingService {
  async getAll(query?: QueryApi) {
    return apiService.get<ResponseBodyList<IVoting>>(ApiPath.votings, {
      query,
    });
  }

  async vote(data: { votingId: string; answer: string }) {
    return apiService.post<ResponseBodyList<IVoting>>(ApiPath.votings, {
      body: data,
    });
  }

  async getAnswer(id: string[]) {
    return apiService.get<{ [key: string]: string }>(
      `${ApiPath.votingsAnswers}/${id.join(",")}`,
    );
  }
}

export default new VotingService();
