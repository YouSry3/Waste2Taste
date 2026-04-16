import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../services/api/apiClient";
import { API_CONFIG } from "../services/api/apiConfig";
import { authService } from "../services/auth/authService";

type RawSection = Record<string, unknown> & {
  labels?: unknown[];
  data?: unknown[];
  amounts?: unknown[];
  thisWeek?: unknown[];
  lastWeek?: unknown[];
  peakTime?: unknown;
  peakOrders?: unknown;
  orders?: unknown[];
};

interface RawVendorAnalyticsResponse {
  summary?: Record<string, unknown>;
  revenueTrend?: RawSection;
  salesByType?: RawSection;
  peakHours?: RawSection;
  weeklyPerformance?: RawSection;
  topProducts?: unknown[];
  topCustomers?: unknown[];
}

export interface VendorAnalyticsSummary {
  totalRevenue: number;
  totalOrders: number;
  avgRating: number;
  repeatCustomers: number;
  revenueChange: number;
  ordersChange: number;
  ratingChange: number;
  repeatChange: number;
}

export interface VendorRevenueTrendPoint {
  month: string;
  revenue: number;
  orders: number;
}

export interface VendorSalesByTypePoint {
  name: string;
  value: number;
  color: string;
  revenue: number;
}

export interface VendorPeakHourPoint {
  hour: string;
  orders: number;
}

export interface VendorWeeklyComparisonPoint {
  day: string;
  current: number;
  previous: number;
}

export interface VendorTopItem {
  name: string;
  sold: number;
  revenue: number;
  rating: number;
  trend: number;
}

export interface VendorTopCustomer {
  name: string;
  orders: number;
  spent: number;
  rating: number;
}

export interface VendorAnalyticsData {
  summary: VendorAnalyticsSummary;
  revenueTrend: VendorRevenueTrendPoint[];
  salesByType: VendorSalesByTypePoint[];
  peakHours: VendorPeakHourPoint[];
  peakTime: string;
  peakOrders: number;
  weeklyComparison: VendorWeeklyComparisonPoint[];
  topItems: VendorTopItem[];
  topCustomers: VendorTopCustomer[];
}

const ANALYTICS_ENDPOINT = `${(API_CONFIG.BASE_URL || "").replace(
  /\/api\/?$/i,
  "",
)}/api/dashboard/analytics`;

const QUERY_KEY_PREFIX = ["vendor-analytics"] as const;

const SALES_COLORS = [
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444",
  "#14b8a6",
];

const asObject = (value: unknown): Record<string, unknown> =>
  typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : {};

const asArray = (value: unknown): unknown[] =>
  Array.isArray(value) ? value : [];

const toNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : fallback;
  }

  if (typeof value === "string") {
    const parsed = Number(value.replace(/[^\d.-]/g, ""));
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
};

const toText = (value: unknown, fallback: string): string => {
  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim();
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  return fallback;
};

const computePercentageChange = (
  current: number,
  previous: number,
): number => {
  if (current === 0 && previous === 0) {
    return 0;
  }

  if (previous === 0) {
    return current > 0 ? 100 : current < 0 ? -100 : 0;
  }

  return Math.round(((current - previous) / Math.abs(previous)) * 100);
};

const isVendorAnalyticsResponse = (
  value: unknown,
): value is RawVendorAnalyticsResponse => {
  const obj = asObject(value);

  return (
    "summary" in obj &&
    "revenueTrend" in obj &&
    "salesByType" in obj &&
    "peakHours" in obj &&
    "weeklyPerformance" in obj
  );
};

const mapTopItem = (value: unknown, index: number): VendorTopItem => {
  const item = asObject(value);

  return {
    name: toText(
      item.name ??
        item.productName ??
        item.title ??
        item.itemName ??
        item.product ??
        item.label,
      `Product ${index + 1}`,
    ),
    sold: toNumber(
      item.sold ?? item.unitsSold ?? item.orders ?? item.quantity ?? item.count,
    ),
    revenue: toNumber(
      item.revenue ??
        item.totalRevenue ??
        item.amount ??
        item.totalSales ??
        item.spent,
    ),
    rating: toNumber(item.rating ?? item.averageRating ?? item.avgRating),
    trend: toNumber(
      item.trend ??
        item.change ??
        item.growth ??
        item.trendPercentage ??
        item.percentageChange,
    ),
  };
};

const mapTopCustomer = (value: unknown, index: number): VendorTopCustomer => {
  const item = asObject(value);

  return {
    name: toText(
      item.name ?? item.customerName ?? item.fullName ?? item.label,
      `Customer ${index + 1}`,
    ),
    orders: toNumber(item.orders ?? item.orderCount ?? item.totalOrders ?? item.count),
    spent: toNumber(item.spent ?? item.totalSpent ?? item.revenue ?? item.amount),
    rating: toNumber(item.rating ?? item.averageRating ?? item.avgRating),
  };
};

const normalizeVendorAnalytics = (
  payload: unknown,
): VendorAnalyticsData => {
  const raw = asObject(payload);
  const directData = asObject(raw.data);
  const nestedData = asObject(directData.data);

  const resolved = [raw, directData, nestedData].find(isVendorAnalyticsResponse);

  if (!resolved) {
    throw new Error("Invalid vendor analytics response format");
  }

  const summary = asObject(resolved.summary);
  const revenueTrendSection = asObject(resolved.revenueTrend);
  const salesByTypeSection = asObject(resolved.salesByType);
  const peakHoursSection = asObject(resolved.peakHours);
  const weeklyPerformanceSection = asObject(resolved.weeklyPerformance);

  const revenueLabels = asArray(revenueTrendSection.labels).map((label, index) =>
    toText(label, `Month ${index + 1}`),
  );
  const revenueValues = asArray(revenueTrendSection.data).map((value) =>
    toNumber(value),
  );
  const revenueOrders = asArray(revenueTrendSection.orders).map((value) =>
    toNumber(value),
  );
  const revenueTrend = revenueLabels.map((month, index) => ({
    month,
    revenue: revenueValues[index] ?? 0,
    orders: revenueOrders[index] ?? 0,
  }));

  const salesLabels = asArray(salesByTypeSection.labels).map((label, index) =>
    toText(label, `Category ${index + 1}`),
  );
  const salesValues = asArray(salesByTypeSection.data).map((value) =>
    toNumber(value),
  );
  const salesAmounts = asArray(salesByTypeSection.amounts).map((value) =>
    toNumber(value),
  );
  const salesCount = Math.max(
    salesLabels.length,
    salesValues.length,
    salesAmounts.length,
  );
  const resolvedSalesLabels =
    salesLabels.length > 0
      ? salesLabels
      : Array.from({ length: salesCount }, (_, index) => `Category ${index + 1}`);
  const salesTotal = salesValues.reduce((sum, value) => sum + value, 0);
  const salesByType = resolvedSalesLabels.map((name, index) => ({
    name,
    value: salesTotal > 0 ? Math.round(((salesValues[index] ?? 0) / salesTotal) * 100) : 0,
    color: SALES_COLORS[index % SALES_COLORS.length],
    revenue: salesAmounts[index] ?? 0,
  }));

  const peakLabels = asArray(peakHoursSection.labels).map((label, index) =>
    toText(label, `Hour ${index + 1}`),
  );
  const peakValues = asArray(peakHoursSection.data).map((value) => toNumber(value));
  const peakHours = peakLabels.map((hour, index) => ({
    hour,
    orders: peakValues[index] ?? 0,
  }));
  const peakHourWithMostOrders = peakHours.reduce<VendorPeakHourPoint | null>(
    (best, current) => {
      if (!best || current.orders > best.orders) {
        return current;
      }
      return best;
    },
    null,
  );
  const peakTime = toText(
    peakHoursSection.peakTime,
    peakHourWithMostOrders?.hour ?? "N/A",
  );
  const peakOrders = toNumber(
    peakHoursSection.peakOrders,
    peakHourWithMostOrders?.orders ?? 0,
  );

  const weeklyLabels = asArray(weeklyPerformanceSection.labels).map((label, index) =>
    toText(label, `Day ${index + 1}`),
  );
  const thisWeekValues = asArray(weeklyPerformanceSection.thisWeek).map((value) =>
    toNumber(value),
  );
  const lastWeekValues = asArray(weeklyPerformanceSection.lastWeek).map((value) =>
    toNumber(value),
  );
  const weeklyComparison = weeklyLabels.map((day, index) => ({
    day,
    current: thisWeekValues[index] ?? 0,
    previous: lastWeekValues[index] ?? 0,
  }));

  const topItems = asArray(resolved.topProducts).map(mapTopItem).slice(0, 5);
  const topCustomers = asArray(resolved.topCustomers)
    .map(mapTopCustomer)
    .slice(0, 5);

  const revenueChange =
    revenueTrend.length > 1
      ? computePercentageChange(
          revenueTrend[revenueTrend.length - 1]?.revenue ?? 0,
          revenueTrend[0]?.revenue ?? 0,
        )
      : 0;

  const currentOrdersTotal = weeklyComparison.reduce(
    (sum, item) => sum + item.current,
    0,
  );
  const previousOrdersTotal = weeklyComparison.reduce(
    (sum, item) => sum + item.previous,
    0,
  );

  return {
    summary: {
      totalRevenue: toNumber(summary.revenue30Days),
      totalOrders: toNumber(summary.orders30Days),
      avgRating: toNumber(summary.averageRating),
      repeatCustomers: toNumber(summary.repeatCustomersPercentage),
      revenueChange,
      ordersChange: computePercentageChange(currentOrdersTotal, previousOrdersTotal),
      ratingChange: 0,
      repeatChange: 0,
    },
    revenueTrend,
    salesByType,
    peakHours,
    peakTime,
    peakOrders,
    weeklyComparison,
    topItems,
    topCustomers,
  };
};

const fetchVendorAnalytics = async (): Promise<VendorAnalyticsData> => {
  const response = await apiClient.get<unknown>(ANALYTICS_ENDPOINT);
  return normalizeVendorAnalytics(response.data);
};

export const useVendorAnalytics = () => {
  const currentUser = authService.getCurrentUser();
  const authToken = localStorage.getItem("authToken") || "no-token";

  const queryKey = [
    ...QUERY_KEY_PREFIX,
    currentUser?.email || "anonymous",
    currentUser?.panelType || "unknown",
    authToken,
  ] as const;

  return useQuery({
    queryKey,
    queryFn: fetchVendorAnalytics,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    retry: 1,
  });
};
