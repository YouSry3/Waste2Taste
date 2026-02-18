import {
  Package,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Clock,
  Star,
} from "lucide-react";

export const initialStatsData = [
  {
    title: "Active Listings",
    value: "12",
    change: "+2",
    icon: Package,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "Revenue (30d)",
    value: "$842.50",
    change: "+18%",
    icon: DollarSign,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    title: "Orders",
    value: "156",
    change: "+12%",
    icon: ShoppingBag,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    title: "Food Saved (lbs)",
    value: "1,240",
    change: "+24%",
    icon: TrendingUp,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
  {
    title: "Pickups Today",
    value: "4/8",
    change: "+2",
    icon: Clock,
    color: "text-amber-600",
    bgColor: "bg-amber-100",
  },
  {
    title: "Avg. Rating",
    value: "4.7",
    change: "+0.2",
    icon: Star,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
];
