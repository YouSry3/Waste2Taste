import { useState } from "react";
import { AnalyticsHeader } from "./components/AnalyticsHeader";
import { StatCardGrid } from "./components/StatCardGrid";
import { RevenueTrendCard } from "./components/RevenueTrendCard";
import { SalesByTypeCard } from "./components/SalesByTypeCard";
import { PeakPickupHoursCard } from "./components/PeakPickupHoursCard";
import { WeeklyComparisonCard } from "./components/WeeklyComparisonCard";
import { TopItemsCard } from "./components/TopItemsCard";
import { TopCustomersCard } from "./components/TopCustomersCard";
import { monthlyRevenue } from "./constants/monthlyRevenue";
import { categoryBreakdown } from "./constants/categoryBreakdown";
import { peakHours } from "./constants/peakHours";
import { weeklyComparison } from "./constants/weeklyComparison";
import { topItems } from "./constants/topItems";
import { customerInsights } from "./constants/customerInsights";

export function VendorAnalytics() {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "quarter">(
    "month",
  );

  const totalRevenue = 843;
  const totalOrders = 186;
  const avgRating = 4.7;
  const repeatCustomers = 78;

  const revenueChange = 18;
  const ordersChange = 12;
  const ratingChange = 0.2;
  const repeatChange = 5;

  return (
    <div className="p-8 bg-gray-50 min-h-screen mt-9">
      <AnalyticsHeader timeRange={timeRange} onTimeRangeChange={setTimeRange} />

      <StatCardGrid
        totalRevenue={totalRevenue}
        totalOrders={totalOrders}
        avgRating={avgRating}
        repeatCustomers={repeatCustomers}
        revenueChange={revenueChange}
        ordersChange={ordersChange}
        ratingChange={ratingChange}
        repeatChange={repeatChange}
      />

      <RevenueTrendCard data={monthlyRevenue} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <SalesByTypeCard data={categoryBreakdown} />
        <PeakPickupHoursCard data={peakHours} />
      </div>

      <WeeklyComparisonCard data={weeklyComparison} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopItemsCard items={topItems} />
        <TopCustomersCard customers={customerInsights} />
      </div>
    </div>
  );
}
