
//fix view all orders
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Added for navigation
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import {
  DollarSign,
  Users,
  Store,
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Clock,
  CheckCircle,
  MoreVertical,
  Download,
  Calendar,
  Filter,
} from "lucide-react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

// Enhanced Stats Data
const statsData = [
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

// Enhanced Monthly Data
const monthlyData = [
  { month: "Jan", revenue: 28500, orders: 625, users: 6500, avgOrder: 45.6 },
  { month: "Feb", revenue: 32200, orders: 710, users: 7000, avgOrder: 45.35 },
  { month: "Mar", revenue: 35800, orders: 790, users: 7200, avgOrder: 45.32 },
  { month: "Apr", revenue: 38900, orders: 850, users: 7800, avgOrder: 45.76 },
  { month: "May", revenue: 41200, orders: 920, users: 8100, avgOrder: 44.78 },
  { month: "Jun", revenue: 42584, orders: 950, users: 8342, avgOrder: 44.83 },
];

// Enhanced Category Data
const categoryData = [
  {
    name: "Bakery",
    value: 35,
    color: "#f59e0b",
    listings: 128,
    revenue: "$14,904",
  },
  {
    name: "Restaurants",
    value: 30,
    color: "#ef4444",
    listings: 110,
    revenue: "$12,775",
  },
  {
    name: "Grocery",
    value: 20,
    color: "#10b981",
    listings: 73,
    revenue: "$8,517",
  },
  {
    name: "Cafes",
    value: 10,
    color: "#3b82f6",
    listings: 37,
    revenue: "$4,267",
  },
  {
    name: "Other",
    value: 5,
    color: "#8b5cf6",
    listings: 18,
    revenue: "$2,121",
  },
];

// Enhanced Recent Orders
const recentOrders = [
  {
    id: "#ORD-1247",
    user: "Emma Wilson",
    vendor: "Green Valley Bakery",
    items: "Surprise Bag",
    amount: "$4.99",
    status: "completed",
    time: "2 min ago",
    avatarColor: "bg-green-100 text-green-700",
  },
  {
    id: "#ORD-1246",
    user: "John Smith",
    vendor: "City Cafe",
    items: "Coffee & Pastries",
    amount: "$5.99",
    status: "completed",
    time: "15 min ago",
    avatarColor: "bg-blue-100 text-blue-700",
  },
  {
    id: "#ORD-1245",
    user: "Sarah Johnson",
    vendor: "Fresh Market",
    items: "Produce Box",
    amount: "$7.99",
    status: "pending",
    time: "32 min ago",
    avatarColor: "bg-yellow-100 text-yellow-700",
  },
  {
    id: "#ORD-1244",
    user: "Mike Chen",
    vendor: "Downtown Deli",
    items: "Sandwich Pack",
    amount: "$6.50",
    status: "completed",
    time: "1 hour ago",
    avatarColor: "bg-purple-100 text-purple-700",
  },
  {
    id: "#ORD-1243",
    user: "Lisa Anderson",
    vendor: "Bakery Corner",
    items: "Bread Basket",
    amount: "$8.25",
    status: "completed",
    time: "2 hours ago",
    avatarColor: "bg-pink-100 text-pink-700",
  },
];

// Custom Tooltip Components
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <p className="font-semibold text-gray-900 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-600">{entry.name}: </span>
            <span className="text-sm font-semibold">
              {entry.name.includes("Revenue")
                ? `$${entry.value.toLocaleString()}`
                : entry.name.includes("Order")
                  ? `$${entry.value.toFixed(2)}`
                  : entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: data.color }}
          />
          <p className="font-semibold text-gray-900">{data.name}</p>
        </div>
        <p className="text-sm text-gray-600">{data.value}% of listings</p>
        <p className="text-sm text-gray-600">{data.listings} active listings</p>
        <p className="text-sm font-semibold text-green-600">
          {data.revenue} revenue
        </p>
      </div>
    );
  }
  return null;
};

// Custom Legend Component
const CustomLegend = ({ payload }) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {payload.map((entry, index) => (
        <div key={`item-${index}`} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-gray-600">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export function Dashboard() {
  const navigate = useNavigate(); // For navigation
  const [timeRange, setTimeRange] = useState("30d");
  const [isLoading, setIsLoading] = useState(false);

  // Simulate loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [timeRange]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Handle navigation to orders view
  const handleViewAllOrders = () => {
    navigate("/orders"); // Adjust the route as needed
  };

  // Event handlers for dropdown menu items
  const handleViewDetails = (orderId: string) => {
    console.log(`View details for order: ${orderId}`);
    // Add your view details logic here
  };

  const handleContactUser = (userId: string) => {
    console.log(`Contact user: ${userId}`);
    // Add your contact user logic here
  };

  const handleContactVendor = (vendorName: string) => {
    console.log(`Contact vendor: ${vendorName}`);
    // Add your contact vendor logic here
  };

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
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Grid - Enhanced */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat) => (
          <Card
            key={stat.title}
            className="hover:shadow-lg transition-shadow duration-300"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="flex items-center gap-1">
                  {stat.isPositive ? (
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-600" />
                  )}
                  <span
                    className={`text-sm font-medium ${stat.isPositive ? "text-green-600" : "text-red-600"}`}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </h3>
                <p className="text-xs text-gray-400">{stat.description}</p>
              </div>

              {/* Mini trend line */}
              <div className="mt-4">
                <ResponsiveContainer width="100%" height={30}>
                  <AreaChart
                    data={stat.trend.map((value, index) => ({ value }))}
                  >
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={stat.isPositive ? "#10b981" : "#ef4444"}
                      fill={stat.isPositive ? "#d1fae5" : "#fee2e2"}
                      strokeWidth={1.5}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row - Enhanced */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue & Orders Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Revenue & Orders Trend</CardTitle>
              <CardDescription>Monthly performance overview</CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Revenue</DropdownMenuItem>
                <DropdownMenuItem>Orders</DropdownMenuItem>
                <DropdownMenuItem>Users</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6b7280" }}
                  />
                  <YAxis
                    yAxisId="left"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6b7280" }}
                    tickFormatter={(value) => `$${value / 1000}k`}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6b7280" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend content={<CustomLegend />} />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    dot={{ stroke: "#10b981", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Revenue"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="orders"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    dot={{ stroke: "#3b82f6", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Orders"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Category Distribution - FIXED OVERFLOW */}
        <Card className="overflow-hidden">
          {" "}
          {/* Added overflow-hidden */}
          <CardHeader>
            <CardTitle>Listings by Category</CardTitle>
            <CardDescription>Marketplace distribution</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            {" "}
            {/* Fixed height */}
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : (
              <>
                <div className="h-[250px]">
                  {" "}
                  {/* Fixed chart height */}
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        labelLine={false}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomPieTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Category Stats - Moved below with proper spacing */}
                <div className="mt-4 overflow-hidden">
                  {" "}
                  {/* Added overflow-hidden */}
                  <div className="grid grid-cols-2 gap-2 max-h-[100px]">
                    {" "}
                    {/* Limited max height */}
                    {categoryData.map((category) => (
                      <div
                        key={category.name}
                        className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
                      >
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-sm font-medium text-gray-700 truncate">
                          {category.name}
                        </span>
                        <span className="text-sm text-gray-500 ml-auto flex-shrink-0">
                          {category.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Table - Enhanced */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest marketplace activity</CardDescription>
          </div>
          <Button
            onClick={handleViewAllOrders} // Added onClick handler
            variant="ghost"
            size="sm"
            className="text-green-600 hover:text-green-700 hover:bg-green-50"
          >
            View all orders
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Order ID
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    User
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Vendor
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Items
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Time
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700"></th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <span className="font-medium text-gray-900">
                        {order.id}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`${order.avatarColor} w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm`}
                        >
                          {getInitials(order.user)}
                        </div>
                        <span className="font-medium text-gray-900">
                          {order.user}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Store className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-700">{order.vendor}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-700">{order.items}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-green-600">
                        {order.amount}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        className={`px-3 py-1 rounded-full ${
                          order.status === "completed"
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          {order.status === "completed" ? (
                            <CheckCircle className="h-3 w-3" />
                          ) : (
                            <Clock className="h-3 w-3" />
                          )}
                          <span className="capitalize">{order.status}</span>
                        </div>
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          {order.time}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-gray-100"
                          >
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4 text-gray-600" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={() => handleViewDetails(order.id)}
                            className="cursor-pointer"
                          >
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleContactUser(order.user)}
                            className="cursor-pointer"
                          >
                            Contact User
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleContactVendor(order.vendor)}
                            className="cursor-pointer"
                          >
                            Contact Vendor
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
