// Mock data and functions for development
// IMPORTANT: Remove or disable in production
// Use only for development before backend is ready

import {
  Vendor,
  ApiResponse,
  VendorQueryParams,
  VendorFormData,
} from "./vendors.types";
import { MOCK_VENDORS } from "../constants/vendors.data";

export const simulateDelay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const createMockResponse = <T>(
  endpoint: string,
  method: string,
  data?: any,
): ApiResponse<T> => {
  switch (endpoint) {
    case "vendors":
      if (method === "get") {
        return {
          success: true,
          data: MOCK_VENDORS as T,
          message: "Vendors fetched successfully",
          pagination: {
            page: 1,
            limit: 50,
            total: MOCK_VENDORS.length,
            totalPages: 1,
          },
        };
      }
      break;

    case "vendor":
      if (method === "create") {
        const newVendor = {
          id: Date.now(),
          listings: 0,
          revenue: "$0.00",
          rating: 5.0,
          status: "Active" as const,
          ...data,
        };
        return {
          success: true,
          data: newVendor as T,
          message: "Vendor created successfully",
        };
      }
      break;

    case "stats":
      return {
        success: true,
        data: {
          totalVendors: MOCK_VENDORS.length,
          ngoPartners: MOCK_VENDORS.filter((v) => v.type === "NGO Partner")
            .length,
          activeListings: MOCK_VENDORS.reduce((sum, v) => sum + v.listings, 0),
          totalRevenue: MOCK_VENDORS.reduce(
            (sum, v) => sum + parseFloat(v.revenue.replace(/[$,]/g, "")),
            0,
          ),
          averageRating: Number(
            (
              MOCK_VENDORS.reduce((sum, v) => sum + v.rating, 0) /
              MOCK_VENDORS.length
            ).toFixed(1),
          ),
          activeVendors: MOCK_VENDORS.filter((v) => v.status === "Active")
            .length,
          inactiveVendors: MOCK_VENDORS.filter((v) => v.status === "Inactive")
            .length,
        } as T,
        message: "Statistics fetched successfully",
      };
  }

  return {
    success: true,
    data: {} as T,
    message: "Mock operation successful",
  };
};

// Mock API functions for development
export const mockVendorsApi = {
  async getVendors(params?: VendorQueryParams): Promise<ApiResponse<Vendor[]>> {
    await simulateDelay(800);
    return createMockResponse<Vendor[]>("vendors", "get", params);
  },

  async createVendor(data: VendorFormData): Promise<ApiResponse<Vendor>> {
    await simulateDelay(1000);
    return createMockResponse<Vendor>("vendor", "create", data);
  },
};
