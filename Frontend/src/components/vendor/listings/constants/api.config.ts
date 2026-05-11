// src/components/admin/listings/constants/api.config.ts

/**
 * API Configuration
 * TODO: Replace with your actual API base URL when backend is ready
 * AI: When backend is ready, update the baseURL to your production API
 */

// Helper function to get Vite environment variables safely
const getEnvVariable = (key: string, defaultValue: string): string => {
  if (
    typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env[key]
  ) {
    return import.meta.env[key] as string;
  }

  // Check for global window variable (if set via window.__ENV)
  if (
    typeof window !== "undefined" &&
    (window as any).__ENV &&
    (window as any).__ENV[key]
  ) {
    return (window as any).__ENV[key];
  }

  return defaultValue;
};

export const API_CONFIG = {
  // Use the helper function to safely get environment variables
  baseURL: getEnvVariable("VITE_API_BASE_URL", "https://localhost:5000"),
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    // TODO: Add authentication token when auth is implemented
    // 'Authorization': `Bearer ${localStorage.getItem('token')}`
  },
};

/**
 * API Endpoints
 * TODO: Update these endpoints to match your actual backend routes
 * AI: Replace these endpoint paths with your actual backend routes
 */
export const API_ENDPOINTS = {
 LISTINGS: {
    BASE: "/api/dashboard/listings",
    BY_ID: (id: string) => `/api/dashboard/listings/${id}`,
    SEARCH: "/api/dashboard/listings",
    FILTER: "/api/dashboard/listings",
    CATEGORIES: "/api/dashboard/listings/categories",
    STATS: "/api/dashboard/listings/stats",
  },

  ORDERS: {
    BASE: "/api/dashboard/orders",
    BY_ID: (id: string) => `/api/dashboard/orders/${id}`,
    UPDATE_STATUS: (id: string) => `/api/dashboard/orders/${id}/status`,
  },
  ANALYTICS: "/api/dashboard/analytics",
  OVERVIEW: "/api/dashboard/overview",
  VENDORS: "/vendors",
  CATEGORIES: "/categories",
};

// For debugging - log the API config in development
if (getEnvVariable("NODE_ENV", "development") === "development") {
  console.log("API Configuration:", {
    baseURL: API_CONFIG.baseURL,
    env: getEnvVariable("NODE_ENV", "development"),
  });
}
