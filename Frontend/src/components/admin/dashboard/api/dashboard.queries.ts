/**
 * DASHBOARD TANSTACK QUERY HOOKS
 *
 * INSTRUCTIONS FOR AI/DEVELOPER:
 * 1. Configure QueryClient in your App.tsx or main.tsx
 * 2. Adjust staleTime, cacheTime based on data freshness requirements
 * 3. Add proper error handling in components
 * 4. Implement optimistic updates if needed
 * 5. Add pagination/infinite query for large datasets
 */

import {
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { dashboardApi } from "./dashboard.api";
import {
  DashboardStats,
  ChartData,
  RecentOrder,
  ApiResponse,
} from "../types/dashboard.ts";

// Query keys for cache management
export const dashboardQueryKeys = {
  all: ["dashboard"] as const,
  stats: () => [...dashboardQueryKeys.all, "stats"] as const,
  revenue: (range: string) =>
    [...dashboardQueryKeys.all, "revenue", range] as const,
  recentOrders: (limit: number) =>
    [...dashboardQueryKeys.all, "orders", "recent", limit] as const,
};

/**
 * Hook to fetch dashboard statistics
 * AI: Adjust staleTime based on how often stats update
 */
export const useDashboardStats = (
  options?: UseQueryOptions<ApiResponse<DashboardStats>>,
) => {
  return useQuery<ApiResponse<DashboardStats>>({
    queryKey: dashboardQueryKeys.stats(),
    queryFn: () => dashboardApi.getDashboardStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes (adjust based on requirements)
    gcTime: 10 * 60 * 1000, // 10 minutes cache time
    retry: 2,
    ...options,
  });
};

/**
 * Hook to fetch revenue chart data
 * AI: Consider implementing time range selector in UI
 */
export const useRevenueData = (
  timeRange: "weekly" | "monthly" | "yearly" = "monthly",
  options?: UseQueryOptions<ApiResponse<ChartData[]>>,
) => {
  return useQuery<ApiResponse<ChartData[]>>({
    queryKey: dashboardQueryKeys.revenue(timeRange),
    queryFn: () => dashboardApi.getRevenueData(timeRange),
    staleTime: 2 * 60 * 1000, // 2 minutes for chart data
    ...options,
  });
};

/**
 * Hook to fetch recent orders
 * AI: Add pagination if orders list is large
 */
export const useRecentOrders = (
  limit: number = 10,
  options?: UseQueryOptions<ApiResponse<RecentOrder[]>>,
) => {
  return useQuery<ApiResponse<RecentOrder[]>>({
    queryKey: dashboardQueryKeys.recentOrders(limit),
    queryFn: () => dashboardApi.getRecentOrders(limit),
    staleTime: 1 * 60 * 1000, // 1 minute for recent orders
    ...options,
  });
};

/**
 * Prefetch dashboard data for better UX
 * AI: Call this on page load or navigation
 */
export const usePrefetchDashboardData = () => {
  const queryClient = useQueryClient();

  const prefetchAll = async () => {
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: dashboardQueryKeys.stats(),
        queryFn: () => dashboardApi.getDashboardStats(),
      }),
      queryClient.prefetchQuery({
        queryKey: dashboardQueryKeys.revenue("monthly"),
        queryFn: () => dashboardApi.getRevenueData("monthly"),
      }),
    ]);
  };

  return { prefetchAll };
};
