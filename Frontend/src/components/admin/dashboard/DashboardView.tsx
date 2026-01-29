// src/components/admin/dashboard/DashboardView.tsx
import { useState, useEffect } from "react";
import { Calendar, Download } from "lucide-react";
import { Button } from "../../ui/button";
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
import { RecentOrders } from "./components/tables/RecentOrders";

// Import data
import { statsData } from "./constants/statsData";
import { monthlyData } from "./constants/monthlyData";
import { categoryData } from "./constants/categoryData";
import { recentOrders } from "./constants/recentOrders";

export function DashboardView() {
  const [timeRange, setTimeRange] = useState("30d");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [timeRange]);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat) => (
          <StatsCard key={stat.title} stat={stat} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <RevenueChart
          data={monthlyData}
          isLoading={isLoading}
          timeRange={timeRange}
        />
        <CategoryChart data={categoryData} />
      </div>

      {/* Recent Orders */}
      <RecentOrders orders={recentOrders} />
    </div>
  );
}
export { DashboardView as Dashboard };
