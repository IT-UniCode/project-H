import apiService from "./api.service";

class AuthService {
  async login(body: { email: string; password: string }) {
    return apiService.post("/auth/login", {
      body,
    });
  }

  async signUp(body: { email: string; password: string; name: string }) {
    return await apiService.post("/auth/sign-up", {
      body,
    });
  }
}

export default new AuthService();
