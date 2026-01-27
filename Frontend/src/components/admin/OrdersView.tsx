//mark as picked up color bug


import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  Search,
  MapPin,
  User,
  Store,
  Clock,
  Filter,
  ArrowUpDown,
  Download,
  Eye,
  X,
  Calendar,
  Package,
  DollarSign,
  CreditCard,
  MessageSquare,
  CheckCircle,
  Truck,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Printer,
  FileText,
  BarChart3,
  TrendingUp,
  PieChart,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { cn } from "../../lib/utils";

interface Order {
  id: string;
  user: string;
  vendor: string;
  items: string;
  quantity: number;
  amount: string;
  pickup: string;
  status:
    | "Completed"
    | "Pending Pickup"
    | "Cancelled"
    | "In Progress"
    | "Ready for Pickup";
  date: string;
  address: string;
  paymentMethod: string;
  notes: string;
  customerEmail: string;
  customerPhone: string;
  vendorEmail: string;
  vendorPhone: string;
  itemsList?: Array<{
    name: string;
    quantity: number;
    price: string;
  }>;
  createdAt: string;
  pickedUpAt?: string;
}

const initialOrders: Order[] = [
  {
    id: "#ORD-1247",
    user: "Emma Wilson",
    vendor: "Green Valley Bakery",
    items: "Bakery Surprise Bag",
    quantity: 1,
    amount: "$4.99",
    pickup: "Today, 6:00 PM - 7:00 PM",
    status: "Ready for Pickup",
    date: "2025-10-30",
    address: "123 Valley Road, Suite 101",
    paymentMethod: "Credit Card",
    notes: "Leave at front desk",
    customerEmail: "emma.w@email.com",
    customerPhone: "(555) 123-4567",
    vendorEmail: "bakery@greenvalley.com",
    vendorPhone: "(555) 987-6543",
    itemsList: [
      { name: "Assorted Pastries", quantity: 3, price: "$2.99" },
      { name: "Fresh Bread", quantity: 1, price: "$2.00" },
    ],
    createdAt: "2025-10-30 14:30",
    pickedUpAt: "2025-10-30 18:45",
  },
  {
    id: "#ORD-1246",
    user: "John Smith",
    vendor: "City Cafe",
    items: "Coffee & Pastries",
    quantity: 1,
    amount: "$5.99",
    pickup: "Today, 8:00 PM - 9:00 PM",
    status: "Pending Pickup",
    date: "2025-10-30",
    address: "456 Main Street",
    paymentMethod: "Credit Card",
    notes: "",
    customerEmail: "john.smith@email.com",
    customerPhone: "(555) 234-5678",
    vendorEmail: "contact@citycafe.com",
    vendorPhone: "(555) 876-5432",
    itemsList: [
      { name: "Specialty Coffee", quantity: 1, price: "$3.50" },
      { name: "Croissant", quantity: 1, price: "$2.49" },
    ],
    createdAt: "2025-10-30 13:15",
  },
  {
    id: "#ORD-1245",
    user: "Sarah Johnson",
    vendor: "Fresh Market",
    items: "Produce Box",
    quantity: 1,
    amount: "$7.99",
    pickup: "Today, 7:00 PM - 8:00 PM",
    status: "In Progress",
    date: "2025-10-30",
    address: "789 Market Ave, Unit 5",
    paymentMethod: "Debit Card",
    notes: "Ring bell on arrival",
    customerEmail: "sarah.j@email.com",
    customerPhone: "(555) 345-6789",
    vendorEmail: "info@freshmarket.com",
    vendorPhone: "(555) 765-4321",
    itemsList: [
      { name: "Fresh Vegetables", quantity: 1, price: "$4.50" },
      { name: "Seasonal Fruits", quantity: 1, price: "$3.49" },
    ],
    createdAt: "2025-10-30 11:45",
  },
  {
    id: "#ORD-1244",
    user: "Mike Chen",
    vendor: "Downtown Deli",
    items: "Sandwich Pack",
    quantity: 1,
    amount: "$6.50",
    pickup: "Yesterday, 5:00 PM - 6:00 PM",
    status: "Completed",
    date: "2025-10-29",
    address: "321 Downtown Blvd",
    paymentMethod: "Credit Card",
    notes: "",
    customerEmail: "mike.chen@email.com",
    customerPhone: "(555) 456-7890",
    vendorEmail: "orders@downtowndeli.com",
    vendorPhone: "(555) 654-3210",
    itemsList: [
      { name: "Turkey Sandwich", quantity: 1, price: "$4.50" },
      { name: "Side Salad", quantity: 1, price: "$2.00" },
    ],
    createdAt: "2025-10-29 16:20",
    pickedUpAt: "2025-10-29 17:30",
  },
  {
    id: "#ORD-1243",
    user: "Lisa Anderson",
    vendor: "Organic Bistro",
    items: "Meal Box",
    quantity: 2,
    amount: "$19.98",
    pickup: "Yesterday, 9:00 PM - 10:00 PM",
    status: "Completed",
    date: "2025-10-29",
    address: "147 Organic Way",
    paymentMethod: "PayPal",
    notes: "No onions, please",
    customerEmail: "lisa.a@email.com",
    customerPhone: "(555) 567-8901",
    vendorEmail: "hello@organicbistro.com",
    vendorPhone: "(555) 543-2109",
    itemsList: [{ name: "Vegetarian Meal", quantity: 2, price: "$9.99" }],
    createdAt: "2025-10-29 18:45",
    pickedUpAt: "2025-10-29 21:15",
  },
  {
    id: "#ORD-1242",
    user: "Robert Wilson",
    vendor: "Italian Kitchen",
    items: "Pasta Special",
    quantity: 1,
    amount: "$12.99",
    pickup: "Oct 28, 7:30 PM - 8:30 PM",
    status: "Cancelled",
    date: "2025-10-28",
    address: "789 Pasta Street",
    paymentMethod: "Credit Card",
    notes: "Customer cancelled",
    customerEmail: "r.wilson@email.com",
    customerPhone: "(555) 678-9012",
    vendorEmail: "info@italiankitchen.com",
    vendorPhone: "(555) 432-1098",
    itemsList: [{ name: "Fettuccine Alfredo", quantity: 1, price: "$12.99" }],
    createdAt: "2025-10-28 15:10",
  },
  {
    id: "#ORD-1241",
    user: "Jessica Brown",
    vendor: "Sushi House",
    items: "Sushi Combo",
    quantity: 1,
    amount: "$15.50",
    pickup: "Oct 28, 6:00 PM - 7:00 PM",
    status: "Ready for Pickup",
    date: "2025-10-28",
    address: "234 Sushi Lane",
    paymentMethod: "Apple Pay",
    notes: "Extra soy sauce",
    customerEmail: "jess.b@email.com",
    customerPhone: "(555) 789-0123",
    vendorEmail: "contact@sushihouse.com",
    vendorPhone: "(555) 321-0987",
    itemsList: [{ name: "Sushi Combo", quantity: 1, price: "$15.50" }],
    createdAt: "2025-10-28 14:20",
    pickedUpAt: "2025-10-28 18:30",
  },
  {
    id: "#ORD-1240",
    user: "David Lee",
    vendor: "Burger Joint",
    items: "Burger Meal",
    quantity: 2,
    amount: "$18.98",
    pickup: "Oct 27, 8:00 PM - 9:00 PM",
    status: "In Progress",
    date: "2025-10-27",
    address: "567 Burger Ave",
    paymentMethod: "Credit Card",
    notes: "One burger no pickles",
    customerEmail: "david.lee@email.com",
    customerPhone: "(555) 890-1234",
    vendorEmail: "orders@burgerjoint.com",
    vendorPhone: "(555) 210-9876",
    itemsList: [{ name: "Cheeseburger Meal", quantity: 2, price: "$9.49" }],
    createdAt: "2025-10-27 17:45",
  },
];

const orderStatusColors = {
  Completed: "bg-green-100 text-green-700 hover:bg-green-200",
  "Ready for Pickup": "bg-blue-100 text-blue-700 hover:bg-blue-200",
  "Pending Pickup": "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
  Cancelled: "bg-red-100 text-red-700 hover:bg-red-200",
  "In Progress": "bg-purple-100 text-purple-700 hover:bg-purple-200",
};

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

// Enhanced chart data with actual order data
const getChartData = (orders: Order[]) => {
  // Daily revenue data
  const revenueByDay: Record<string, number> = {};
  orders.forEach((order) => {
    if (order.status !== "Cancelled") {
      const date = order.date;
      const amount = parseFloat(order.amount.replace("$", ""));
      revenueByDay[date] = (revenueByDay[date] || 0) + amount;
    }
  });

  const dailyRevenueData = Object.entries(revenueByDay)
    .slice(-7) // Last 7 days
    .map(([day, revenue]) => ({
      day: new Date(day).toLocaleDateString("en-US", { weekday: "short" }),
      revenue,
    }));

  // Order status data
  const statusCounts = orders.reduce(
    (acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const orderStatusData = Object.entries(statusCounts).map(([name, value]) => ({
    name,
    value: (value / orders.length) * 100,
  }));

  return { dailyRevenueData, orderStatusData };
};

const topVendorsData = [
  { name: "Green Valley Bakery", orders: 45, revenue: "$224.55" },
  { name: "City Cafe", orders: 38, revenue: "$227.62" },
  { name: "Fresh Market", orders: 32, revenue: "$255.68" },
  { name: "Downtown Deli", orders: 28, revenue: "$182.00" },
  { name: "Organic Bistro", orders: 25, revenue: "$499.50" },
];

// Custom Checkbox Component
const CustomCheckbox = ({
  checked,
  onChange,
  id,
}: {
  checked: boolean;
  onChange: () => void;
  id: string;
}) => {
  return (
    <div className="relative">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <label
        htmlFor={id}
        className={cn(
          "flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border-2 transition-all duration-200",
          checked
            ? "border-green-500 bg-green-500"
            : "border-gray-300 hover:border-gray-400",
        )}
      >
        {checked && (
          <svg
            className="h-3 w-3 text-white transition-all duration-200 scale-100"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </label>
    </div>
  );
};

export function OrdersView() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState("dateDesc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  // Get chart data from actual orders
  const { dailyRevenueData, orderStatusData } = useMemo(
    () => getChartData(orders),
    [orders],
  );

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const searchValue = searchTerm.toLowerCase();
      const matchesSearch =
        searchTerm === "" ||
        order.id.toLowerCase().includes(searchValue) ||
        order.user.toLowerCase().includes(searchValue) ||
        order.vendor.toLowerCase().includes(searchValue) ||
        order.items.toLowerCase().includes(searchValue) ||
        order.address.toLowerCase().includes(searchValue);

      const matchesStatus =
        filterStatus === "all" || order.status === filterStatus;

      const orderPrice = parseFloat(order.amount.replace("$", ""));
      let matchesAmount = true;
      if (minAmount) matchesAmount = orderPrice >= parseFloat(minAmount);
      if (maxAmount) matchesAmount = orderPrice <= parseFloat(maxAmount);

      let matchesDate = true;
      if (startDate) matchesDate = new Date(order.date) >= new Date(startDate);
      if (endDate) matchesDate = new Date(order.date) <= new Date(endDate);

      return matchesSearch && matchesStatus && matchesAmount && matchesDate;
    });
  }, [
    orders,
    searchTerm,
    filterStatus,
    minAmount,
    maxAmount,
    startDate,
    endDate,
  ]);

  // Sorting
  const sortedOrders = useMemo(() => {
    return [...filteredOrders].sort((a, b) => {
      switch (sortBy) {
        case "dateAsc":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "dateDesc":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "amountAsc":
          return (
            parseFloat(a.amount.replace("$", "")) -
            parseFloat(b.amount.replace("$", ""))
          );
        case "amountDesc":
          return (
            parseFloat(b.amount.replace("$", "")) -
            parseFloat(a.amount.replace("$", ""))
          );
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });
  }, [filteredOrders, sortBy]);

  // Pagination
  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pagedOrders = sortedOrders.slice(startIndex, endIndex);

  // Statistics
  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => {
      if (o.status !== "Cancelled")
        return sum + parseFloat(o.amount.replace("$", ""));
      return sum;
    }, 0);

    const readyForPickup = orders.filter(
      (o) => o.status === "Ready for Pickup",
    ).length;
    const pendingPickups = orders.filter(
      (o) => o.status === "Pending Pickup",
    ).length;
    const completedToday = orders.filter(
      (o) =>
        o.status === "Completed" &&
        o.date === new Date().toISOString().split("T")[0],
    ).length;

    const avgOrderValue = totalRevenue / orders.length;

    return {
      totalRevenue: totalRevenue.toFixed(2),
      readyForPickup,
      pendingPickups,
      completedToday,
      avgOrderValue: avgOrderValue.toFixed(2),
      totalOrders: orders.length,
    };
  }, [orders]);

  // Export CSV
  const exportCSV = () => {
    const headers = [
      "Order ID",
      "Customer",
      "Vendor",
      "Items",
      "Quantity",
      "Amount",
      "Pickup Time",
      "Status",
      "Date",
      "Address",
      "Payment Method",
      "Notes",
      "Customer Email",
      "Customer Phone",
      "Created At",
      "Picked Up At",
    ];

    const rows = filteredOrders.map((order) => [
      order.id,
      order.user,
      order.vendor,
      order.items,
      order.quantity,
      order.amount,
      order.pickup,
      order.status,
      order.date,
      order.address,
      order.paymentMethod,
      order.notes,
      order.customerEmail,
      order.customerPhone,
      order.createdAt,
      order.pickedUpAt || "N/A",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `orders-${new Date().toISOString().split("T")[0]}.csv`);
  };

  // Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.text("Orders Report", 14, 22);

    // Date
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);

    // Stats
    doc.setFontSize(12);
    doc.text(`Total Orders: ${filteredOrders.length}`, 14, 40);
    doc.text(`Total Revenue: $${stats.totalRevenue}`, 14, 47);

    // Table
    autoTable(doc, {
      startY: 55,
      head: [["Order ID", "Customer", "Vendor", "Amount", "Status", "Date"]],
      body: filteredOrders.map((order) => [
        order.id,
        order.user,
        order.vendor,
        order.amount,
        order.status,
        order.date,
      ]),
      theme: "grid",
      styles: { fontSize: 8 },
      headStyles: { fillColor: [16, 185, 129] },
    });

    doc.save(`orders-${new Date().toISOString().split("T")[0]}.pdf`);
  };

  // Print Order
  const printOrder = (order: Order) => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Order ${order.id}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .section { margin-bottom: 20px; }
              .label { font-weight: bold; color: #666; }
              .value { margin-bottom: 10px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Order Receipt</h1>
              <h2>${order.id}</h2>
              <p>Date: ${new Date().toLocaleDateString()}</p>
            </div>
            
            <div class="section">
              <div class="label">Customer:</div>
              <div class="value">${order.user}</div>
              
              <div class="label">Vendor:</div>
              <div class="value">${order.vendor}</div>
              
              <div class="label">Pickup:</div>
              <div class="value">${order.pickup}</div>
              
              <div class="label">Address:</div>
              <div class="value">${order.address}</div>
            </div>
            
            <div class="section">
              <div class="label">Items:</div>
              <div class="value">${order.items} × ${order.quantity}</div>
              
              <div class="label">Amount:</div>
              <div class="value" style="font-size: 24px; font-weight: bold;">${order.amount}</div>
            </div>
            
            <div class="section">
              <div class="label">Status:</div>
              <div class="value">${order.status}</div>
              
              <div class="label">Payment Method:</div>
              <div class="value">${order.paymentMethod}</div>
            </div>
            
            ${
              order.notes
                ? `
            <div class="section">
              <div class="label">Notes:</div>
              <div class="value">${order.notes}</div>
            </div>`
                : ""
            }
            
            <hr style="margin: 30px 0;" />
            <p style="text-align: center; color: #666;">
              Generated by Order Management System
            </p>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Mark as picked up
  const markAsPickedUp = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            status: "Completed" as const,
            pickedUpAt: new Date().toLocaleString(),
          };
        }
        return order;
      }),
    );
  };

  // Mark as ready for pickup
  const markAsReady = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId && order.status === "In Progress") {
          return {
            ...order,
            status: "Ready for Pickup" as const,
          };
        }
        return order;
      }),
    );
  };

  // Bulk actions
  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId],
    );
  };

  const selectAllOrders = () => {
    if (selectedOrders.length === pagedOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(pagedOrders.map((o) => o.id));
    }
  };

  const handleBulkAction = (
    action: "complete" | "cancel" | "print" | "ready",
  ) => {
    switch (action) {
      case "complete":
        setOrders((prev) =>
          prev.map((order) =>
            selectedOrders.includes(order.id)
              ? {
                  ...order,
                  status: "Completed",
                  pickedUpAt: new Date().toLocaleString(),
                }
              : order,
          ),
        );
        break;
      case "ready":
        setOrders((prev) =>
          prev.map((order) =>
            selectedOrders.includes(order.id) && order.status === "In Progress"
              ? { ...order, status: "Ready for Pickup" }
              : order,
          ),
        );
        break;
      case "cancel":
        setOrders((prev) =>
          prev.map((order) =>
            selectedOrders.includes(order.id)
              ? { ...order, status: "Cancelled" }
              : order,
          ),
        );
        break;
    }
    setSelectedOrders([]);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500">
            Manage customer orders and transactions
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-green-600 text-green-600 hover:bg-green-50"
            onClick={exportCSV}
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            className="border-green-600 text-green-600 hover:bg-green-50"
            onClick={exportPDF}
          >
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
                <h3 className="text-3xl font-bold text-gray-900">
                  ${stats.totalRevenue}
                </h3>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Ready for Pickup</p>
                <h3 className="text-3xl font-bold text-blue-600">
                  {stats.readyForPickup}
                </h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Pending Pickup</p>
                <h3 className="text-3xl font-bold text-yellow-600">
                  {stats.pendingPickups}
                </h3>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Avg. Order Value</p>
                <h3 className="text-3xl font-bold text-gray-900">
                  ${stats.avgOrderValue}
                </h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Daily Revenue (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`$${value}`, "Revenue"]}
                    labelStyle={{ color: "#10b981", fontWeight: "bold" }}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                    name="Revenue"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Order Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [
                      `${parseFloat(value as string).toFixed(1)}%`,
                      "Percentage",
                    ]}
                  />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Vendors */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Store className="h-5 w-5" />
            Top Performing Vendors
          </h3>
          <div className="space-y-3">
            {topVendorsData.map((vendor, index) => (
              <div
                key={vendor.name}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="text-lg font-bold text-gray-400">
                    #{index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{vendor.name}</p>
                    <p className="text-xs text-gray-500">
                      {vendor.orders} orders
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-600 font-semibold">
                    {vendor.revenue}
                  </p>
                  <p className="text-xs text-gray-500">Total Revenue</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters Card */}
      <Card className="mb-6">
        <CardContent className="p-4">
          {/* Bulk Actions */}
          {selectedOrders.length > 0 && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg mb-4">
              <span className="text-sm font-medium">
                {selectedOrders.length} order
                {selectedOrders.length !== 1 ? "s" : ""} selected
              </span>
              <div className="flex gap-2 ml-auto">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction("complete")}
                  className="border-green-600 text-green-600 hover:bg-green-50"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Mark Complete
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction("ready")}
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  <Package className="h-4 w-4 mr-1" />
                  Mark Ready
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction("cancel")}
                  className="border-red-600 text-red-600 hover:bg-red-50"
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel Orders
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedOrders([])}
                  className="hover:bg-gray-200"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-4">
            {/* Search */}
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search orders by ID, customer, or vendor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 hover:bg-gray-100 p-1 rounded"
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>

            {/* Status Filter */}
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48 h-10">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Ready for Pickup">
                  Ready for Pickup
                </SelectItem>
                <SelectItem value="Pending Pickup">Pending Pickup</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            {/* Price Range */}
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min Price"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
                className="w-28 h-10"
                min="0"
                step="0.01"
              />
              <Input
                type="number"
                placeholder="Max Price"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
                className="w-28 h-10"
                min="0"
                step="0.01"
              />
            </div>

            {/* Date Range */}
            <div className="flex gap-2">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="date"
                  placeholder="Start Date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-36 h-10 pl-10"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="date"
                  placeholder="End Date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-36 h-10 pl-10"
                />
              </div>
            </div>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48 h-10">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dateDesc">Newest First</SelectItem>
                <SelectItem value="dateAsc">Oldest First</SelectItem>
                <SelectItem value="amountDesc">Highest Price</SelectItem>
                <SelectItem value="amountAsc">Lowest Price</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders List Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <div className="flex items-center gap-3">
          <p className="text-sm text-gray-500">
            Showing {Math.min(sortedOrders.length, itemsPerPage)} of{" "}
            {sortedOrders.length} order{sortedOrders.length !== 1 ? "s" : ""}
          </p>
          {pagedOrders.length > 0 && (
            <div className="flex items-center gap-2">
              <CustomCheckbox
                id="select-all"
                checked={
                  selectedOrders.length === pagedOrders.length &&
                  pagedOrders.length > 0
                }
                onChange={selectAllOrders}
              />
              <label
                htmlFor="select-all"
                className="text-sm text-gray-600 cursor-pointer"
              >
                Select all on page
              </label>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Items per page */}
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => {
              setItemsPerPage(parseInt(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-28">
              <SelectValue placeholder="5 per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 per page</SelectItem>
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="20">20 per page</SelectItem>
              <SelectItem value="50">50 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {pagedOrders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-gray-500">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No orders found
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm ||
                filterStatus !== "all" ||
                minAmount ||
                maxAmount ||
                startDate ||
                endDate
                  ? "Try adjusting your filters or search terms"
                  : "No orders have been placed yet"}
              </p>
              {(searchTerm ||
                filterStatus !== "all" ||
                minAmount ||
                maxAmount ||
                startDate ||
                endDate) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setFilterStatus("all");
                    setMinAmount("");
                    setMaxAmount("");
                    setStartDate("");
                    setEndDate("");
                  }}
                >
                  Clear All Filters
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          pagedOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <CustomCheckbox
                      id={`checkbox-${order.id}`}
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => toggleOrderSelection(order.id)}
                    />
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-bold text-gray-900">{order.id}</h4>
                        <Badge
                          className={`cursor-pointer ${orderStatusColors[order.status]}`}
                        >
                          {order.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="h-3 w-3" />
                        {order.date} • {order.pickup}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-600 font-bold text-lg">
                      {order.amount}
                    </p>
                    <div className="flex items-center gap-1 justify-end text-xs text-gray-500">
                      <CreditCard className="h-3 w-3" />
                      {order.paymentMethod}
                    </div>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4 pb-4 border-b">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Customer</p>
                      <p className="text-sm font-medium">{order.user}</p>
                      <p className="text-xs text-gray-500">
                        {order.customerPhone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Store className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Vendor</p>
                      <p className="text-sm font-medium">{order.vendor}</p>
                      <p className="text-xs text-gray-500">
                        {order.vendorPhone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <MapPin className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Pickup Location</p>
                      <p className="text-sm font-medium">{order.address}</p>
                      <p className="text-xs text-gray-500">{order.pickup}</p>
                    </div>
                  </div>
                </div>

                {/* Items & Actions */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Items</p>
                    <p className="text-sm font-medium">
                      {order.items} × {order.quantity}
                    </p>
                    {order.notes && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-600">
                        <MessageSquare className="h-3 w-3" />
                        {order.notes}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-green-600 text-green-600 hover:bg-green-50"
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsViewDialogOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    {order.status === "Ready for Pickup" && (
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => markAsPickedUp(order.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Mark as Picked Up
                      </Button>
                    )}
                    {order.status === "In Progress" && (
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => markAsReady(order.id)}
                      >
                        <Package className="h-4 w-4 mr-1" />
                        Mark as Ready
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="hover:bg-gray-100"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Order Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => {
                            navigator.clipboard.writeText(order.id);
                          }}
                          className="cursor-pointer"
                        >
                          Copy Order ID
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => printOrder(order)}
                          className="cursor-pointer"
                        >
                          <Printer className="h-4 w-4 mr-2" />
                          Print Receipt
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => markAsPickedUp(order.id)}
                          className="cursor-pointer [&>*]:text-green-600"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark as Picked Up
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => markAsReady(order.id)}
                          className="cursor-pointer [&>*]:text-blue-600"
                        >
                          <Package className="h-4 w-4 mr-2" />
                          Mark as Ready
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            setOrders((prev) =>
                              prev.map((o) =>
                                o.id === order.id
                                  ? { ...o, status: "Cancelled" }
                                  : o,
                              ),
                            );
                          }}
                          className="cursor-pointer [&>*]:text-red-600"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel Order
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
          <div className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="hover:bg-gray-100"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    size="sm"
                    variant={pageNum === currentPage ? "default" : "outline"}
                    onClick={() => setCurrentPage(pageNum)}
                    className={cn(
                      pageNum === currentPage
                        ? "bg-green-600 hover:bg-green-700"
                        : "hover:bg-gray-100",
                    )}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="hover:bg-gray-100"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Order Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="mt-4 space-y-6">
              {/* Order Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedOrder.id}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={orderStatusColors[selectedOrder.status]}>
                      {selectedOrder.status}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {selectedOrder.date} • {selectedOrder.pickup}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">
                    {selectedOrder.amount}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedOrder.paymentMethod}
                  </p>
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="details">Order Details</TabsTrigger>
                  <TabsTrigger value="customer">Customer Info</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                </TabsList>

                {/* Details Tab */}
                <TabsContent value="details" className="space-y-4">
                  {/* Items */}
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-3">Items Ordered</h4>
                      <div className="space-y-3">
                        {(selectedOrder.itemsList || []).map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center py-2 border-b last:border-0"
                          >
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-gray-500">
                                Quantity: {item.quantity}
                              </p>
                            </div>
                            <p className="font-semibold">{item.price}</p>
                          </div>
                        ))}
                        <div className="flex justify-between items-center pt-3 border-t">
                          <p className="font-bold">Total</p>
                          <p className="text-lg font-bold text-green-600">
                            {selectedOrder.amount}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Vendor & Location */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Store className="h-4 w-4" />
                          Vendor Details
                        </h4>
                        <p className="font-medium">{selectedOrder.vendor}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {selectedOrder.vendorEmail}
                        </p>
                        <p className="text-sm text-gray-500">
                          {selectedOrder.vendorPhone}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Pickup Details
                        </h4>
                        <p className="font-medium">{selectedOrder.address}</p>
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          {selectedOrder.pickup}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Notes */}
                  {selectedOrder.notes && (
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          Order Notes
                        </h4>
                        <p className="text-gray-600">{selectedOrder.notes}</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Customer Tab */}
                <TabsContent value="customer" className="space-y-4">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-4">
                        Customer Information
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500">Name</p>
                          <p className="font-medium">{selectedOrder.user}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Contact</p>
                          <p className="font-medium">
                            {selectedOrder.customerEmail}
                          </p>
                          <p className="text-sm text-gray-500">
                            {selectedOrder.customerPhone}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Order History</p>
                          <p className="text-sm text-gray-600">
                            {
                              orders.filter(
                                (o) => o.user === selectedOrder.user,
                              ).length
                            }{" "}
                            total orders
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Timeline Tab */}
                <TabsContent value="timeline" className="space-y-4">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-4">Order Timeline</h4>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-blue-100 rounded-full">
                            <Clock className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">Order Placed</p>
                            <p className="text-sm text-gray-500">
                              {selectedOrder.createdAt}
                            </p>
                          </div>
                        </div>

                        {selectedOrder.status === "In Progress" && (
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-purple-100 rounded-full">
                              <Package className="h-4 w-4 text-purple-600" />
                            </div>
                            <div>
                              <p className="font-medium">Order In Progress</p>
                              <p className="text-sm text-gray-500">
                                Being prepared by vendor
                              </p>
                            </div>
                          </div>
                        )}

                        {selectedOrder.status === "Ready for Pickup" && (
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-blue-100 rounded-full">
                              <Package className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">Ready for Pickup</p>
                              <p className="text-sm text-gray-500">
                                Order is ready for pickup
                              </p>
                            </div>
                          </div>
                        )}

                        {selectedOrder.status === "Completed" &&
                          selectedOrder.pickedUpAt && (
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-green-100 rounded-full">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              </div>
                              <div>
                                <p className="font-medium">Order Completed</p>
                                <p className="text-sm text-gray-500">
                                  Picked up at {selectedOrder.pickedUpAt}
                                </p>
                              </div>
                            </div>
                          )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1 hover:bg-gray-100"
                  onClick={() => setIsViewDialogOpen(false)}
                >
                  Close
                </Button>
                {selectedOrder.status === "Ready for Pickup" && (
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      markAsPickedUp(selectedOrder.id);
                      setIsViewDialogOpen(false);
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Picked Up
                  </Button>
                )}
                {selectedOrder.status === "In Progress" && (
                  <Button
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={() => {
                      markAsReady(selectedOrder.id);
                      setIsViewDialogOpen(false);
                    }}
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Mark as Ready
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50"
                  onClick={() => printOrder(selectedOrder)}
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print Receipt
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
