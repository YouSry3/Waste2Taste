import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../services/api/apiClient";
import { statsData } from "../components/admin/dashboard/constants/statsData";
import { monthlyData } from "../components/admin/dashboard/constants/monthlyData";
import { categoryData } from "../components/admin/dashboard/constants/categoryData";

export interface DashboardSummary {
  totalRevenue: number;
  activeUsers: number;
  vendors: number;
  ordersLastDays: number;
  revenueGrowthPercentage: number;
  userGrowthPercentage: number;
  vendorGrowthPercentage: number;
  orderGrowthPercentage: number;
}

export interface DashboardTrend {
  month?: string;
  label?: string;
  date?: string;
  revenue?: number;
  orders?: number;
  users?: number;
}

export interface DashboardCategory {
  name: string;
  value?: number;
  listings?: number;
  count?: number;
  revenue?: number;
  color?: string;
}

export interface DashboardData {
  summary: DashboardSummary;
  trends: DashboardTrend[];
  categories: DashboardCategory[];
}

export interface DashboardResponse {
  data: DashboardData;
}

const parseNumber = (value: string): number =>
  Number(value.replace(/[^\d.-]/g, "")) || 0;

const getDefaultSummary = (): DashboardSummary => ({
  totalRevenue: parseNumber(statsData[0]?.value ?? "0"),
  activeUsers: parseNumber(statsData[1]?.value ?? "0"),
  vendors: parseNumber(statsData[2]?.value ?? "0"),
  ordersLastDays: parseNumber(statsData[3]?.value ?? "0"),
  revenueGrowthPercentage: Number((statsData[0]?.change ?? "0").replace("%", "")) || 0,
  userGrowthPercentage: Number((statsData[1]?.change ?? "0").replace("%", "")) || 0,
  vendorGrowthPercentage: Number((statsData[2]?.change ?? "0").replace("%", "")) || 0,
  orderGrowthPercentage: Number((statsData[3]?.change ?? "0").replace("%", "")) || 0,
});

const buildDemoDashboardData = (): DashboardData => ({
  summary: getDefaultSummary(),
  trends: monthlyData.map((item) => ({
    month: item.month,
    revenue: item.revenue,
    orders: item.orders,
    users: item.users,
  })),
  categories: categoryData.map((item) => ({
    name: item.name,
    value: item.value,
    color: item.color,
    listings: item.listings,
    revenue: parseNumber(item.revenue),
  })),
});

const isDashboardData = (value: unknown): value is DashboardData => {
  return !!value && typeof value === "object" && "summary" in (value as DashboardData);
};

const normalizeDashboardResponse = (payload: unknown): DashboardData => {
  const obj = payload as Record<string, unknown>;

  const nestedData = (obj?.data as Record<string, unknown> | undefined)?.data;
  const directData = obj?.data;

  const resolvedData = isDashboardData(directData)
    ? directData
    : isDashboardData(nestedData)
      ? nestedData
      : isDashboardData(payload)
        ? payload
        : null;

  if (!resolvedData) {
    throw new Error("Invalid dashboard response format");
  }

  return {
    summary: {
      totalRevenue: Number(resolvedData.summary?.totalRevenue ?? 0),
      activeUsers: Number(resolvedData.summary?.activeUsers ?? 0),
      vendors: Number(resolvedData.summary?.vendors ?? 0),
      ordersLastDays: Number(resolvedData.summary?.ordersLastDays ?? 0),
      revenueGrowthPercentage: Number(resolvedData.summary?.revenueGrowthPercentage ?? 0),
      userGrowthPercentage: Number(resolvedData.summary?.userGrowthPercentage ?? 0),
      vendorGrowthPercentage: Number(resolvedData.summary?.vendorGrowthPercentage ?? 0),
      orderGrowthPercentage: Number(resolvedData.summary?.orderGrowthPercentage ?? 0),
    },
    trends: Array.isArray(resolvedData.trends) ? resolvedData.trends : [],
    categories: Array.isArray(resolvedData.categories) ? resolvedData.categories : [],
  };
};

const isDemoMode = (): boolean => {
  const hasMockFlag = import.meta.env.VITE_ENABLE_MOCK_DATA === "true";
  const token = localStorage.getItem("authToken");
  const tokenIsDemo = !!token && token.startsWith("demo-token-");

  return hasMockFlag || tokenIsDemo;
};

const getErrorStatus = (error: unknown): number | undefined => {
  if (typeof error === "object" && error !== null) {
    const errorObj = error as Record<string, unknown>;

    if (typeof errorObj.statusCode === "number") {
      return errorObj.statusCode;
    }

    const response = errorObj.response as Record<string, unknown> | undefined;
    if (response && typeof response.status === "number") {
      return response.status;
    }
  }

  return undefined;
};

const fetchDashboard = async (): Promise<DashboardData> => {
  const endpoints = ["/Admin/dashboard", "/admin/dashboard"];
  let lastError: unknown;

  for (const endpoint of endpoints) {
    try {
      const response = await apiClient.get<DashboardResponse>(endpoint);
      return normalizeDashboardResponse(response.data);
    } catch (error) {
      lastError = error;
      if (getErrorStatus(error) === 404) {
        continue;
      }
      throw error;
    }
  }

  throw lastError ?? new Error("Failed to fetch dashboard data");
};

export const useAdminDashboard = () => {
  const demoMode = isDemoMode();
  const demoData = buildDemoDashboardData();

  const query = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: async () => {
      if (demoMode) {
        return demoData;
      }

      return fetchDashboard();
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      const status = getErrorStatus(error);
      if (status === 404) {
        return false;
      }
      return failureCount < 1;
    },
  });

  useEffect(() => {
    if (query.error) {
      console.error("Failed to fetch admin dashboard. Falling back to demo data.", query.error);
    }
  }, [query.error]);

  return {
    data: query.data ?? demoData,
    isLoading: query.isLoading && !query.data,
    isError: query.isError,
    refetch: query.refetch,
    dataSource: demoMode ? "demo" : query.isError ? "fallback" : "api",
  };
};
