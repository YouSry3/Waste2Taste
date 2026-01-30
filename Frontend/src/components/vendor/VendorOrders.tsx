import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Search,
  Eye,
  Filter,
  Download,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Clock,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  ChevronRight,
  CheckSquare,
  Square,
  Plus,
  Printer,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Sample orders data
const initialOrders = [
  {
    id: "ORD-001",
    customer: "Ahmed Hassan",
    listing: "Fresh Croissants Pack",
    amount: "EGP 45",
    status: "Completed",
    date: "2025-11-22 14:30",
    timeSlot: "2:00 PM - 3:00 PM",
    items: ["Croissants", "Pain au Chocolat"],
    phone: "+20 123 456 7890",
    email: "ahmed@example.com",
  },
  {
    id: "ORD-002",
    customer: "Sara Mohamed",
    listing: "Mixed Pastries Box",
    amount: "EGP 60",
    status: "Pending",
    date: "2025-11-22 13:15",
    timeSlot: "5:00 PM - 6:00 PM",
    items: ["Danishes", "Cinnamon Rolls", "Fruit Tarts"],
    phone: "+20 234 567 8901",
    email: "sara@example.com",
  },
  {
    id: "ORD-003",
    customer: "Khaled Ali",
    listing: "Bread Assortment",
    amount: "EGP 30",
    status: "Completed",
    date: "2025-11-22 12:45",
    timeSlot: "1:00 PM - 2:00 PM",
    items: ["Baguette", "Whole Wheat", "Sourdough"],
    phone: "+20 345 678 9012",
    email: "khaled@example.com",
  },
  {
    id: "ORD-004",
    customer: "Layla Ibrahim",
    listing: "Fresh Croissants Pack",
    amount: "EGP 45",
    status: "Ready for Pickup",
    date: "2025-11-22 11:20",
    timeSlot: "4:00 PM - 5:00 PM",
    items: ["Croissants", "Almond Croissants"],
    phone: "+20 456 789 0123",
    email: "layla@example.com",
  },
  {
    id: "ORD-005",
    customer: "Omar Youssef",
    listing: "Cake Slices Pack",
    amount: "EGP 50",
    status: "Cancelled",
    date: "2025-11-22 10:10",
    timeSlot: "3:00 PM - 4:00 PM",
    items: ["Cheesecake", "Chocolate Cake", "Red Velvet"],
    phone: "+20 567 890 1234",
    email: "omar@example.com",
  },
  {
    id: "ORD-006",
    customer: "Nada Kamal",
    listing: "Bakery Surprise Bag",
    amount: "EGP 35",
    status: "Ready for Pickup",
    date: "2025-11-22 09:45",
    timeSlot: "6:00 PM - 7:00 PM",
    items: ["Assorted Pastries", "Bread", "Cookies"],
    phone: "+20 678 901 2345",
    email: "nada@example.com",
  },
  {
    id: "ORD-007",
    customer: "Tarek Said",
    listing: "Morning Breakfast Set",
    amount: "EGP 75",
    status: "Pending",
    date: "2025-11-22 08:30",
    timeSlot: "8:00 AM - 9:00 AM",
    items: ["Croissants", "Bread", "Jam", "Butter"],
    phone: "+20 789 012 3456",
    email: "tarek@example.com",
  },
  {
    id: "ORD-008",
    customer: "Yasmine Farid",
    listing: "Mixed Pastries Box",
    amount: "EGP 60",
    status: "Completed",
    date: "2025-11-21 16:20",
    timeSlot: "4:00 PM - 5:00 PM",
    items: ["Danishes", "Cinnamon Rolls", "Fruit Tarts"],
    phone: "+20 890 123 4567",
    email: "yasmine@example.com",
  },
];

const dailyOrdersData = [
  { day: "Mon", orders: 12, revenue: 540 },
  { day: "Tue", orders: 15, revenue: 675 },
  { day: "Wed", orders: 8, revenue: 360 },
  { day: "Thu", orders: 18, revenue: 810 },
  { day: "Fri", orders: 22, revenue: 990 },
  { day: "Sat", orders: 25, revenue: 1125 },
  { day: "Sun", orders: 10, revenue: 450 },
];

const statusStats = [
  { status: "Completed", count: 4, revenue: "EGP 180" },
  { status: "Pending", count: 2, revenue: "EGP 135" },
  { status: "Ready for Pickup", count: 2, revenue: "EGP 80" },
  { status: "Cancelled", count: 1, revenue: "EGP 50" },
];

type OrderStatus = "Completed" | "Pending" | "Ready for Pickup" | "Cancelled";

interface Order {
  id: string;
  customer: string;
  listing: string;
  amount: string;
  status: OrderStatus;
  date: string;
  timeSlot: string;
  items: string[];
  phone: string;
  email: string;
}

export function VendorOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "All">("All");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState<string | null>(null);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Ready for Pickup":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "Completed":
        return CheckCircle2;
      case "Pending":
        return Clock;
      case "Ready for Pickup":
        return ShoppingBag;
      case "Cancelled":
        return XCircle;
      default:
        return Clock;
    }
  };

  const handleMarkAsCompleted = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? { ...order, status: "Completed" as OrderStatus }
          : order,
      ),
    );

    setSelectedOrders((prev) => prev.filter((id) => id !== orderId));

    toast.success(`Order ${orderId} marked as completed!`, {
      icon: "✅",
      duration: 3000,
    });
  };

  const handleBulkMarkAsCompleted = () => {
    if (selectedOrders.length === 0) {
      toast.error("Please select orders first");
      return;
    }

    selectedOrders.forEach((orderId) => {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? { ...order, status: "Completed" as OrderStatus }
            : order,
        ),
      );
    });

    toast.success(
      `${selectedOrders.length} order${selectedOrders.length > 1 ? "s" : ""} marked as completed!`,
      {
        icon: "✅",
        duration: 3000,
      },
    );

    setSelectedOrders([]);
  };

  const handleBulkRemind = () => {
    if (selectedOrders.length === 0) {
      toast.error("Please select orders first");
      return;
    }

    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: `Sending reminders to ${selectedOrders.length} customer${selectedOrders.length > 1 ? "s" : ""}...`,
        success: `Reminders sent to ${selectedOrders.length} customer${selectedOrders.length > 1 ? "s" : ""}!`,
        error: "Failed to send reminders",
      },
      {
        duration: 3000,
      },
    );

    setSelectedOrders([]);
  };

  const handleRemindCustomer = (orderId: string, customer: string) => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: `Sending reminder to ${customer}...`,
        success: `Reminder sent to ${customer}!`,
        error: "Failed to send reminder",
      },
      {
        duration: 3000,
      },
    );
  };

  const handleExportOrders = () => {
    const csv = [
      [
        "Order ID",
        "Customer",
        "Listing",
        "Amount",
        "Status",
        "Date",
        "Time Slot",
      ],
      ...filteredOrders.map((order) => [
        order.id,
        order.customer,
        order.listing,
        order.amount,
        order.status,
        order.date,
        order.timeSlot,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success("Orders exported successfully!");
  };

  const handlePrintPickupList = () => {
    const readyOrders = orders.filter(
      (order) => order.status === "Ready for Pickup",
    );
    if (readyOrders.length === 0) {
      toast.error("No orders ready for pickup");
      return;
    }

    toast.success("Preparing pickup list for printing...");
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId],
    );
  };

  const selectAllOrders = () => {
    const selectableOrders = filteredOrders
      .filter(
        (order) => order.status !== "Completed" && order.status !== "Cancelled",
      )
      .map((order) => order.id);
    setSelectedOrders(selectableOrders);
  };

  const deselectAllOrders = () => {
    setSelectedOrders([]);
  };

  // Filter orders based on search, status, and date
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.listing.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.phone.includes(searchQuery);

      const matchesStatus =
        statusFilter === "All" || order.status === statusFilter;

      const matchesDate = !dateFilter || order.date.includes(dateFilter);

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [orders, searchQuery, statusFilter, dateFilter]);

  // Calculate order statistics
  const totalRevenue = orders
    .filter((order) => order.status === "Completed")
    .reduce(
      (sum, order) => sum + parseInt(order.amount.replace("EGP ", "")),
      0,
    );

  const pendingOrders = orders.filter(
    (order) => order.status === "Pending",
  ).length;
  const readyOrders = orders.filter(
    (order) => order.status === "Ready for Pickup",
  ).length;
  const completedOrders = orders.filter(
    (order) => order.status === "Completed",
  ).length;

  const viewOrderDetails = (orderId: string) => {
    setShowOrderDetails(orderId);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-3xl font-bold tracking-tight">Orders Management</h1>
        <p className="text-gray-500 mt-1">Manage all orders for your branch</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-green-100">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-sm font-medium text-green-600">+12%</span>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
              <h3 className="text-2xl font-bold">EGP {totalRevenue}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-blue-100">
                <ShoppingBag className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-green-600">
                +{orders.length}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Orders</p>
              <h3 className="text-2xl font-bold">{orders.length}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-yellow-100">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <span className="text-sm font-medium text-yellow-600">
                {pendingOrders}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Pending</p>
              <h3 className="text-2xl font-bold">{pendingOrders}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-purple-100">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-green-600">+18%</span>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Completion Rate</p>
              <h3 className="text-2xl font-bold">
                {orders.length > 0
                  ? Math.round((completedOrders / orders.length) * 100)
                  : 0}
                %
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Orders by Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {statusStats.map((stat) => {
              const Icon = getStatusIcon(stat.status as OrderStatus);
              const colorClass = getStatusColor(
                stat.status as OrderStatus,
              ).split(" ")[0];

              return (
                <div
                  key={stat.status}
                  className="p-4 rounded-lg border bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${colorClass}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold">{stat.status}</p>
                      <p className="text-2xl font-bold">{stat.count}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {stat.revenue} revenue
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Orders Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Orders & Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyOrdersData}>
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
                dataKey="orders"
                fill="#3b82f6"
                name="Orders"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="revenue"
                fill="#10b981"
                name="Revenue (EGP)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Orders Table with Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <CardTitle>All Orders</CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Showing {filteredOrders.length} of {orders.length} orders
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search orders..."
                  className="pl-9 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportOrders}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrintPickupList}
                className="gap-2"
              >
                <Printer className="h-4 w-4" />
                Print Pickup List
              </Button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    size="sm"
                    variant={statusFilter === "All" ? "default" : "outline"}
                    onClick={() => setStatusFilter("All")}
                  >
                    All
                  </Button>
                  <Button
                    size="sm"
                    variant={
                      statusFilter === "Completed" ? "default" : "outline"
                    }
                    onClick={() => setStatusFilter("Completed")}
                  >
                    Completed
                  </Button>
                  <Button
                    size="sm"
                    variant={statusFilter === "Pending" ? "default" : "outline"}
                    onClick={() => setStatusFilter("Pending")}
                  >
                    Pending
                  </Button>
                  <Button
                    size="sm"
                    variant={
                      statusFilter === "Ready for Pickup"
                        ? "default"
                        : "outline"
                    }
                    onClick={() => setStatusFilter("Ready for Pickup")}
                  >
                    Ready
                  </Button>
                  <Button
                    size="sm"
                    variant={
                      statusFilter === "Cancelled" ? "default" : "outline"
                    }
                    onClick={() => setStatusFilter("Cancelled")}
                  >
                    Cancelled
                  </Button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Date</label>
                <Input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-48"
                />
              </div>
            </div>
          )}

          {/* Bulk Actions Bar */}
          {selectedOrders.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-900">
                  {selectedOrders.length} order
                  {selectedOrders.length > 1 ? "s" : ""} selected
                </span>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleBulkMarkAsCompleted}
                  className="bg-white hover:bg-green-50"
                >
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Mark as Completed
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleBulkRemind}
                  className="bg-white hover:bg-amber-50"
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Send Reminders
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={deselectAllOrders}
                  className="bg-white hover:bg-gray-100"
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Deselect All
                </Button>
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="text-left py-3 px-4 w-12">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={selectAllOrders}
                      className="h-8 w-8 p-0"
                      title="Select all active orders"
                    >
                      {selectedOrders.length > 0 &&
                      selectedOrders.length ===
                        filteredOrders.filter(
                          (order) =>
                            order.status !== "Completed" &&
                            order.status !== "Cancelled",
                        ).length ? (
                        <CheckSquare className="h-4 w-4" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                    </Button>
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                    Order ID
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                    Customer
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                    Listing
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                    Date & Time
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center">
                      <ShoppingBag className="h-12 w-12 mx-auto mb-2 opacity-20" />
                      <p className="text-gray-500">No orders found</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Try adjusting your filters
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b last:border-b-0 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order.id)}
                          onChange={() => toggleOrderSelection(order.id)}
                          disabled={
                            order.status === "Completed" ||
                            order.status === "Cancelled"
                          }
                          className="rounded disabled:opacity-30 disabled:cursor-not-allowed"
                        />
                      </td>
                      <td className="py-3 px-4 font-medium text-sm">
                        {order.id}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <div>
                          <p className="font-medium">{order.customer}</p>
                          <p className="text-xs text-gray-500">{order.phone}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <div>
                          <p>{order.listing}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {order.items.slice(0, 2).map((item, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="text-xs"
                              >
                                {item}
                              </Badge>
                            ))}
                            {order.items.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{order.items.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-sm">
                        {order.amount}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant="outline"
                          className={getStatusColor(order.status)}
                        >
                          {order.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        <div>
                          <p>{order.date}</p>
                          <p className="text-xs">{order.timeSlot}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => viewOrderDetails(order.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {order.status === "Ready for Pickup" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleMarkAsCompleted(order.id)}
                              className="border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400"
                            >
                              Mark Completed
                            </Button>
                          )}
                          {order.status === "Pending" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleRemindCustomer(order.id, order.customer)
                              }
                              className="border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400"
                            >
                              Remind
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Quick Actions */}
          {filteredOrders.length > 0 && (
            <div className="mt-6 flex justify-center gap-3">
              <Button
                variant="outline"
                onClick={() => navigate("/panel/vendor/create-listing")}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Create New Listing
              </Button>
              <Button
                variant="outline"
                onClick={handlePrintPickupList}
                className="gap-2"
              >
                <Printer className="h-4 w-4" />
                Print Today's Pickups
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/panel/vendor/analytics")}
                className="gap-2"
              >
                View Analytics
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      {showOrderDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="sticky top-0 bg-white z-10 border-b">
              <div className="flex items-center justify-between">
                <CardTitle>Order Details</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowOrderDetails(null)}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {(() => {
                const order = orders.find((o) => o.id === showOrderDetails);
                if (!order) return null;

                const StatusIcon = getStatusIcon(order.status);

                return (
                  <div className="space-y-6">
                    {/* Order Header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold">{order.id}</h3>
                        <p className="text-gray-500">{order.date}</p>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {order.status}
                      </Badge>
                    </div>

                    {/* Customer Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold mb-2">
                          Customer Information
                        </h4>
                        <p className="text-sm">
                          <strong>Name:</strong> {order.customer}
                        </p>
                        <p className="text-sm">
                          <strong>Phone:</strong> {order.phone}
                        </p>
                        <p className="text-sm">
                          <strong>Email:</strong> {order.email}
                        </p>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold mb-2">
                          Order Information
                        </h4>
                        <p className="text-sm">
                          <strong>Listing:</strong> {order.listing}
                        </p>
                        <p className="text-sm">
                          <strong>Amount:</strong> {order.amount}
                        </p>
                        <p className="text-sm">
                          <strong>Pickup Time:</strong> {order.timeSlot}
                        </p>
                      </div>
                    </div>

                    {/* Items List */}
                    <div>
                      <h4 className="font-semibold mb-3">Items Included</h4>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded"
                          >
                            <span>{item}</span>
                            <Badge variant="outline">Included</Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t">
                      {order.status === "Ready for Pickup" && (
                        <Button
                          onClick={() => {
                            handleMarkAsCompleted(order.id);
                            setShowOrderDetails(null);
                          }}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          Mark as Completed
                        </Button>
                      )}
                      {order.status === "Pending" && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            handleRemindCustomer(order.id, order.customer);
                            setShowOrderDetails(null);
                          }}
                          className="flex-1"
                        >
                          Send Reminder
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        onClick={() => setShowOrderDetails(null)}
                        className="flex-1"
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
