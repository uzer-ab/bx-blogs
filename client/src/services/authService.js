import api from "./api";
import { API_ENDPOINTS } from "../config/api";

export const authService = {
  async login(email, password) {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
      email,
      password,
    });
    const { token, user } = response.data.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    return { token, user };
  },

  async register(name, email, password) {
    const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, {
      name,
      email,
      password,
    });
    return response.data;
  },

  async logout() {
    try {
      await api.get(API_ENDPOINTS.AUTH.LOGOUT);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },

  getStoredUser() {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    return user && token ? { user: JSON.parse(user), token } : null;
  },

  //   isAuthenticated() {
  //     return !!localStorage.getItem("token");
  //   },
};
