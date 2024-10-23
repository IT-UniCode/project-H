import type { User } from "src/interfaces";
import apiService from "./api.service";
import { ApiPath } from "@constant/api.path";

class UserService {
  async getProfile() {
    return await apiService.get<User>(ApiPath.userProfile);
  }
}

export default new UserService();
