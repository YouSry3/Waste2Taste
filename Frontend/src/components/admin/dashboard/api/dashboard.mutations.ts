/**
 * DASHBOARD TANSTACK QUERY MUTATIONS
 *
 * INSTRUCTIONS FOR AI/DEVELOPER:
 * 1. Add proper error handling and validation
 * 2. Implement optimistic updates for better UX
 * 3. Add success/error toasts/notifications
 * 4. Invalidate queries to refresh data after mutations
 * 5. Add proper TypeScript types for mutation variables
 */

import {
  useMutation,
  useQueryClient,
  UseMutationOptions,
} from "@tanstack/react-query";
import { dashboardApi } from "./dashboard.api";
import { dashboardQueryKeys } from "./dashboard.queries";
import { ExportFormat, DashboardFilterParams } from "../types/dashboard.ts";

/**
 * Hook to export dashboard data
 * AI: Implement file download logic in onSuccess
 */
export const useExportDashboardData = (
  options?: UseMutationOptions<Blob, Error, ExportFormat>,
) => {
  const queryClient = useQueryClient();

  return useMutation<Blob, Error, ExportFormat>({
    mutationFn: (format) => dashboardApi.exportDashboardData(format),
    onSuccess: (data, variables) => {
      // TODO: Implement file download logic
      // Example:
      // const url = window.URL.createObjectURL(data);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = `dashboard-export.${variables}`;
      // a.click();

      // Invalidate queries if needed
      queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.all });
    },
    onError: (error) => {
      // TODO: Show error toast/notification
      console.error("Export failed:", error);
    },
    ...options,
  });
};

/**
 * Hook to refresh dashboard data manually
 * AI: Call this from a refresh button in UI
 */
export const useRefreshDashboardData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // This is a manual refresh, no API call needed
      return Promise.resolve();
    },
    onSuccess: () => {
      // Invalidate all dashboard queries to force refetch
      queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.all });

      // TODO: Show success toast
      console.log("Dashboard data refreshed");
    },
  });
};

/**
 * Hook to update dashboard filter preferences
 * AI: Connect this to filter/settings UI components
 */
export const useUpdateDashboardFilters = (
  options?: UseMutationOptions<void, Error, DashboardFilterParams>,
) => {
  return useMutation<void, Error, DashboardFilterParams>({
    mutationFn: async (filters) => {
      // TODO: Replace with actual API call to save user preferences
      // await apiClient.post('/user/preferences/dashboard-filters', filters);

      // For now, just save to localStorage
      localStorage.setItem("dashboardFilters", JSON.stringify(filters));
      return Promise.resolve();
    },
    onSuccess: () => {
      // TODO: Show success toast
      console.log("Filters updated successfully");
    },
    // Optimistic update example:
    // onMutate: async (newFilters) => {
    //   // Cancel outgoing refetches
    //   await queryClient.cancelQueries({ queryKey: dashboardQueryKeys.all });

    //   // Snapshot previous value
    //   const previousFilters = queryClient.getQueryData(dashboardQueryKeys.all);

    //   // Optimistically update to new value
    //   queryClient.setQueryData(dashboardQueryKeys.all, newFilters);

    //   return { previousFilters };
    // },
    // onError: (err, newFilters, context) => {
    //   // Rollback on error
    //   queryClient.setQueryData(dashboardQueryKeys.all, context?.previousFilters);
    // },
    ...options,
  });
};

/**
 * Hook to manually refresh specific dashboard data
 * AI: Useful for admin override or real-time updates
 */
export const useManualDataRefresh = () => {
  const queryClient = useQueryClient();

  const refreshStats = () => {
    queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.stats() });
  };

  const refreshRevenue = (range: string) => {
    queryClient.invalidateQueries({
      queryKey: dashboardQueryKeys.revenue(range),
    });
  };

  const refreshOrders = () => {
    queryClient.invalidateQueries({
      queryKey: dashboardQueryKeys.recentOrders(10),
    });
  };

  return { refreshStats, refreshRevenue, refreshOrders };
};
