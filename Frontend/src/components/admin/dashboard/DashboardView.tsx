// src/components/admin/dashboard/DashboardView.tsx
import { useMemo, useState } from "react";
import { Calendar, Download, DollarSign, Users, Store, ShoppingBag } from "lucide-react";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

// Import components
import { StatsCard } from "./components/cards/StatsCard";
import { RevenueChart } from "./components/charts/RevenueChart";
import { CategoryChart } from "./components/charts/CategoryChart";
import { QuickActions } from "./components/quick-actions/QuickActions";

// Import data
import { monthlyData } from "./constants/monthlyData";
import { categoryData } from "./constants/categoryData";
import { StatsData, MonthlyData, CategoryData } from "./types";
import { useAdminDashboard } from "../../../hooks/useAdminDashboard";
type DashboardDataSource = ReturnType<typeof useAdminDashboard>["dataSource"];

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("en-US");

const toPercent = (value: number) => `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;

const buildFallbackTrend = (baseValue: number): number[] => {
  if (baseValue <= 0) {
    return [0, 0, 0, 0, 0, 0];
  }

  return [0.6, 0.72, 0.81, 0.9, 0.96, 1].map((factor) =>
    Math.round(baseValue * factor),
  );
};

const getDataSourceBadge = (dataSource: DashboardDataSource) => {
  if (dataSource === "demo") {
    return {
      label: "Demo data",
      className: "border-sky-200 bg-sky-50 text-sky-700",
    };
  }

  if (dataSource === "fallback") {
    return {
      label: "Fallback data",
      className: "border-amber-200 bg-amber-50 text-amber-700",
    };
  }

  return {
    label: "Live API",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  };
};

const buildStatsData = (dashboardData: ReturnType<typeof useAdminDashboard>["data"]): StatsData[] => {
  const revenueTrend = dashboardData.trends
    .map((item) => Number(item.revenue ?? 0))
    .filter((value) => Number.isFinite(value));

  const ordersTrend = dashboardData.trends
    .map((item) => Number(item.orders ?? 0))
    .filter((value) => Number.isFinite(value));

  const usersTrend = dashboardData.trends
    .map((item) => Number(item.users ?? 0))
    .filter((value) => Number.isFinite(value));

  return [
    {
      title: "Total Revenue",
      value: currencyFormatter.format(dashboardData.summary.totalRevenue || 0),
      change: toPercent(dashboardData.summary.revenueGrowthPercentage || 0),
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
      isPositive: (dashboardData.summary.revenueGrowthPercentage || 0) >= 0,
      description: "Last 30 days",
      trend: revenueTrend.length ? revenueTrend : buildFallbackTrend(dashboardData.summary.totalRevenue),
    },
    {
      title: "Active Users",
      value: numberFormatter.format(dashboardData.summary.activeUsers || 0),
      change: toPercent(dashboardData.summary.userGrowthPercentage || 0),
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      isPositive: (dashboardData.summary.userGrowthPercentage || 0) >= 0,
      description: "Currently active",
      trend: usersTrend.length ? usersTrend : buildFallbackTrend(dashboardData.summary.activeUsers),
    },
    {
      title: "Vendors",
      value: numberFormatter.format(dashboardData.summary.vendors || 0),
      change: toPercent(dashboardData.summary.vendorGrowthPercentage || 0),
      icon: Store,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      isPositive: (dashboardData.summary.vendorGrowthPercentage || 0) >= 0,
      description: "Active vendors",
      trend: buildFallbackTrend(dashboardData.summary.vendors),
    },
    {
      title: "Orders (30d)",
      value: numberFormatter.format(dashboardData.summary.ordersLastDays || 0),
      change: toPercent(dashboardData.summary.orderGrowthPercentage || 0),
      icon: ShoppingBag,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      isPositive: (dashboardData.summary.orderGrowthPercentage || 0) >= 0,
      description: "Last 30 days",
      trend: ordersTrend.length ? ordersTrend : buildFallbackTrend(dashboardData.summary.ordersLastDays),
    },
  ];
};

const buildMonthlyChartData = (
  dashboardData: ReturnType<typeof useAdminDashboard>["data"],
  dataSource: ReturnType<typeof useAdminDashboard>["dataSource"],
): MonthlyData[] => {
  if (!dashboardData.trends.length) {
    return dataSource === "api" ? [] : monthlyData;
  }

  return dashboardData.trends.map((trend, index) => {
    const revenue = Number(trend.revenue ?? 0);
    const orders = Number(trend.orders ?? 0);
    const users = Number(trend.users ?? dashboardData.summary.activeUsers ?? 0);

    let month = trend.month || trend.label;
    if (!month && trend.date) {
      const date = new Date(trend.date);
      month = Number.isNaN(date.getTime())
        ? `P${index + 1}`
        : date.toLocaleString("en-US", { month: "short" });
    }

    return {
      month: month || `P${index + 1}`,
      revenue,
      orders,
      users,
      avgOrder: orders > 0 ? revenue / orders : 0,
    };
  });
};

const buildCategoryChartData = (
  dashboardData: ReturnType<typeof useAdminDashboard>["data"],
  dataSource: ReturnType<typeof useAdminDashboard>["dataSource"],
): CategoryData[] => {
  if (!dashboardData.categories.length) {
    return dataSource === "api" ? [] : categoryData;
  }

  const fallbackColors = ["#f59e0b", "#ef4444", "#10b981", "#3b82f6", "#8b5cf6", "#14b8a6"];

  const totalListings = dashboardData.categories.reduce((sum, category) => {
    return sum + Number(category.listings ?? category.count ?? 0);
  }, 0);

  return dashboardData.categories.map((category, index) => {
    const listings = Number(category.listings ?? category.count ?? 0);
    const rawPercent = Number(category.value ?? 0);

    const value = rawPercent > 0 && rawPercent <= 100
      ? rawPercent
      : totalListings > 0
        ? Math.round((listings / totalListings) * 100)
        : 0;

    return {
      name: category.name,
      value,
      color: category.color || fallbackColors[index % fallbackColors.length],
      listings,
      revenue: currencyFormatter.format(Number(category.revenue ?? 0)),
    };
  });
};

export function DashboardView() {
  const [timeRange, setTimeRange] = useState("30d");
  const { data, isLoading, isError, refetch, dataSource } = useAdminDashboard();
  const sourceBadge = getDataSourceBadge(dataSource);

  const mappedStats = useMemo(() => buildStatsData(data), [data]);
  const mappedMonthlyData = useMemo(() => buildMonthlyChartData(data, dataSource), [data, dataSource]);
  const mappedCategoryData = useMemo(() => buildCategoryChartData(data, dataSource), [data, dataSource]);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <Badge variant="outline" className={sourceBadge.className}>
              Data source: {sourceBadge.label}
            </Badge>
          </div>
          <p className="text-gray-500">
            Overview of your food rescue marketplace
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black">
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            className="flex items-center gap-2 border-green-600 text-green-600 hover:bg-green-50"
          >
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {isError && (
        <div className="mb-6 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Live dashboard data is unavailable. Showing demo data.
          <Button
            variant="link"
            className="ml-2 h-auto p-0 text-amber-900"
            onClick={() => void refetch()}
          >
            Retry
          </Button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {mappedStats.map((stat) => (
          <StatsCard key={stat.title} stat={stat} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <RevenueChart
          data={mappedMonthlyData}
          isLoading={isLoading}
          timeRange={timeRange}
        />
        <CategoryChart data={mappedCategoryData} />
      </div>

      {/* Quick Actions */}
      <div className="mb-2">
        <QuickActions />
      </div>
    </div>
  );
}
export { DashboardView as Dashboard };
