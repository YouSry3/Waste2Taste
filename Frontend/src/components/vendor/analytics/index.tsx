import { useState } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { useVendorAnalytics } from "../../../hooks/useVendorAnalytics";
import { AnalyticsHeader } from "./components/AnalyticsHeader";
import { StatCardGrid } from "./components/StatCardGrid";
import { RevenueTrendCard } from "./components/RevenueTrendCard";
import { SalesByTypeCard } from "./components/SalesByTypeCard";
import { PeakPickupHoursCard } from "./components/PeakPickupHoursCard";
import { WeeklyComparisonCard } from "./components/WeeklyComparisonCard";
import { TopItemsCard } from "./components/TopItemsCard";
import { TopCustomersCard } from "./components/TopCustomersCard";
import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { Skeleton } from "../../ui/skeleton";

function AnalyticsSkeleton({
  timeRange,
  onTimeRangeChange,
}: {
  timeRange: "week" | "month" | "quarter";
  onTimeRangeChange: (value: "week" | "month" | "quarter") => void;
}) {
  return (
    <div className="p-8 bg-gray-50 min-h-screen mt-9">
      <AnalyticsHeader
        timeRange={timeRange}
        onTimeRangeChange={onTimeRangeChange}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-32 w-full rounded-xl" />
        ))}
      </div>

      <Skeleton className="h-96 w-full rounded-xl mb-6" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Skeleton className="h-96 w-full rounded-xl" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>

      <Skeleton className="h-80 w-full rounded-xl mb-6" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-96 w-full rounded-xl" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    </div>
  );
}

function AnalyticsErrorState({
  error,
  onRetry,
  timeRange,
  onTimeRangeChange,
}: {
  error: unknown;
  onRetry: () => void;
  timeRange: "week" | "month" | "quarter";
  onTimeRangeChange: (value: "week" | "month" | "quarter") => void;
}) {
  const details = (() => {
    const e = error as Record<string, unknown> | null;
    const response = (e?.response as Record<string, unknown> | undefined) ?? {};
    const responseData =
      (response.data as Record<string, unknown> | undefined) ?? {};

    return {
      status:
        (e?.statusCode as number | undefined) ?? (response.status as number | undefined),
      message:
        (responseData.message as string | undefined) ??
        (responseData.title as string | undefined) ??
        (e?.message as string | undefined) ??
        "Unable to load analytics data.",
    };
  })();

  return (
    <div className="p-8 bg-gray-50 min-h-screen mt-9">
      <AnalyticsHeader
        timeRange={timeRange}
        onTimeRangeChange={onTimeRangeChange}
      />

      <Card className="border-red-200 bg-red-50">
        <CardContent className="py-8 flex flex-col items-center gap-3 text-center">
          <AlertCircle className="h-8 w-8 text-red-600" />
          <p className="font-semibold text-red-800">
            Could not load vendor analytics.
          </p>
          <p className="text-sm text-red-700">
            Please retry, or check that your vendor token is still valid.
          </p>
          <p className="text-xs text-red-800">
            {details.status ? `Status ${details.status}: ` : ""}
            {details.message}
          </p>
          <Button
            onClick={onRetry}
            variant="outline"
            className="border-red-300"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export function VendorAnalytics() {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "quarter">(
    "month",
  );

  const {
    data: analytics,
    isLoading,
    isError,
    error,
    refetch,
  } = useVendorAnalytics();

  if (isLoading && !analytics) {
    return (
      <AnalyticsSkeleton
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
      />
    );
  }

  if (isError) {
    return (
      <AnalyticsErrorState
        error={error}
        onRetry={() => refetch()}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
      />
    );
  }

  if (!analytics) {
    return (
      <AnalyticsSkeleton
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
      />
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen mt-9">
      <AnalyticsHeader timeRange={timeRange} onTimeRangeChange={setTimeRange} />

      <StatCardGrid
        totalRevenue={analytics.summary.totalRevenue}
        totalOrders={analytics.summary.totalOrders}
        avgRating={analytics.summary.avgRating}
        repeatCustomers={analytics.summary.repeatCustomers}
        revenueChange={analytics.summary.revenueChange}
        ordersChange={analytics.summary.ordersChange}
        ratingChange={analytics.summary.ratingChange}
        repeatChange={analytics.summary.repeatChange}
      />

      <RevenueTrendCard data={analytics.revenueTrend} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <SalesByTypeCard data={analytics.salesByType} />
        <PeakPickupHoursCard
          data={analytics.peakHours}
          peakTime={analytics.peakTime}
          peakOrders={analytics.peakOrders}
        />
      </div>

      <WeeklyComparisonCard data={analytics.weeklyComparison} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopItemsCard items={analytics.topItems} />
        <TopCustomersCard customers={analytics.topCustomers} />
      </div>
    </div>
  );
}
