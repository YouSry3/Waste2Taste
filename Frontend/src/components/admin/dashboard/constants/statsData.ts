// src/components/admin/dashboard/constants/statsData.ts
import { DollarSign, Users, Store, ShoppingBag } from "lucide-react";
import { StatsData } from "../types";

export const statsData: StatsData[] = [
  {
    title: "Total Revenue",
    value: "$42,584",
    change: "+12.5%",
    icon: DollarSign,
    color: "text-green-600",
    bgColor: "bg-green-100",
    isPositive: true,
    description: "Last 30 days",
    trend: [28500, 32200, 35800, 38900, 41200, 42584],
  },
  {
    title: "Active Users",
    value: "8,342",
    change: "+8.2%",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    isPositive: true,
    description: "Currently active",
    trend: [6500, 7000, 7200, 7800, 8100, 8342],
  },
  {
    title: "Vendors",
    value: "156",
    change: "+5.1%",
    icon: Store,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    isPositive: true,
    description: "Active vendors",
    trend: [120, 130, 140, 145, 152, 156],
  },
  {
    title: "Orders (30d)",
    value: "2,847",
    change: "+15.3%",
    icon: ShoppingBag,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    isPositive: true,
    description: "Last 30 days",
    trend: [2000, 2200, 2400, 2600, 2700, 2847],
  },
];
