// src/components/admin/dashboard/index.ts
export { DashboardView } from "./DashboardView";
export { StatsCard } from "./components/cards/StatsCard";
export { StatsCardGrid } from "./components/cards/StatsCardGrid";
export { RevenueChart } from "./components/charts/RevenueChart";
export { CategoryChart } from "./components/charts/CategoryChart";
export { RecentOrders } from "./components/tables/RecentOrders";
export * from "./api/dashboard.api";
export * from "./api/dashboard.queries";
export * from "./api/dashboard.mutations";
export * from "./dashboard.types";
// Types
export type {
  StatsData,
  MonthlyData,
  CategoryData,
  RecentOrder,
} from "./types";

// Constants
export { statsData } from "./constants/statsData";
export { monthlyData } from "./constants/monthlyData";
export { categoryData } from "./constants/categoryData";
export { recentOrders } from "./constants/recentOrders";
