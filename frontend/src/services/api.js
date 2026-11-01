import axios from "axios";

export const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/v1",
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    // If Unauthorized and user had a token, it might be expired
    if (error.response && error.response.status === 401) {
      const isAuthRequest = error.config.url.includes("/login") || error.config.url.includes("/register");
      if (!isAuthRequest) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        if (window.location.pathname !== "/" && window.location.pathname !== "/signup") {
          window.location.href = "/";
        }
      }
    }
    return Promise.reject(error);
  }
);