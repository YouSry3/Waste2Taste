import { apiClient } from "@/services/api/apiClient";
import { VendorDashboardResponse } from "@/types/vendorDashboard";
import { AxiosError } from "axios";

const getErrorStatus = (error: unknown): number | undefined => {
  const axiosError = error as AxiosError;
  if (axiosError?.response?.status) {
    return axiosError.response.status;
  }

  if (typeof error === "object" && error !== null && "statusCode" in error) {
    const status = (error as { statusCode?: unknown }).statusCode;
    if (typeof status === "number") {
      return status;
    }
  }

  return undefined;
};

export const getVendorDashboard = async (): Promise<VendorDashboardResponse> => {
  const candidateEndpoints = [
    "/api/dashboard/overview",
    "/dashboard/overview",
    "/vendor/dashboard",
    "/Vendor/dashboard",
    "/Vendor/Dashboard",
    "/api/vendor/dashboard",
    "/api/Vendor/dashboard",
    "/api/Vendor/Dashboard",
  ];

  let lastError: unknown;

  for (const endpoint of candidateEndpoints) {
    try {
      const response = await apiClient.get<
        | VendorDashboardResponse
        | { success?: boolean; data?: VendorDashboardResponse }
        | string
      >(endpoint, {
        headers: {
          Accept: "application/json, text/plain",
        },
      });

      let payload:
        | VendorDashboardResponse
        | { success?: boolean; data?: VendorDashboardResponse };

      if (typeof response.data === "string") {
        try {
          payload = JSON.parse(response.data) as VendorDashboardResponse;
        } catch {
          payload = {} as VendorDashboardResponse;
        }
      } else {
        payload = response.data;
      }
      if (
        payload &&
        typeof payload === "object" &&
        "data" in payload &&
        payload.data &&
        "stats" in payload.data
      ) {
        return payload.data;
      }

      if (payload && typeof payload === "object" && "stats" in payload) {
        return payload as VendorDashboardResponse;
      }

      continue;
    } catch (error) {
      lastError = error;

      // If endpoint does not exist, continue to the next route variant.
      if (getErrorStatus(error) === 404) {
        continue;
      }

      throw error;
    }
  }

  throw lastError ?? new Error("Failed to fetch vendor dashboard");
};
