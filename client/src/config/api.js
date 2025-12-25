export const API_BASE_URL = __API_URL__;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
  },
  BLOGS: {
    BASE: "/blogs",
    BY_ID: (id) => `/blogs/${id}`,
    USER: "/blogs/user",
  },
};
