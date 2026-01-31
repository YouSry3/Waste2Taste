/**
 * ORDERS API SERVICE - READY FOR BACKEND INTEGRATION
 *
 * COMPLETE INSTRUCTIONS FOR AI DEVELOPER:
 *
 * 1. UNCOMMENT AND CONFIGURE AXIOS:
 *    - Import axios
 *    - Set API_BASE_URL from environment variables
 *    - Add authentication headers (JWT tokens)
 *    - Configure request/response interceptors
 *    - Add error handling
 *
 * 2. REPLACE ALL MOCK IMPLEMENTATIONS:
 *    - Remove mock return statements
 *    - Implement actual API calls to your backend
 *    - Match endpoint URLs with your API documentation
 *    - Ensure request/response types match
 *
 * 3. API ENDPOINTS TO IMPLEMENT:
 *    - GET /api/orders             (with filters & pagination)
 *    - GET /api/orders/:id         (single order)
 *    - GET /api/orders/stats       (dashboard statistics)
 *    - PUT /api/orders/:id/status  (update status)
 *    - POST /api/orders/export     (export data)
 *
 * 4. ERROR HANDLING:
 *    - Add try-catch blocks
 *    - Handle 401/403/404/500 errors
 *    - Implement retry logic if needed
 */

import {
  Order,
  OrderFilters,
  OrderStats,
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
  ExportFormat,
} from "../types/orders.types";

// TODO: UNCOMMENT AND CONFIGURE AXIOS FOR YOUR BACKEND
/*
import axios, { AxiosInstance } from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    // TODO: Add authentication header
    // "Authorization": `Bearer ${localStorage.getItem('token')}`
  },
  timeout: 30000,
});

// TODO: Add request interceptor for auth tokens
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// TODO: Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
*/

/**
 * ORDERS API - ALL FUNCTIONS NEED REAL IMPLEMENTATION
 */
export const ordersApi = {
  /**
   * TODO: IMPLEMENT - Fetch orders with filters and pagination
   * Expected API: GET /api/orders
   * Query params: page, limit, status, search, dateRange, etc.
   */
  getOrders: async (
    filters: OrderFilters = {},
    pagination: PaginationParams = { page: 1, limit: 10 },
  ): Promise<ApiResponse<PaginatedResponse<Order>>> => {
    // TODO: Replace with actual API call
    /*
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Order>>>("/orders", {
      params: { ...filters, ...pagination }
    });
    return response.data;
    */

    // MOCK DATA - REMOVE WHEN API IS READY
    console.log("API CALL: getOrders", { filters, pagination });
    return {
      success: true,
      data: {
        data: [], // Empty array for now - AI will populate from API
        pagination: {
          page: pagination.page || 1,
          limit: pagination.limit || 10,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      },
      timestamp: new Date().toISOString(),
    };
  },

  /**
   * TODO: IMPLEMENT - Get single order details
   * Expected API: GET /api/orders/:orderId
   */
  getOrderById: async (orderId: string): Promise<ApiResponse<Order>> => {
    // TODO: Replace with actual API call
    /*
    const response = await apiClient.get<ApiResponse<Order>>(`/orders/${orderId}`);
    return response.data;
    */

    // MOCK DATA - REMOVE WHEN API IS READY
    console.log("API CALL: getOrderById", orderId);
    return {
      success: true,
      data: {} as Order, // AI: Replace with actual order data
      timestamp: new Date().toISOString(),
    };
  },

  /**
   * TODO: IMPLEMENT - Get orders statistics/dashboard data
   * Expected API: GET /api/orders/stats
   * Query params: dateRange, vendorId, etc.
   */
  getOrderStats: async (
    filters?: OrderFilters,
  ): Promise<ApiResponse<OrderStats>> => {
    // TODO: Replace with actual API call
    /*
    const response = await apiClient.get<ApiResponse<OrderStats>>("/orders/stats", {
      params: filters
    });
    return response.data;
    */

    // MOCK DATA - REMOVE WHEN API IS READY
    console.log("API CALL: getOrderStats", filters);
    return {
      success: true,
      data: {
        totalRevenue: 0,
        readyForPickup: 0,
        pendingPickups: 0,
        completedToday: 0,
        avgOrderValue: 0,
        totalOrders: 0,
      },
      timestamp: new Date().toISOString(),
    };
  },

  /**
   * TODO: IMPLEMENT - Update order status
   * Expected API: PUT /api/orders/:orderId/status
   * Body: { status: "completed" }
   */
  updateOrderStatus: async (
    orderId: string,
    status: string,
  ): Promise<ApiResponse<Order>> => {
    // TODO: Replace with actual API call
    /*
    const response = await apiClient.put<ApiResponse<Order>>(
      `/orders/${orderId}/status`,
      { status }
    );
    return response.data;
    */

    // MOCK DATA - REMOVE WHEN API IS READY
    console.log("API CALL: updateOrderStatus", { orderId, status });
    return {
      success: true,
      data: {} as Order,
      message: "Order status updated",
      timestamp: new Date().toISOString(),
    };
  },

  /**
   * TODO: IMPLEMENT - Export orders data
   * Expected API: POST /api/orders/export
   * Body: { format: "csv", filters: {...} }
   * Returns: Blob file
   */
  exportOrders: async (
    format: ExportFormat,
    filters?: OrderFilters,
  ): Promise<Blob> => {
    // TODO: Replace with actual API call
    /*
    const response = await apiClient.post(
      "/orders/export",
      { format, filters },
      { responseType: "blob" }
    );
    return response.data;
    */

    // MOCK DATA - REMOVE WHEN API IS READY
    console.log("API CALL: exportOrders", { format, filters });
    return new Blob(["mock,export,data"], { type: "text/csv" });
  },

  /**
   * TODO: IMPLEMENT - Get vendors list for filters
   * Expected API: GET /api/vendors
   */
  getVendors: async (): Promise<
    ApiResponse<Array<{ id: string; name: string }>>
  > => {
    // TODO: Replace with actual API call
    /*
    const response = await apiClient.get<ApiResponse<Array<{ id: string; name: string }>>>("/vendors");
    return response.data;
    */

    // MOCK DATA - REMOVE WHEN API IS READY
    console.log("API CALL: getVendors");
    return {
      success: true,
      data: [],
      timestamp: new Date().toISOString(),
    };
  },
};

export type OrdersApi = typeof ordersApi;
