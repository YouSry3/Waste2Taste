/**
 * API Configuration for ASP.NET Core Backend Integration
 * 
 * Configure your base URL to match your ASP.NET Core API endpoint
 * Example: https://localhost:5001/api or https://yourdomain.com/api
 */

export const API_CONFIG = {
  // Base URL for your ASP.NET Core API
  // Update this to match your backend URL
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://localhost:5001/api',
  
  // API endpoints structure matching ASP.NET Core controllers
  ENDPOINTS: {
    // Auth endpoints
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      REFRESH_TOKEN: '/auth/refresh-token',
      VERIFY_TOKEN: '/auth/verify-token',
    },
    
    // Admin/Moderation endpoints
    ADMIN: {
      DASHBOARD: '/admin/dashboard',
      LISTINGS: '/admin/listings',
      ORDERS: '/admin/orders',
      VENDORS: '/admin/vendors',
      USERS: '/admin/users',
      MAP: '/admin/vendors/map',
      MODERATION: {
        LISTINGS: '/admin/moderation/listings',
        REPORTS: '/admin/moderation/reports',
        VENDOR_REQUESTS: '/admin/moderation/vendor-requests',
      },
    },
    
    // Vendor/Corporate endpoints
    VENDOR: {
      DASHBOARD: '/vendor/dashboard',
      BRANCHES: '/vendor/branches',
      ORDERS: '/vendor/orders',
      LISTINGS: '/vendor/listings',
      ANALYTICS: '/vendor/analytics',
      REPORTS: '/vendor/reports',
      CORPORATE: {
        SUB_ACCOUNTS: '/vendor/corporate/sub-accounts',
        LOCATIONS: '/vendor/corporate/locations',
      },
    },
    
    // Charity endpoints
    CHARITY: {
      DASHBOARD: '/charity/dashboard',
      VERIFICATION_REQUESTS: '/charity/verification-requests',
      APPROVED_USERS: '/charity/approved-users',
      LISTINGS: '/charity/listings',
      ANALYTICS: '/charity/analytics',
    },
  },
  
  // Request timeout in milliseconds
  TIMEOUT: 30000,
  
  // Enable credentials (cookies, authorization headers)
  WITH_CREDENTIALS: true,
};

/**
 * HTTP Methods
 */
export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

/**
 * API Response wrapper matching ASP.NET Core standard response
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
  statusCode?: number;
}

/**
 * Pagination parameters for list endpoints
 */
export interface PaginationParams {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Paginated response from API
 */
export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
