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

const normalizeTokenValue = (value: string): string => {
  const trimmed = value.trim().replace(/^"+|"+$/g, "");
  if (!trimmed) return "";
  // Some APIs / code paths may persist "Bearer <token>" in storage; normalize to the raw token.
  if (trimmed.toLowerCase().startsWith("bearer ")) {
    return trimmed.slice("bearer ".length).trim();
  }
  return trimmed;
};

const getStoredAuthToken = (): string | null => {
  try {
    if (typeof window === "undefined") return null;
    const raw =
      localStorage.getItem("authToken") ??
      localStorage.getItem("token") ??
      localStorage.getItem("accessToken");
    if (!raw) return null;
    const normalized = normalizeTokenValue(raw);
    return normalized || null;
  } catch {
    return null;
  }
};

// If the user refreshes the page, re-hydrate the default Authorization header.
const bootToken = getStoredAuthToken();
if (bootToken) {
  apiClient.defaults.headers.common["Authorization"] = `Bearer ${bootToken}`;
}

const isFormData = (value: unknown): value is FormData =>
  typeof FormData !== "undefined" && value instanceof FormData;

// Automatically attach token
export const setAuthToken = (token: string) => {
  const normalized = normalizeTokenValue(token);
  if (!normalized) {
    clearAuthToken();
    try {
      localStorage.removeItem("authToken");
    } catch {
      // ignore
    }
    return;
  }

  apiClient.defaults.headers.common["Authorization"] = `Bearer ${normalized}`;
  try {
    localStorage.setItem("authToken", normalized);
  } catch {
    // ignore (e.g. storage disabled)
  }
};

export const clearAuthToken = () => {
  delete apiClient.defaults.headers.common["Authorization"];
};

// Attach token from localStorage on every request
apiClient.interceptors.request.use((config) => {
  const token = getStoredAuthToken();
  const headers: any = config.headers ?? {};

  if (token) {
    if (typeof headers?.set === "function") {
      headers.set("Authorization", `Bearer ${token}`);
    } else {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  if (import.meta.env.DEV) {
    const url = String(config.url ?? "");
    const isAdminUrl = url.toLowerCase().includes("/admin/");
    if (isAdminUrl) {
      const authHeader =
        typeof headers?.get === "function"
          ? headers.get("Authorization") || headers.get("authorization")
          : headers["Authorization"] || headers["authorization"];
      console.debug(
        `[apiClient] ${String(config.method).toUpperCase()} ${url} auth=${
          authHeader ? "yes" : "no"
        }`,
      );
    }

    if (!token && isAdminUrl) {
      // Avoid logging tokens. This helps debug the common "401 because token missing" case.
      console.warn(`[apiClient] Missing authToken for ${String(config.method).toUpperCase()} ${url}`);
    }
  }

  if (isFormData(config.data)) {
    if (typeof headers?.delete === "function") {
      headers.delete("Content-Type");
      headers.delete("content-type");
    } else {
      delete headers["Content-Type"];
      delete headers["content-type"];
    }
  }

  config.headers = headers;
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
