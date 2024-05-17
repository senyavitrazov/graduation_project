import $api from "../http";

export default class AuthService {
  static async login(credentials) {
    return $api.post("/login", credentials);
  }

  static async registration(credentials) {
    return $api.post("/registration", credentials);
  }

  static async logout() {
    return $api.post("/logout");
  }
}
