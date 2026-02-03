// src/components/vendor/VendorDashboard.tsx
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Package,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Clock,
  Star,
  ShieldCheck,
  AlertTriangle,
  Plus,
  Printer,
  ChevronRight,
  Bell,
  X,
  CheckCircle2,
  Users,
  Eye,
  Mail,
  Phone,
  CalendarDays,
  MapPin,
  CreditCard,
  Target,
  MoreVertical,
  CheckCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { VendorOrder } from "./types";
import { profileService } from "../../services/profile/profileService";
import { UserProfile } from "../../types/profile";

const initialStatsData = [
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

const weeklyData = [
  { day: "Mon", sales: 45, items: 8, pickups: 12 },
  { day: "Tue", sales: 52, items: 10, pickups: 15 },
  { day: "Wed", sales: 38, items: 7, pickups: 10 },
  { day: "Thu", sales: 65, items: 12, pickups: 18 },
  { day: "Fri", sales: 78, items: 15, pickups: 22 },
  { day: "Sat", sales: 92, items: 18, pickups: 25 },
  { day: "Sun", sales: 71, items: 14, pickups: 20 },
];

const topCustomers = [
  { name: "Emma Wilson", orders: 24, spent: "$119.76", rating: 5 },
  { name: "John Smith", orders: 18, spent: "$89.82", rating: 5 },
  { name: "Sarah Johnson", orders: 15, spent: "$74.85", rating: 4.8 },
  { name: "Mike Chen", orders: 12, spent: "$59.88", rating: 4.9 },
  { name: "Alex Turner", orders: 10, spent: "$69.90", rating: 5 },
  { name: "Lisa Rodriguez", orders: 9, spent: "$59.91", rating: 4.8 },
  { name: "David Kim", orders: 8, spent: "$55.92", rating: 4.9 },
];

const inventoryItems = [
  {
    id: 1,
    name: "Bakery Surprise Bag",
    stock: 2,
    expiry: "Today, 6:00 PM",
    status: "critical" as const,
  },
  {
    id: 2,
    name: "Pastry Assortment",
    stock: 5,
    expiry: "Tomorrow, 12:00 PM",
    status: "medium" as const,
  },
  {
    id: 3,
    name: "Sandwich Bundle",
    stock: 8,
    expiry: "Tomorrow, 8:00 PM",
    status: "good" as const,
  },
];

const initialRecentOrders: VendorOrder[] = [
  {
    id: "#ORD-1247",
    customer: "Emma Wilson",
    item: "Bakery Surprise Bag",
    amount: "$4.99",
    status: "Picked Up",
    time: "2 hours ago",
    timeSlot: "3:00 PM - 4:00 PM",
    orderPlacedTime: new Date(Date.now() - 3 * 60 * 60 * 1000),
    customerEmail: "emma.wilson@example.com",
    customerPhone: "+1 (555) 123-4567",
    pickupAddress: "123 Main St, Anytown, USA",
    paymentMethod: "Credit Card",
    orderNotes: "Please include extra napkins",
    items: [
      { name: "Bakery Surprise Bag", quantity: 1, price: 4.99 },
      { name: "Extra Pastry", quantity: 1, price: 2.5 },
    ],
    subtotal: 7.49,
    tax: 0.6,
    total: 8.09,
    avatarColor: "bg-gradient-to-br from-pink-400 to-rose-500",
  },
  {
    id: "#ORD-1246",
    customer: "John Smith",
    item: "Bakery Surprise Bag",
    amount: "$4.99",
    status: "Ready for Pickup",
    time: "4 hours ago",
    timeSlot: "2:00 PM - 3:00 PM",
    orderPlacedTime: new Date(Date.now() - 4 * 60 * 60 * 1000),
    customerEmail: "john.smith@example.com",
    customerPhone: "+1 (555) 987-6543",
    pickupAddress: "456 Oak Ave, Anytown, USA",
    paymentMethod: "Apple Pay",
    orderNotes: "Allergic to nuts",
    items: [{ name: "Bakery Surprise Bag", quantity: 1, price: 4.99 }],
    subtotal: 4.99,
    tax: 0.4,
    total: 5.39,
    avatarColor: "bg-gradient-to-br from-blue-400 to-cyan-500",
  },
  {
    id: "#ORD-1245",
    customer: "Sarah Johnson",
    item: "Bakery Surprise Bag",
    amount: "$4.99",
    status: "Pending Pickup",
    time: "30 min ago",
    timeSlot: "5:00 PM - 6:00 PM",
    orderPlacedTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    customerEmail: "sarah.j@example.com",
    customerPhone: "+1 (555) 456-7890",
    pickupAddress: "789 Pine Rd, Anytown, USA",
    paymentMethod: "Credit Card",
    orderNotes: "",
    items: [{ name: "Bakery Surprise Bag", quantity: 1, price: 4.99 }],
    subtotal: 4.99,
    tax: 0.4,
    total: 5.39,
    avatarColor: "bg-gradient-to-br from-green-400 to-emerald-500",
  },
  {
    id: "#ORD-1244",
    customer: "Mike Chen",
    item: "Bakery Surprise Bag",
    amount: "$4.99",
    status: "In Progress",
    time: "1 hour ago",
    timeSlot: "4:00 PM - 5:00 PM",
    orderPlacedTime: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
    customerEmail: "mike.chen@example.com",
    customerPhone: "+1 (555) 234-5678",
    pickupAddress: "101 Maple Dr, Anytown, USA",
    paymentMethod: "Google Pay",
    orderNotes: "Will pick up early if possible",
    items: [{ name: "Bakery Surprise Bag", quantity: 1, price: 4.99 }],
    subtotal: 4.99,
    tax: 0.4,
    total: 5.39,
    avatarColor: "bg-gradient-to-br from-orange-400 to-red-500",
  },
  {
    id: "#ORD-1243",
    customer: "Alex Turner",
    item: "Pastry Assortment",
    amount: "$6.99",
    status: "Pending Pickup",
    time: "2 hours ago",
    timeSlot: "6:00 PM - 7:00 PM",
    orderPlacedTime: new Date(Date.now() - 3.5 * 60 * 60 * 1000),
    customerEmail: "alex.t@example.com",
    customerPhone: "+1 (555) 876-5432",
    pickupAddress: "202 Birch Ln, Anytown, USA",
    paymentMethod: "Credit Card",
    orderNotes: "Prefer chocolate pastries",
    items: [{ name: "Pastry Assortment", quantity: 1, price: 6.99 }],
    subtotal: 6.99,
    tax: 0.56,
    total: 7.55,
    avatarColor: "bg-gradient-to-br from-purple-400 to-indigo-500",
  },
];

export function VendorDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [statsData, setStatsData] = useState(initialStatsData);
  const [recentOrders, setRecentOrders] =
    useState<VendorOrder[]>(initialRecentOrders);
  const [selectedOrder, setSelectedOrder] = useState<VendorOrder | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  // Load profile on mount
  useEffect(() => {
    const currentProfile = profileService.getCurrentProfile();
    setProfile(currentProfile);
  }, []);

  // Calculate monthly goals based on profile - NOW INSIDE COMPONENT
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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "n":
            e.preventDefault();
            handleCreateListing();
            break;
          case "o":
            e.preventDefault();
            handleViewAllOrders();
            break;
          case "p":
            e.preventDefault();
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

  const navigateToCreateWithPrefilled = (item: any) => {
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

  const getSuggestedPrice = (name: string) => {
    if (name.includes("Surprise Bag")) return 15.0;
    if (name.includes("Pastry")) return 12.0;
    if (name.includes("Sandwich")) return 10.0;
    return 8.0;
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

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const getStatusColor = (status: VendorOrder["status"]) => {
    switch (status) {
      case "Picked Up":
        return "bg-green-100 text-green-800 border-green-200";
      case "Ready for Pickup":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Pending Pickup":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "In Progress":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="p-6 space-y-6 relative">
      {/* Header */}
      <div className="mb-2 flex items-start justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Welcome back! Here's your business overview for today
          </p>
          <div className="flex gap-3 mt-3 text-xs text-gray-400 flex-wrap">
            <div className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-gray-100 rounded border">Ctrl+N</kbd>
              <span>New Listing</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-gray-100 rounded border">Ctrl+O</kbd>
              <span>Orders</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statsData.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <span
                  className={`text-sm font-medium ${
                    stat.change.startsWith("+")
                      ? "text-green-600"
                      : stat.change.startsWith("-")
                        ? "text-red-600"
                        : "text-gray-600"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Monthly Goals */}
      <Card className="border-emerald-200 bg-emerald-50/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-emerald-600" />
              <CardTitle className="text-emerald-900">Monthly Goals</CardTitle>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/panel/vendor/profile")}
              className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
            >
              <Target className="h-4 w-4 mr-2" />
              Set Monthly Goal
            </Button>
          </div>
          <p className="text-sm text-emerald-600">Track your progress</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {monthlyGoals.map((goal) => (
              <div
                key={goal.name}
                className="p-4 bg-white rounded-lg border border-emerald-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-sm">{goal.name}</p>
                  <span
                    className={`text-xs font-medium ${
                      goal.percentage >= 100
                        ? "text-green-600"
                        : "text-gray-600"
                    }`}
                  >
                    {goal.percentage}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full transition-all ${
                      goal.percentage >= 100 ? "bg-green-500" : "bg-emerald-500"
                    }`}
                    style={{ width: `${Math.min(goal.percentage, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600">
                  {typeof goal.current === "number" && goal.current % 1 !== 0
                    ? `$${goal.current.toFixed(2)}`
                    : goal.current}{" "}
                  / {goal.target}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Three Column Layout: Charts, Customer Insights, Inventory */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Performance Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <CardTitle>Weekly Performance</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Week
                </Button>
                <Button variant="ghost" size="sm">
                  Month
                </Button>
                <Button variant="ghost" size="sm">
                  Quarter
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "6px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="sales"
                  fill="#10b981"
                  name="Sales ($)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="pickups"
                  fill="#3b82f6"
                  name="Pickups"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Inventory Widget */}
        <Card className="border-orange-200 bg-orange-50/30">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-orange-900">
                Inventory Status
              </CardTitle>
            </div>
            <p className="text-sm text-orange-600">Items expiring soon</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {inventoryItems.map((item) => {
                const statusConfig = {
                  critical: {
                    bg: "bg-red-50",
                    border: "border-red-200",
                    text: "text-red-700",
                    icon: AlertTriangle,
                    label: "Expires in less than 2 hours!",
                  },
                  low: {
                    bg: "bg-orange-50",
                    border: "border-orange-200",
                    text: "text-orange-700",
                    icon: AlertTriangle,
                    label: "Expires in less than 6 hours",
                  },
                  medium: {
                    bg: "bg-yellow-50",
                    border: "border-yellow-200",
                    text: "text-yellow-700",
                    icon: Clock,
                    label: "Expires in less than 24 hours",
                  },
                  good: {
                    bg: "bg-green-50",
                    border: "border-green-200",
                    text: "text-green-700",
                    icon: CheckCircle2,
                    label: "Plenty of time until expiry",
                  },
                };

                const config = statusConfig[item.status] || statusConfig.good;
                const Icon = config.icon;

                return (
                  <div
                    key={item.id}
                    className={`p-3 rounded-lg border ${config.bg} ${config.border}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">
                          {item.name}
                        </p>
                        <p className={`text-xs ${config.text} mt-1`}>
                          Stock: {item.stock} • Expires: {item.expiry}
                        </p>
                        <p
                          className={`text-xs font-medium ${config.text} mt-1`}
                        >
                          {config.label}
                        </p>
                      </div>
                      <Icon
                        className={`h-4 w-4 ${config.text} flex-shrink-0 mt-0.5`}
                      />
                    </div>
                    {item.status === "critical" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full mt-2 text-xs border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400"
                        onClick={() => navigateToCreateWithPrefilled(item)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Create Listing Now
                      </Button>
                    )}
                    {(item.status === "low" || item.status === "medium") && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full mt-2 text-xs"
                        onClick={() => navigateToCreateWithPrefilled(item)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Create Listing
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Insights, Environmental Impact, and Quick Actions Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Insights - Full Height */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              <CardTitle>Top Customers</CardTitle>
            </div>
            <p className="text-sm text-gray-500">Your most loyal customers</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topCustomers.map((customer, idx) => (
                <div
                  key={customer.name}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {idx + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm truncate">
                        {customer.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {customer.orders} orders • {customer.spent}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">
                      {customer.rating}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Environmental Impact + Quick Actions in one column */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Environmental Impact - Half Height */}
          <Card className="border-emerald-200 bg-emerald-50/30 flex-1">
            <CardHeader>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                <CardTitle className="text-emerald-900">
                  Environmental Impact
                </CardTitle>
              </div>
              <p className="text-sm text-emerald-600">
                This month's contribution
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 h-full">
                <div className="p-3 bg-white rounded-lg border border-emerald-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-emerald-700">Food saved</span>
                    <span className="font-bold text-emerald-800 text-lg">
                      1,240 lbs
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-emerald-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-emerald-700">
                      CO₂ prevented
                    </span>
                    <span className="font-bold text-emerald-800 text-lg">
                      620 kg
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-emerald-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-emerald-700">
                      Meals provided
                    </span>
                    <span className="font-bold text-emerald-800 text-lg">
                      1,032
                    </span>
                  </div>
                </div>
                <div className="pt-2 border-t border-emerald-200">
                  <p className="text-xs text-emerald-600 text-center">
                    You're making a real difference! 🌱
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Card - Fills remaining space */}
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <p className="text-sm text-gray-500">Frequently used tasks</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-full">
                <Button
                  className="h-auto py-4 justify-start hover:bg-blue-50 hover:border-blue-200 transition-colors"
                  variant="outline"
                  onClick={handleCreateListing}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Plus className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">Create New Listing</p>
                        <p className="text-sm text-gray-500">
                          Add surplus items
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </Button>

                <Button
                  className="h-auto py-4 justify-start hover:bg-purple-50 hover:border-purple-200 transition-colors"
                  variant="outline"
                  onClick={handleViewAllOrders}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <ShoppingBag className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">Manage Orders</p>
                        <p className="text-sm text-gray-500">View all orders</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </Button>

                <Button
                  className="h-auto py-4 justify-start hover:bg-green-50 hover:border-green-200 transition-colors"
                  variant="outline"
                  onClick={handleViewAnalytics}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">View Analytics</p>
                        <p className="text-sm text-gray-500">
                          Performance insights
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </Button>

                <Button
                  className="h-auto py-4 justify-start hover:bg-gray-100 hover:border-gray-300 transition-colors"
                  variant="outline"
                  onClick={handlePrintPickupList}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Printer className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">Print Pickup List</p>
                        <p className="text-sm text-gray-500">
                          Today's schedule
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Orders Table - Full Width with Action Controls */}
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Orders</CardTitle>
            <p className="text-sm text-gray-500 mt-1">Latest order activity</p>
          </div>
          <Button
            onClick={handleViewAllOrders}
            variant="ghost"
            size="sm"
            className="text-green-600 hover:text-green-700 hover:bg-green-50"
          >
            View all orders
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                    Order ID
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                    Customer
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                    Item
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                    Pickup Time
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                    Status
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm w-[300px]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-500">
                      No recent orders
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium text-sm whitespace-nowrap">
                        {order.id}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-8 h-8 flex items-center justify-center rounded-full ${
                              order.avatarColor ??
                              "bg-gradient-to-br from-purple-400 to-blue-500"
                            } text-white font-bold text-xs`}
                          >
                            {getInitials(order.customer)}
                          </div>
                          <span className="text-sm whitespace-nowrap">
                            {order.customer}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-sm whitespace-nowrap">
                        {order.item}
                      </td>

                      <td className="py-3 px-4 font-medium text-sm whitespace-nowrap">
                        {order.amount}
                      </td>

                      <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap">
                        {order.timeSlot}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <Badge
                          variant="outline"
                          className={getStatusColor(order.status)}
                        >
                          {order.status}
                        </Badge>
                      </td>

                      {/* ✅ ACTIONS – FIXED & FAR RIGHT */}
                      <td className="py-3 px-4">
                        <div className="flex justify-end items-center gap-2 whitespace-nowrap">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewOrderDetails(order)}
                            className="border-blue-300 text-blue-700 hover:bg-blue-50"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>

                          {order.status === "Ready for Pickup" && (
                            <Button
                              size="sm"
                              className="w-[120px] justify-center bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => handleMarkAsPickedUp(order.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Picked Up
                            </Button>
                          )}

                          {(order.status === "In Progress" ||
                            order.status === "Pending Pickup") && (
                            <Button
                              size="sm"
                              className="w-[120px] justify-center bg-blue-600 hover:bg-blue-700 text-white"
                              onClick={() => handleMarkAsReady(order.id)}
                            >
                              <Package className="h-4 w-4 mr-1" />
                              Mark Ready
                            </Button>
                          )}

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="outline">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                              align="end"
                              className="w-48 bg-white"
                            >
                              <DropdownMenuLabel>
                                Order Actions
                              </DropdownMenuLabel>

                              <DropdownMenuItem
                                onClick={() => {
                                  navigator.clipboard.writeText(order.id);
                                  toast.success("Order ID copied");
                                }}
                              >
                                Copy Order ID
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => handlePrintOrder(order)}
                              >
                                <Printer className="h-4 w-4 mr-2" />
                                Print Receipt
                              </DropdownMenuItem>

                              {order.status !== "Picked Up" &&
                                order.status !== "Cancelled" && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleCancelOrder(order.id)
                                      }
                                      className="text-red-600"
                                    >
                                      <X className="h-4 w-4 mr-2" />
                                      Cancel Order
                                    </DropdownMenuItem>
                                  </>
                                )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      <Dialog open={showOrderDetails} onOpenChange={setShowOrderDetails}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-blue-600" />
                  Order Details: {selectedOrder.id}
                </DialogTitle>
                <DialogDescription>
                  Completed on {selectedOrder.time}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Order Status & Summary */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {selectedOrder.customer}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {selectedOrder.customerEmail} •{" "}
                        {selectedOrder.customerPhone}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={getStatusColor(selectedOrder.status)}
                    >
                      {selectedOrder.status}
                    </Badge>
                  </div>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-xs font-medium">Pickup Time</p>
                        <p className="text-xs text-gray-600">
                          {selectedOrder.timeSlot}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-xs font-medium">Pickup Location</p>
                        <p className="text-xs text-gray-600">
                          {selectedOrder.pickupAddress}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-xs font-medium">Payment Method</p>
                        <p className="text-xs text-gray-600">
                          {selectedOrder.paymentMethod}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="font-semibold mb-3">Order Items</h4>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Notes */}
                {selectedOrder.orderNotes && (
                  <div>
                    <h4 className="font-semibold mb-2">Customer Notes</h4>
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-sm text-amber-800">
                        {selectedOrder.orderNotes}
                      </p>
                    </div>
                  </div>
                )}

                {/* Order Summary */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Order Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>${selectedOrder.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span>${selectedOrder.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-semibold text-lg">
                      <span>Total</span>
                      <span className="text-green-600">
                        ${selectedOrder.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      toast.success("Order receipt sent to customer");
                      setShowOrderDetails(false);
                    }}
                    className="flex-1"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Receipt
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      toast.success("Customer contacted");
                      setShowOrderDetails(false);
                    }}
                    className="flex-1"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Contact Customer
                  </Button>
                  <Button
                    onClick={() => setShowOrderDetails(false)}
                    className="flex-1"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
