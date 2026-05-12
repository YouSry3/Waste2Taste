// src/components/vendor/reports/api/reports.queries.ts
import { useQuery } from "@tanstack/react-query";
import { reportsApi } from "./reports.api";

export const reportQueryKeys = {
  all: ["reports"] as const,
  vendor: ["reports", "vendor"] as const,
  admin: ["reports", "admin"] as const,
  stats: ["reports", "stats"] as const,
};

export const useVendorReports = () => {
  return useQuery({
    queryKey: reportQueryKeys.vendor,
    queryFn: reportsApi.getVendorReports,
    staleTime: 2 * 60 * 1000,
  });
};

export const useAllReports = () => {
  return useQuery({
    queryKey: reportQueryKeys.admin,
    queryFn: reportsApi.getAllReports,
    staleTime: 1 * 60 * 1000,
  });
};

export const useReportStats = () => {
  return useQuery({
    queryKey: reportQueryKeys.stats,
    queryFn: reportsApi.getReportStats,
    staleTime: 2 * 60 * 1000,
  });
};