import axios from "axios";

const rawUrl = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api").trim().replace(/\/+$/, "");
export const API_URL = rawUrl.endsWith("/api") ? rawUrl : `${rawUrl}/api`;
export const BASE_SERVER_URL = API_URL.replace(/\/api$/, "");

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;