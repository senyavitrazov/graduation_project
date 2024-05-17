import $api from "../http";

export default class UserService {
  static async getDefects(url) {
    return $api.get(url);
  }

  static async getProjects(url) {
    return $api.get(url);
  }
}
