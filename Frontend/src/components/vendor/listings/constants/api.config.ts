// src/components/admin/listings/constants/api.config.ts

/**
 * API Configuration
 * TODO: Replace with your actual API base URL when backend is ready
 * AI: When backend is ready, update the baseURL to your production API
 */

// Helper function to get environment variables safely
const getEnvVariable = (key: string, defaultValue: string): string => {
  // Check for Vite environment variables (import.meta.env)
  if (
    typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env[key]
  ) {
    return import.meta.env[key] as string;
  }

  // Check for Node.js/React environment variables (process.env)
  if (typeof process !== "undefined" && process.env && process.env[key]) {
    return process.env[key] as string;
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
  baseURL: getEnvVariable("REACT_APP_API_URL", "http://localhost:3000/api"),
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
    BASE: "/listings",
    BY_ID: (id: number | string) => `/listings/${id}`,
    SEARCH: "/listings/search",
    FILTER: "/listings/filter",
    CATEGORIES: "/listings/categories",
    STATS: "/listings/stats",
  },
  VENDORS: "/vendors", // For vendor dropdown if needed
  CATEGORIES: "/categories", // For categories dropdown
};

// For debugging - log the API config in development
if (getEnvVariable("NODE_ENV", "development") === "development") {
  console.log("API Configuration:", {
    baseURL: API_CONFIG.baseURL,
    env: getEnvVariable("NODE_ENV", "development"),
  });
}
