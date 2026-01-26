// src/services/api/apiClient.ts
import axios from "axios";
import { API_CONFIG } from "./apiConfig";

const BASE_URL = API_CONFIG.BASE_URL;
console.log("API Base URL:", BASE_URL);
export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: API_CONFIG.WITH_CREDENTIALS,
});

// Token helper functions
export const setAuthToken = (token: string) => {
  apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const clearAuthToken = () => {
  delete apiClient.defaults.headers.common["Authorization"];
};

// Attach token from localStorage automatically on requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers!["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Optional: global response error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      return Promise.reject({
        message: error.response.data.message || error.message,
        statusCode: error.response.status,
        errors: error.response.data.errors || [],
      });
    }
    return Promise.reject(error);
  }
);
