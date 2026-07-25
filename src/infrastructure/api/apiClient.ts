/**
 * Ascend AI — Axios HTTP Client Configuration & JWT Interceptor
 */

import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token to requests
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("ascend_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Automatic JWT Token Refresh on 401 Unauthorized
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("ascend_refresh_token");
        if (refreshToken) {
          const res = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
          if (res.data?.success && res.data?.data?.accessToken) {
            const newToken = res.data.data.accessToken;
            localStorage.setItem("ascend_token", newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return apiClient(originalRequest);
          }
        }
      } catch {
        localStorage.removeItem("ascend_token");
        localStorage.removeItem("ascend_refresh_token");
        if (typeof window !== "undefined") {
          window.location.href = "/auth/login";
        }
      }
    }
    return Promise.reject(error);
  }
);
