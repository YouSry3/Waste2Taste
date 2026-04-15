/**
 * DASHBOARD API SERVICE - TANSTACK QUERY + AXIOS
 *
 * INSTRUCTIONS FOR AI/DEVELOPER:
 * 1. UNCOMMENT axios import when API is ready
 * 2. Set proper API_BASE_URL from environment variables
 * 3. Add authentication interceptors if needed
 * 4. Replace mock returns with actual API calls
 * 5. Add proper error types and validation
 */

import axios, { AxiosInstance } from "axios";
import {
  DashboardStats,
  ChartData,
  RecentOrder,
  ApiResponse,
} from "../types/dashboard.ts";

// TODO: Set your actual API base URL from environment variables
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5199/api";

/**
 * Create axios instance with base configuration
 * AI: Configure this according to your backend requirements
 */
export const createApiClient = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
    timeout: 15000, // 15 seconds timeout
  });

  // TODO: Add request interceptor for authentication
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  // TODO: Add response interceptor for error handling
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      // Handle common errors
      if (error.response?.status === 401) {
        // Redirect to login or refresh token
        window.location.href = "/login";
      }
      return Promise.reject(error);
    },
  );

  return instance;
};

// Export axios instance
export const apiClient = createApiClient();

/**
 * Dashboard API endpoints
 * AI: Replace these mock implementations with actual API calls
 */
export const dashboardApi = {
  // Dashboard Statistics
  getDashboardStats: async (): Promise<ApiResponse<DashboardStats>> => {
    // TODO: Replace with actual API call
    // const response = await apiClient.get<DashboardStats>('/dashboard/stats');
    // return response.data;

    // Mock response (remove when API is ready)
    return {
      success: true,
      data: {
        totalUsers: 1245,
        totalOrders: 342,
        totalRevenue: 45678,
        growthRate: 12.5,
      },
      timestamp: new Date().toISOString(),
    };
  },

  // Revenue Chart Data
  getRevenueData: async (
    timeRange: "weekly" | "monthly" | "yearly" = "monthly",
  ): Promise<ApiResponse<ChartData[]>> => {
    // TODO: Replace with actual API call
    // const response = await apiClient.get<ChartData[]>('/dashboard/revenue', {
    //   params: { range: timeRange }
    // });
    // return response.data;

    // Mock response (remove when API is ready)
    return {
      success: true,
      data: [
        {
          date: "Jan",
          value: 4000,
          category: "revenue",
          label: "January Revenue",
        },
        {
          date: "Feb",
          value: 3000,
          category: "revenue",
          label: "February Revenue",
        },
        {
          date: "Mar",
          value: 5000,
          category: "revenue",
          label: "March Revenue",
        },
      ],
      timestamp: new Date().toISOString(),
    };
  },

  // Recent Orders
  getRecentOrders: async (
    limit: number = 10,
  ): Promise<ApiResponse<RecentOrder[]>> => {
    // TODO: Replace with actual API call
    // const response = await apiClient.get<RecentOrder[]>('/dashboard/orders/recent', {
    //   params: { limit }
    // });
    // return response.data;

    // Mock response (remove when API is ready)
    return {
      success: true,
      data: [
        {
          id: "ORD-001",
          customer: "John Doe",
          email: "john@example.com",
          amount: 299.99,
          status: "completed",
          date: "2024-01-15",
        },
        {
          id: "ORD-002",
          customer: "Jane Smith",
          email: "jane@example.com",
          amount: 150.5,
          status: "processing",
          date: "2024-01-14",
        },
        {
          id: "ORD-003",
          customer: "Bob Johnson",
          email: "bob@example.com",
          amount: 89.99,
          status: "shipped",
          date: "2024-01-13",
        },
      ],
      timestamp: new Date().toISOString(),
    };
  },

  // Export Data
  exportDashboardData: async (
    format: "csv" | "excel" = "csv",
  ): Promise<Blob> => {
    // TODO: Replace with actual API call
    // const response = await apiClient.get('/dashboard/export', {
    //   params: { format },
    //   responseType: 'blob'
    // });
    // return response.data;

    // Mock response (remove when API is ready)
    return new Blob(["mock,data,for,export"], { type: "text/csv" });
  },
};

// Export types for TanStack Query
export type DashboardApi = typeof dashboardApi;
