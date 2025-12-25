import api from "./api";
import { API_ENDPOINTS } from "../config/api";

export const blogService = {
  async getBlogs(page = 1, size = 10) {
    const response = await api.get(
      `${API_ENDPOINTS.BLOGS.BASE}?page=${page}&size=${size}`
    );
    return response.data;
  },

  async getUserBlogs(page = 1, size = 10) {
    const response = await api.get(
      `${API_ENDPOINTS.BLOGS.USER}?page=${page}&size=${size}`
    );
    return response.data;
  },

  async getBlogById(id) {
    const response = await api.get(API_ENDPOINTS.BLOGS.BY_ID(id));
    return response.data;
  },

  async createBlog(title, content) {
    const response = await api.post(API_ENDPOINTS.BLOGS.BASE + "/", {
      title,
      content,
    });
    return response.data;
  },

  async updateBlog(id, title, content) {
    const response = await api.put(API_ENDPOINTS.BLOGS.BY_ID(id), {
      title,
      content,
    });
    return response.data;
  },

  async deleteBlog(id) {
    const response = await api.delete(API_ENDPOINTS.BLOGS.BY_ID(id));
    return response.data;
  },
};
