// src/services/vendor/vendorDashboardApi.ts

import axios, { AxiosInstance } from "axios";
import { VendorDashboardResponse } from "../../types/vendorDashboard";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5199";

/**
 * Create axios instance with base configuration
 */
export const createVendorApiClient = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
    timeout: 15000,
  });

  // Request interceptor for authentication
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor for error handling
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Handle unauthorized - optionally redirect to login
        console.error("Unauthorized access - please login");
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export const vendorApiClient = createVendorApiClient();

/**
 * Vendor Dashboard API endpoints
 */
export const vendorDashboardApi = {
  /**
   * Get vendor dashboard overview
   */
  getDashboardOverview: async (): Promise<VendorDashboardResponse> => {
    const response = await vendorApiClient.get<VendorDashboardResponse>(
      "/api/dashboard/overview"
    );
    return response.data;
  },
};

export type VendorDashboardApi = typeof vendorDashboardApi;