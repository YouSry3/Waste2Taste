import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  BarChart,
  Bar,
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
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
  Star,
  Download,
} from "lucide-react";

// Sample data - Backend will replace these
const monthlyRevenue = [
  { month: "Jan", revenue: 680, orders: 142 },
  { month: "Feb", revenue: 720, orders: 156 },
  { month: "Mar", revenue: 765, orders: 168 },
  { month: "Apr", revenue: 795, orders: 173 },
  { month: "May", revenue: 810, orders: 178 },
  { month: "Jun", revenue: 843, orders: 186 },
];

const categoryBreakdown = [
  { name: "Surprise Bags", value: 65, color: "#10b981", revenue: 548 },
  { name: "Specific Items", value: 25, color: "#3b82f6", revenue: 211 },
  { name: "Donations", value: 10, color: "#f59e0b", revenue: 84 },
];

const peakHours = [
  { hour: "5 PM", orders: 8 },
  { hour: "6 PM", orders: 15 },
  { hour: "7 PM", orders: 22 },
  { hour: "8 PM", orders: 18 },
  { hour: "9 PM", orders: 12 },
];

const topItems = [
  {
    name: "Bakery Surprise Bag",
    sold: 45,
    revenue: 224.55,
    rating: 4.8,
    trend: 12,
  },
  {
    name: "Fresh Pastries Box",
    sold: 38,
    revenue: 227.62,
    rating: 4.9,
    trend: 8,
  },
  {
    name: "Dessert Selection",
    sold: 32,
    revenue: 223.68,
    rating: 5.0,
    trend: -3,
  },
  {
    name: "Bread Variety Pack",
    sold: 28,
    revenue: 139.72,
    rating: 4.7,
    trend: 5,
  },
  {
    name: "Cookie Assortment",
    sold: 13,
    revenue: 64.87,
    rating: 4.6,
    trend: -2,
  },
];

const weeklyComparison = [
  { day: "Mon", current: 45, previous: 38 },
  { day: "Tue", current: 52, previous: 48 },
  { day: "Wed", current: 38, previous: 42 },
  { day: "Thu", current: 67, previous: 55 },
  { day: "Fri", current: 78, previous: 72 },
  { day: "Sat", current: 92, previous: 85 },
  { day: "Sun", current: 71, previous: 68 },
];

const customerInsights = [
  { name: "Sarah Johnson", orders: 15, spent: 74.85, rating: 4.8 },
  { name: "Mike Chen", orders: 12, spent: 59.88, rating: 4.9 },
  { name: "Alex Turner", orders: 10, spent: 69.9, rating: 5.0 },
  { name: "Emma Wilson", orders: 9, spent: 44.91, rating: 4.7 },
  { name: "John Smith", orders: 8, spent: 39.92, rating: 4.6 },
];

export function VendorAnalytics() {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "quarter">(
    "month",
  );

  // Calculate summary stats (backend will provide these)
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
      {/* Header */}
      <div className="mb-4 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
          <p className="text-gray-500">
            Insights into your business performance
          </p>
        </div>

        <div className="flex gap-3">
          {/* Time Range Selector */}
          <div className="flex bg-white rounded-lg shadow-sm border border-gray-200 p-1">
            <button
              onClick={() => setTimeRange("week")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                timeRange === "week"
                  ? "bg-green-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setTimeRange("month")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                timeRange === "month"
                  ? "bg-green-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setTimeRange("quarter")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                timeRange === "quarter"
                  ? "bg-green-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Quarter
            </button>
          </div>

          {/* Export Button */}
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">Export</span>
          </button>
        </div>
      </div>

      {/* Key Metrics Cards */}
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

      {/* Revenue Trend */}
      <Card className="mb-6 shadow-sm border-gray-200">
        <CardHeader className="border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Revenue Trend
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Last 6 months performance
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={monthlyRevenue}>
              <defs>
                <linearGradient
                  id="revenueGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="month"
                tick={{ fill: "#6b7280", fontSize: 12 }}
                axisLine={{ stroke: "#e5e7eb" }}
              />
              <YAxis
                tick={{ fill: "#6b7280", fontSize: 12 }}
                axisLine={{ stroke: "#e5e7eb" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#revenueGradient)"
                name="Revenue ($)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Sales by Type */}
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Sales by Type
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">Breakdown by category</p>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Category Details */}
            <div className="mt-6 space-y-3">
              {categoryBreakdown.map((category, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm text-gray-700">
                      {category.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      ${category.revenue}
                    </p>
                    <p className="text-xs text-gray-500">{category.value}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Peak Pickup Hours */}
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Peak Pickup Hours
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">Busiest times of day</p>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={peakHours}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="hour"
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  axisLine={{ stroke: "#e5e7eb" }}
                />
                <YAxis
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  axisLine={{ stroke: "#e5e7eb" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey="orders"
                  fill="#3b82f6"
                  name="Orders"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Peak time:</strong> 7 PM with 22 orders
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Performance Comparison */}
      <Card className="mb-6 shadow-sm border-gray-200">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Weekly Performance
          </CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            Current week vs. previous week
          </p>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={weeklyComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="day"
                tick={{ fill: "#6b7280", fontSize: 12 }}
                axisLine={{ stroke: "#e5e7eb" }}
              />
              <YAxis
                tick={{ fill: "#6b7280", fontSize: 12 }}
                axisLine={{ stroke: "#e5e7eb" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar
                dataKey="current"
                fill="#10b981"
                name="This Week"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="previous"
                fill="#cbd5e1"
                name="Last Week"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Two Column Layout - Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Items */}
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Top Performing Items
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Best sellers this month
            </p>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {topItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        {item.name}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-gray-600">
                          {item.rating}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.sold} units sold
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      ${item.revenue.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-1 justify-end mt-1">
                      {item.trend >= 0 ? (
                        <>
                          <TrendingUp className="w-3 h-3 text-green-600" />
                          <span className="text-xs text-green-600">
                            +{item.trend}%
                          </span>
                        </>
                      ) : (
                        <>
                          <TrendingDown className="w-3 h-3 text-red-600" />
                          <span className="text-xs text-red-600">
                            {item.trend}%
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Customers */}
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Top Customers
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Most valuable customers
            </p>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {customerInsights.map((customer, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                      {customer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {customer.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">
                          {customer.orders} orders
                        </span>
                        <span className="text-gray-300">•</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-gray-600">
                            {customer.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      ${customer.spent.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Reusable Stat Card Component
interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}

function StatCard({
  title,
  value,
  change,
  icon,
  iconBg,
  iconColor,
}: StatCardProps) {
  const isPositive = change >= 0;

  return (
    <Card className="shadow-sm border-gray-200 hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-gray-500 mb-2">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{value}</h3>
            <div className="flex items-center gap-1">
              {isPositive ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <span
                className={`text-sm font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}
              >
                {isPositive ? "+" : ""}
                {change}%
              </span>
            </div>
          </div>
          <div className={`${iconBg} ${iconColor} p-3 rounded-lg`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}
