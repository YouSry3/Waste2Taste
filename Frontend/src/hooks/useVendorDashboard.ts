// src/hooks/useVendorDashboard.ts

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { vendorDashboardApi } from "../services/vendor/vendorDashboardApi";
import { VendorDashboardResponse } from "../types/vendorDashboard";
import { DEFAULT_QUERY_OPTIONS } from "../config/queryConfig";

// Query keys for cache management
export const vendorDashboardQueryKeys = {
  all: ["vendor-dashboard"] as const,
  overview: () => [...vendorDashboardQueryKeys.all, "overview"] as const,
};

interface UseVendorDashboardOptions {
  enabled?: boolean;
}

/**
 * Hook to fetch vendor dashboard overview data
 */
export const useVendorDashboard = (
  options?: UseVendorDashboardOptions &
    UseQueryOptions<VendorDashboardResponse, Error>,
) => {
  return useQuery<VendorDashboardResponse, Error>({
    queryKey: vendorDashboardQueryKeys.overview(),
    queryFn: () => vendorDashboardApi.getDashboardOverview(),
    ...DEFAULT_QUERY_OPTIONS,
    ...options,
  });
};
