import type { User } from "src/interfaces";
import apiService from "./api.service";

class UserService {
  async getProfile() {
    return await apiService.get<User>("/user/profile");
  }
}

export default new UserService();
