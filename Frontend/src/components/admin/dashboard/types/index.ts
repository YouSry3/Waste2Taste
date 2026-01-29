// src/components/admin/dashboard/types/index.ts
import { LucideIcon } from "lucide-react";

export interface StatsData {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  isPositive: boolean;
  description: string;
  trend: number[];
}

export interface MonthlyData {
  month: string;
  revenue: number;
  orders: number;
  users: number;
  avgOrder: number;
}

export interface CategoryData {
  name: string;
  value: number;
  color: string;
  listings: number;
  revenue: string;
}

export interface RecentOrder {
  id: string;
  user: string;
  vendor: string;
  items: string;
  amount: string;
  status: "completed" | "pending" | "cancelled";
  time: string;
  avatarColor: string;
}
