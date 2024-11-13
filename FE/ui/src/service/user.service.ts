import type { User } from "src/interfaces";
import apiService from "./api.service";
import { ApiPath } from "@constant/api.path";

class UserService {
  async getProfile() {
    return await apiService.get<User>(ApiPath.userProfile);
  }

  async search(query: string) {
    return await apiService.get<User[]>(ApiPath.userSearch, {
      query: { q: query },
    });
  }
}

export default new UserService();
