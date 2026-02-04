import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { profileService } from "../../../services/profile/profileService";
import { UserProfile } from "../../../types/profile";
import { VendorOrder } from "../types";
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

export function VendorDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [statsData] = useState(initialStatsData);
  const [recentOrders, setRecentOrders] =
    useState<VendorOrder[]>(initialRecentOrders);
  const [selectedOrder, setSelectedOrder] = useState<VendorOrder | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  useEffect(() => {
    const currentProfile = profileService.getCurrentProfile();
    setProfile(currentProfile);
  }, []);

  const monthlyGoals = profile?.monthlyGoals
    ? [
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
          percentage: Math.round(
            (4.7 / profile.monthlyGoals.customerRating) * 100,
          ),
        },
      ]
    : [
        { name: "Food Saved", current: 1240, target: 1500, percentage: 83 },
        { name: "Revenue", current: 842.5, target: 750, percentage: 112 },
        { name: "Customer Rating", current: 4.7, target: 4.5, percentage: 104 },
      ];

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
          items={inventoryItems}
          onCreateListing={navigateToCreateWithPrefilled}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TopCustomersCard customers={topCustomers} />
        <div className="lg:col-span-1 flex flex-col gap-6">
          <EnvironmentalImpactCard />
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
