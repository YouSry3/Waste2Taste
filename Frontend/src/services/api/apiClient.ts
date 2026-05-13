// src/services/api/apiClient.ts
import axios from "axios";
import { API_CONFIG } from "./apiConfig";

const BASE_URL = API_CONFIG.BASE_URL;
console.log(BASE_URL);

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

// ═══════════════════════════════════════════════════════════════════
// TOKEN EXPIRY CHECK — proactive check before every request
// ═══════════════════════════════════════════════════════════════════
const isTokenExpired = (token: string): boolean => {
  try {
    const base64Payload = token.split(".")[1];
    const payload = JSON.parse(atob(base64Payload));
    if (!payload.exp) return false;
    // exp is in seconds, Date.now() is in milliseconds
    return payload.exp * 1000 < Date.now();
  } catch {
    return false;
  }
};

// ═══════════════════════════════════════════════════════════════════
// FORCE LOGOUT — clear everything and redirect to login
// ═══════════════════════════════════════════════════════════════════
const FORCE_LOGOUT_EVENT = "force-logout";

export const forceLogout = (reason?: string) => {
  // Clear auth headers
  delete apiClient.defaults.headers.common["Authorization"];
  // Clear localStorage
  localStorage.removeItem("authToken");
  localStorage.removeItem("token");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  localStorage.removeItem("panelType");
  localStorage.removeItem("userId");
  localStorage.removeItem("vendorRequestId");

  // Dispatch event so React components can react too
  window.dispatchEvent(new CustomEvent(FORCE_LOGOUT_EVENT, { detail: reason }));

  // Immediate redirect (works from any module, no React Router needed)
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
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
    // ignore
  }
};

export const clearAuthToken = () => {
  delete apiClient.defaults.headers.common["Authorization"];
};

// ═══════════════════════════════════════════════════════════════════
// REQUEST INTERCEPTOR — attach token + check expiry proactively
// ═══════════════════════════════════════════════════════════════════
apiClient.interceptors.request.use(
  (config) => {
    const token = getStoredAuthToken();
    const headers: any = config.headers ?? {};

    // Proactive token expiry check
    if (token && isTokenExpired(token)) {
      console.warn("[apiClient] Token expired. Forcing logout.");
      forceLogout("token_expired");
      return Promise.reject(new axios.Cancel("Token expired"));
    }

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
        console.warn(
          `[apiClient] Missing authToken for ${String(config.method).toUpperCase()} ${url}`,
        );
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
  },
  (error) => Promise.reject(error),
);

// ═══════════════════════════════════════════════════════════════════
// RESPONSE INTERCEPTOR — catch 401 and force logout
// ═══════════════════════════════════════════════════════════════════
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check for 401 Unauthorized (token expired or invalid)
    if (error.response?.status === 401) {
      console.warn("[apiClient] 401 Unauthorized — token expired or invalid. Logging out.");
      forceLogout("401_unauthorized");
      return Promise.reject(error);
    }

    // Also handle 403 as potential auth issue
    if (error.response?.status === 403) {
      console.warn("[apiClient] 403 Forbidden — possible token issue.");
    }

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

// Export event name so React components can listen too
export { FORCE_LOGOUT_EVENT };