export interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  growthRate: number;
}

export interface ChartData {
  date: string;
  value: number;
  category: string;
}

export interface RecentOrder {
  id: string;
  customer: string;
  amount: number;
  status: "pending" | "completed" | "cancelled";
  date: string;
}
