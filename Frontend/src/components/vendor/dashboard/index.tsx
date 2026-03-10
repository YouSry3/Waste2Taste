import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AlertCircle, RotateCcw } from "lucide-react";
import { profileService } from "../../../services/profile/profileService";
import { UserProfile } from "../../../types/profile";
import { VendorOrder } from "../types";
import { useVendorDashboard } from "@/hooks/useVendorDashboard";
import { initialStatsData } from "./constants/statsData";
import { weeklyData } from "./constants/weeklyData";
import { topCustomers } from "./constants/topCustomers";
import { inventoryItems } from "./constants/inventoryItems";
import { initialRecentOrders } from "./constants/recentOrders";
import { getInitials, getStatusColor, getSuggestedPrice } from "./utils/dashboardUtils";
import { DashboardHeader } from "./components/DashboardHeader";
import { StatsGrid } from "./components/StatsGrid";
import { MonthlyGoalsCard } from "./components/MonthlyGoalsCard";
import { WeeklyPerformanceCard } from "./components/WeeklyPerformanceCard";
import { InventoryStatusCard } from "./components/InventoryStatusCard";
import { TopCustomersCard } from "./components/TopCustomersCard";
import { EnvironmentalImpactCard } from "./components/EnvironmentalImpactCard";
import { QuickActionsCard } from "./components/QuickActionsCard";
import { RecentOrdersTable } from "./components/RecentOrdersTable";
import { OrderDetailsDialog } from "./components/OrderDetailsDialog";
import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { Skeleton } from "../../ui/skeleton";

const isApiModeEnabled = () => {
  const mockFlag = import.meta.env.VITE_ENABLE_MOCK_DATA;
  if (typeof mockFlag === "string" && mockFlag.toLowerCase() === "true") {
    return false;
  }

  const token = localStorage.getItem("authToken");
  return !!token && !token.startsWith("demo-token-");
};

const mapOrderStatus = (status: string): VendorOrder["status"] => {
  const normalized = status.toLowerCase();
  if (normalized.includes("picked")) return "Picked Up";
  if (normalized.includes("ready")) return "Ready for Pickup";
  if (normalized.includes("pending")) return "Pending Pickup";
  if (normalized.includes("progress")) return "In Progress";
  if (normalized.includes("cancel")) return "Cancelled";
  return "Pending Pickup";
};

const mapExpiringStatus = (
  timeRemaining: string,
  isUrgent: boolean,
): "critical" | "low" | "medium" | "good" => {
  if (isUrgent) return "critical";
  const value = timeRemaining.toLowerCase();
  if (value.includes("min")) return "critical";

  const match = value.match(/\d+/);
  const amount = match ? Number(match[0]) : undefined;

  if (value.includes("hour") || value.includes("hr")) {
    if (typeof amount === "number" && amount <= 6) return "low";
    return "medium";
  }

  if (value.includes("day")) return "good";
  return "medium";
};

function SkeletonDashboard() {
  return (
    <div className="p-6 space-y-6">
      <Skeleton className="h-10 w-72" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, idx) => (
          <Skeleton key={idx} className="h-36 w-full" />
        ))}
      </div>
      <Skeleton className="h-56 w-full" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="h-96 lg:col-span-2" />
        <Skeleton className="h-96" />
      </div>
      <Skeleton className="h-96 w-full" />
    </div>
  );
}

const getApiErrorDetails = (error: unknown) => {
  const e = error as any;
  return {
    status: e?.response?.status ?? e?.statusCode,
    message:
      e?.response?.data?.message ||
      e?.response?.data?.title ||
      e?.message ||
      "Unexpected error",
  };
};

function ApiErrorState({
  onRetry,
  error,
}: {
  onRetry: () => void;
  error: unknown;
}) {
  const details = getApiErrorDetails(error);

  return (
    <div className="p-6">
      <Card className="border-red-200 bg-red-50">
        <CardContent className="py-8 flex flex-col items-center gap-3 text-center">
          <AlertCircle className="h-8 w-8 text-red-600" />
          <p className="font-semibold text-red-800">
            Could not load dashboard data.
          </p>
          <p className="text-sm text-red-700">
            Please try again or continue in demo mode.
          </p>
          <p className="text-xs text-red-800">
            {details.status ? `Status ${details.status}: ` : ""}
            {details.message}
          </p>
          <Button onClick={onRetry} variant="outline" className="border-red-300">
            <RotateCcw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export function VendorDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [recentOrders, setRecentOrders] =
    useState<VendorOrder[]>(initialRecentOrders);
  const [selectedOrder, setSelectedOrder] = useState<VendorOrder | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  const isApiMode = isApiModeEnabled();
  const {
    data: apiDashboard,
    isLoading: isApiLoading,
    error: apiError,
    refetch,
  } = useVendorDashboard({ enabled: isApiMode });

  useEffect(() => {
    const currentProfile = profileService.getCurrentProfile();
    setProfile(currentProfile);
  }, []);

  const statsData = useMemo(() => {
    if (!isApiMode || !apiDashboard) return initialStatsData;
    return initialStatsData.map((stat) => {
      switch (stat.title) {
        case "Active Listings":
          return { ...stat, value: apiDashboard.stats.activeListings.toString() };
        case "Revenue (30d)":
          return {
            ...stat,
            value: `$${apiDashboard.stats.revenue30Days.toLocaleString()}`,
          };
        case "Orders":
          return { ...stat, value: apiDashboard.stats.totalOrders.toString() };
        case "Food Saved (lbs)":
          return {
            ...stat,
            value: apiDashboard.stats.foodSavedLbs.toLocaleString(),
          };
        case "Pickups Today":
          return { ...stat, value: apiDashboard.stats.pickupsToday.toString() };
        case "Avg. Rating":
          return {
            ...stat,
            value: apiDashboard.stats.averageRating.toFixed(1),
          };
        default:
          return stat;
      }
    });
  }, [apiDashboard, isApiMode]);

  const monthlyGoals = useMemo(() => {
    if (isApiMode && apiDashboard) {
      return [
        {
          name: "Food Saved",
          current: apiDashboard.monthlyGoals.foodSavedCurrent,
          target: apiDashboard.monthlyGoals.foodSavedTarget,
          percentage: apiDashboard.monthlyGoals.foodSavedPercentage,
        },
        {
          name: "Revenue",
          current: apiDashboard.monthlyGoals.revenueCurrent,
          target: apiDashboard.monthlyGoals.revenueTarget,
          percentage: apiDashboard.monthlyGoals.revenuePercentage,
        },
        {
          name: "Customer Rating",
          current: apiDashboard.monthlyGoals.ratingCurrent,
          target: apiDashboard.monthlyGoals.ratingTarget,
          percentage: apiDashboard.monthlyGoals.ratingPercentage,
        },
      ];
    }

    if (profile?.monthlyGoals) {
      return [
        {
          name: "Food Saved",
          current: 1240,
          target: profile.monthlyGoals.foodSaved,
          percentage: Math.round((1240 / profile.monthlyGoals.foodSaved) * 100),
        },
        {
          name: "Revenue",
          current: 842.5,
          target: profile.monthlyGoals.revenue,
          percentage: Math.round((842.5 / profile.monthlyGoals.revenue) * 100),
        },
        {
          name: "Customer Rating",
          current: 4.7,
          target: profile.monthlyGoals.customerRating,
          percentage: Math.round((4.7 / profile.monthlyGoals.customerRating) * 100),
        },
      ];
    }

    return [
      { name: "Food Saved", current: 1240, target: 1500, percentage: 83 },
      { name: "Revenue", current: 842.5, target: 750, percentage: 112 },
      { name: "Customer Rating", current: 4.7, target: 4.5, percentage: 104 },
    ];
  }, [apiDashboard, isApiMode, profile]);

  const inventoryData = useMemo(() => {
    if (!isApiMode || !apiDashboard) return inventoryItems;
    return apiDashboard.expiringSoon.map((item) => ({
      id: item.id,
      name: item.name,
      stock: item.stock,
      expiry: item.timeRemaining,
      status: mapExpiringStatus(item.timeRemaining, item.isUrgent),
      isUrgent: item.isUrgent,
    }));
  }, [apiDashboard, isApiMode]);

  const topCustomersData = useMemo(() => {
    if (!isApiMode || !apiDashboard) return topCustomers;
    return apiDashboard.topCustomers.map((customer) => ({
      name: customer.name,
      orders: customer.orderCount,
      spent: `$${customer.totalSpent.toLocaleString()}`,
      rating: customer.rating,
    }));
  }, [apiDashboard, isApiMode]);

  const environmentalImpactData = useMemo(() => {
    if (!isApiMode || !apiDashboard) return undefined;
    return apiDashboard.environmentalImpact;
  }, [apiDashboard, isApiMode]);

  useEffect(() => {
    if (!isApiMode) {
      setRecentOrders(initialRecentOrders);
      return;
    }

    if (!apiDashboard) return;

    const mappedOrders: VendorOrder[] = apiDashboard.recentOrders.map((order) => ({
      id: order.orderId,
      customer: order.customerName,
      item: order.productName,
      amount: `$${order.amount.toFixed(2)}`,
      status: mapOrderStatus(order.status),
      time: order.pickupTime,
      timeSlot: order.pickupTime,
      orderPlacedTime: new Date(order.pickupTime),
      customerEmail: "",
      customerPhone: order.customerPhone,
      pickupAddress: order.pickupLocation,
      paymentMethod: "N/A",
      orderNotes: "",
      items: [{ name: order.productName, quantity: 1, price: order.amount }],
      subtotal: order.amount,
      tax: 0,
      total: order.amount,
    }));

    setRecentOrders(mappedOrders);
  }, [apiDashboard, isApiMode]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (event.ctrlKey || event.metaKey) {
        switch (event.key.toLowerCase()) {
          case "n":
            event.preventDefault();
            handleCreateListing();
            break;
          case "o":
            event.preventDefault();
            handleViewAllOrders();
            break;
          case "p":
            event.preventDefault();
            handlePrintPickupList();
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  const handleViewAllOrders = () => {
    navigate("/panel/vendor/orders");
  };

  const handleCreateListing = () => {
    navigate("/panel/vendor/create-listing");
  };

  const handleViewAnalytics = () => {
    navigate("/panel/vendor/analytics");
  };

  const handlePrintPickupList = () => {
    toast.success("Preparing pickup list for printing...");
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const navigateToCreateWithPrefilled = (item: {
    name: string;
    stock: number;
    expiry: string;
    status: string;
  }) => {
    navigate("/panel/vendor/create-listing", {
      state: {
        prefilledData: {
          name: item.name,
          stock: item.stock,
          expiry: item.expiry,
          status: item.status,
          category: "bakery",
          price: getSuggestedPrice(item.name),
        },
      },
    });
  };

  const handleViewOrderDetails = (order: VendorOrder) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleMarkAsReady = (orderId: string) => {
    setRecentOrders(
      recentOrders.map((order) =>
        order.id === orderId ? { ...order, status: "Ready for Pickup" } : order,
      ),
    );
    toast.success("Order marked as ready for pickup");
  };

  const handleMarkAsPickedUp = (orderId: string) => {
    setRecentOrders(
      recentOrders.map((order) =>
        order.id === orderId ? { ...order, status: "Picked Up" } : order,
      ),
    );
    toast.success("Order marked as picked up");
  };

  const handleCancelOrder = (orderId: string) => {
    setRecentOrders(
      recentOrders.map((order) =>
        order.id === orderId ? { ...order, status: "Cancelled" } : order,
      ),
    );
    toast.error("Order cancelled");
  };

  const handlePrintOrder = (order: VendorOrder) => {
    toast.success(`Printing receipt for ${order.id}...`);
  };

  const handleCopyOrderId = (orderId: string) => {
    navigator.clipboard.writeText(orderId);
    toast.success("Order ID copied");
  };

  if (isApiMode && isApiLoading) {
    return <SkeletonDashboard />;
  }

  if (isApiMode && apiError) {
    return <ApiErrorState onRetry={() => refetch()} error={apiError} />;
  }

  return (
    <div className="p-6 space-y-6 relative">
      <DashboardHeader />

      <StatsGrid stats={statsData} />

      <MonthlyGoalsCard
        goals={monthlyGoals}
        onSetGoal={() => navigate("/panel/vendor/profile")}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <WeeklyPerformanceCard data={weeklyData} />
        <InventoryStatusCard
          items={inventoryData}
          onCreateListing={navigateToCreateWithPrefilled}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TopCustomersCard customers={topCustomersData} />
        <div className="lg:col-span-1 flex flex-col gap-6">
          <EnvironmentalImpactCard data={environmentalImpactData} />
          <QuickActionsCard
            onCreateListing={handleCreateListing}
            onViewAllOrders={handleViewAllOrders}
            onViewAnalytics={handleViewAnalytics}
            onPrintPickupList={handlePrintPickupList}
          />
        </div>
      </div>

      <RecentOrdersTable
        orders={recentOrders}
        onViewAllOrders={handleViewAllOrders}
        onViewOrderDetails={handleViewOrderDetails}
        onMarkAsPickedUp={handleMarkAsPickedUp}
        onMarkAsReady={handleMarkAsReady}
        onCancelOrder={handleCancelOrder}
        onPrintOrder={handlePrintOrder}
        onCopyOrderId={handleCopyOrderId}
        getInitials={getInitials}
        getStatusColor={getStatusColor}
      />

      <OrderDetailsDialog
        open={showOrderDetails}
        onOpenChange={setShowOrderDetails}
        selectedOrder={selectedOrder}
        getStatusColor={getStatusColor}
        onSendReceipt={() => {
          toast.success("Order receipt sent to customer");
          setShowOrderDetails(false);
        }}
        onContactCustomer={() => {
          toast.success("Customer contacted");
          setShowOrderDetails(false);
        }}
        onClose={() => setShowOrderDetails(false)}
      />
    </div>
  );
}
