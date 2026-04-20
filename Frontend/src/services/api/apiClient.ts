// src/services/api/apiClient.ts
import axios from "axios";
import { API_CONFIG } from "./apiConfig";

const BASE_URL = API_CONFIG.BASE_URL;

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: API_CONFIG.WITH_CREDENTIALS,
});

const isFormData = (value: unknown): value is FormData =>
  typeof FormData !== "undefined" && value instanceof FormData;

// Automatically attach token
export const setAuthToken = (token: string) => {
  apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  localStorage.setItem("authToken", token);
};

export const clearAuthToken = () => {
  delete apiClient.defaults.headers.common["Authorization"];
};

// Attach token from localStorage on every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  const headers = config.headers as any;

  if (token) {
    if (typeof headers?.set === "function") {
      headers.set("Authorization", `Bearer ${token}`);
    } else if (headers) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  if (isFormData(config.data)) {
    if (typeof headers?.delete === "function") {
      headers.delete("Content-Type");
      headers.delete("content-type");
    } else if (headers) {
      delete headers["Content-Type"];
      delete headers["content-type"];
    }
  }

  return config;
});

// Global response error handling
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
  },
);
