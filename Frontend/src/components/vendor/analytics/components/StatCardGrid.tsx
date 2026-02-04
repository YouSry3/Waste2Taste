import { DollarSign, ShoppingBag, Star, Users } from "lucide-react";
import { StatCard } from "./StatCard";

interface StatCardGridProps {
  totalRevenue: number;
  totalOrders: number;
  avgRating: number;
  repeatCustomers: number;
  revenueChange: number;
  ordersChange: number;
  ratingChange: number;
  repeatChange: number;
}

export function StatCardGrid({
  totalRevenue,
  totalOrders,
  avgRating,
  repeatCustomers,
  revenueChange,
  ordersChange,
  ratingChange,
  repeatChange,
}: StatCardGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <StatCard
        title="Revenue (30d)"
        value={`$${totalRevenue.toFixed(2)}`}
        change={revenueChange}
        icon={<DollarSign className="w-5 h-5" />}
        iconBg="bg-green-100"
        iconColor="text-green-600"
      />
      <StatCard
        title="Orders"
        value={totalOrders.toString()}
        change={ordersChange}
        icon={<ShoppingBag className="w-5 h-5" />}
        iconBg="bg-purple-100"
        iconColor="text-purple-600"
      />
      <StatCard
        title="Avg. Rating"
        value={avgRating.toFixed(1)}
        change={ratingChange}
        icon={<Star className="w-5 h-5" />}
        iconBg="bg-yellow-100"
        iconColor="text-yellow-600"
      />
      <StatCard
        title="Repeat Customers"
        value={`${repeatCustomers}%`}
        change={repeatChange}
        icon={<Users className="w-5 h-5" />}
        iconBg="bg-blue-100"
        iconColor="text-blue-600"
      />
    </div>
  );
}
