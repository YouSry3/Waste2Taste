// src/services/api/apiConfig.ts

/**
 * API Configuration for ASP.NET Core Backend Integration
 *
 * Configure your base URL to match your ASP.NET Core API endpoint
 */

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",

  ENDPOINTS: {
    AUTH: {
      LOGIN: "/auth/login",
      REGISTER: "/auth/register",
      LOGOUT: "/auth/logout",
      REFRESH_TOKEN: "/auth/refresh-token",
      VERIFY_TOKEN: "/auth/verify-token",
    },
    ADMIN: {
      DASHBOARD: "/admin/dashboard",
      LISTINGS: "/admin/listings",
      ORDERS: "/admin/orders",
      VENDORS: "/admin/vendors",
      USERS: "/admin/users",
      MAP: "/admin/vendors/map",
      MODERATION: {
        LISTINGS: "/admin/moderation/listings",
        REPORTS: "/admin/moderation/reports",
        VENDOR_REQUESTS: "/admin/moderation/vendor-requests",
      },
    },
    VENDOR: {
      DASHBOARD: "/vendor/dashboard",
      BRANCHES: "/vendor/branches",
      ORDERS: "/vendor/orders",
      LISTINGS: "/vendor/listings",
      ANALYTICS: "/vendor/analytics",
      REPORTS: "/vendor/reports",
      CORPORATE: {
        SUB_ACCOUNTS: "/vendor/corporate/sub-accounts",
        LOCATIONS: "/vendor/corporate/locations",
      },
    },
    CHARITY: {
      DASHBOARD: "/charity/dashboard",
      VERIFICATION_REQUESTS: "/charity/verification-requests",
      APPROVED_USERS: "/charity/approved-users",
      LISTINGS: "/charity/listings",
      ANALYTICS: "/charity/analytics",
    },
  },

  TIMEOUT: 30000,
  WITH_CREDENTIALS: true,
};

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
  statusCode?: number;
}

export interface PaginationParams {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
