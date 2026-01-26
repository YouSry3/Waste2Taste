// src/services/api/apiClient.ts
import axios from "axios";
import { API_CONFIG } from "./apiConfig";

const BASE_URL = API_CONFIG.BASE_URL;

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: API_CONFIG.WITH_CREDENTIALS,
});

// Attach auth token automatically
export const setAuthToken = (token: string) => {
  apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const clearAuthToken = () => {
  delete apiClient.defaults.headers.common["Authorization"];
};

export const getAuthToken = (): string | null => {
  return (
    apiClient.defaults.headers.common["Authorization"]?.split(" ")[1] || null
  );
};

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response) {
      return Promise.reject({
        message: err.response.data.message || err.message,
        statusCode: err.response.status,
        errors: err.response.data.errors || [],
      });
    }
    return Promise.reject(err);
  }
);
