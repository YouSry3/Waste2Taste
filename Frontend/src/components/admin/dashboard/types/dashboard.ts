/**
 * Dashboard Types
 * AI: Keep this file updated as API contracts evolve
 */

// Dashboard Statistics
export interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  growthRate: number;
  activeUsers?: number;
  conversionRate?: number;
  averageOrderValue?: number;
}

// Chart Data
export interface ChartData {
  date: string;
  value: number;
  category: string;
  label?: string;
}

// Recent Orders
export interface RecentOrder {
  id: string;
  customer: string;
  email: string;
  amount: number;
  status: "pending" | "completed" | "cancelled" | "processing" | "shipped";
  date: string;
  product?: string;
  paymentMethod?: string;
}

// Stats Card Data
export interface StatsCard {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change: string;
  trend: "up" | "down";
  description?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  statusCode?: number;
}

// Filter and Query Types
export type ExportFormat = "csv" | "excel" | "pdf" | "json";

export interface DashboardFilterParams {
  dateRange: {
    start: string;
    end: string;
  };
  categories?: string[];
  statuses?: string[];
  minAmount?: number;
  maxAmount?: number;
  searchQuery?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Dashboard Summary
export interface DashboardSummary {
  stats: DashboardStats;
  revenueData: ChartData[];
  recentOrders: RecentOrder[];
  topProducts?: Array<{
    name: string;
    sales: number;
    revenue: number;
  }>;
}

// Time Range Options
export type TimeRange = "daily" | "weekly" | "monthly" | "quarterly" | "yearly";

// User Activity
export interface UserActivity {
  userId: string;
  name: string;
  email: string;
  lastActive: string;
  activityCount: number;
}

// Revenue Metrics
export interface RevenueMetrics {
  totalRevenue: number;
  recurringRevenue: number;
  oneTimeRevenue: number;
  revenueGrowth: number;
  projectedRevenue: number;
}
