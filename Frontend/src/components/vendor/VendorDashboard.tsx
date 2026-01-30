import { useState, useEffect, useMemo } from "react";
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
  Search,
  Download,
  Filter,
  X,
  CheckCircle2,
  XCircle,
  Users,
  Award,
  Calendar,
  TrendingDown,
  MessageSquare,
  Zap,
  Target,
  CheckSquare,
  Square,
  Check,
  Mail,
  Eye,
  User,
  CalendarDays,
  MapPin,
  Phone,
  CreditCard,
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
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";

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

const revenueBreakdown = [
  { name: "Bakery Items", value: 450, color: "#3b82f6" },
  { name: "Pastries", value: 280, color: "#8b5cf6" },
  { name: "Sandwiches", value: 112, color: "#10b981" },
];

// Helper function to determine if order is overdue
const isOrderOverdue = (timeSlot: string, orderPlacedTime: Date) => {
  const now = new Date();

  // Parse the time slot (e.g., "3:00 PM - 4:00 PM")
  const [, endTimeStr] = timeSlot.split(" - ");

  // Parse end time
  const [endHourMin, endPeriod] = endTimeStr.split(" ");
  const [endHour, endMinute] = endHourMin.split(":").map(Number);
  let endHour24 = endHour;

  if (endPeriod === "PM" && endHour !== 12) {
    endHour24 += 12;
  } else if (endPeriod === "AM" && endHour === 12) {
    endHour24 = 0;
  }

  const endTime = new Date(orderPlacedTime);
  endTime.setHours(endHour24, endMinute, 0, 0);

  // If current time is past end time + grace period (15 minutes)
  const gracePeriod = 15 * 60 * 1000; // 15 minutes in milliseconds
  return now.getTime() > endTime.getTime() + gracePeriod;
};

const initialRecentOrders = [
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
  },
  {
    id: "#ORD-1244",
    customer: "Mike Chen",
    item: "Bakery Surprise Bag",
    amount: "$4.99",
    status: "Ready for Pickup",
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
  },
  {
    id: "#ORD-1242",
    customer: "Lisa Anderson",
    item: "Bakery Surprise Bag",
    amount: "$4.99",
    status: "Ready for Pickup",
    time: "45 min ago",
    timeSlot: "5:30 PM - 6:30 PM",
    orderPlacedTime: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
    customerEmail: "lisa.a@example.com",
    customerPhone: "+1 (555) 345-6789",
    pickupAddress: "303 Cedar St, Anytown, USA",
    paymentMethod: "Credit Card",
    orderNotes: "First time customer",
    items: [
      { name: "Bakery Surprise Bag", quantity: 1, price: 4.99 },
      { name: "Coffee", quantity: 1, price: 3.5 },
    ],
    subtotal: 8.49,
    tax: 0.68,
    total: 9.17,
  },
];

const initialTodayPickups = [
  {
    id: 1,
    customer: "Emma Wilson",
    orderId: "#ORD-1247",
    timeSlot: "3:00 PM - 4:00 PM",
    status: "Picked Up",
    items: ["Bakery Surprise Bag"],
  },
  {
    id: 2,
    customer: "John Smith",
    orderId: "#ORD-1246",
    timeSlot: "2:00 PM - 3:00 PM",
    status: "Ready",
    items: ["Bakery Surprise Bag"],
  },
  {
    id: 3,
    customer: "Sarah Johnson",
    orderId: "#ORD-1245",
    timeSlot: "5:00 PM - 6:00 PM",
    status: "Pending",
    items: ["Bakery Surprise Bag"],
  },
  {
    id: 4,
    customer: "Mike Chen",
    orderId: "#ORD-1244",
    timeSlot: "4:00 PM - 5:00 PM",
    status: "Ready",
    items: ["Bakery Surprise Bag"],
  },
  {
    id: 5,
    customer: "Lisa Anderson",
    orderId: "#ORD-1242",
    timeSlot: "5:30 PM - 6:30 PM",
    status: "Ready",
    items: ["Bakery Surprise Bag"],
  },
];

const initialNotifications = [
  {
    id: 1,
    type: "order",
    title: "New Order",
    message: "Sarah Johnson ordered Bakery Surprise Bag",
    time: "5 min ago",
    read: false,
    icon: ShoppingBag,
    color: "blue",
  },
  {
    id: 2,
    type: "pickup",
    title: "Upcoming Pickup",
    message: "Mike Chen pickup in 15 minutes",
    time: "10 min ago",
    read: false,
    icon: Clock,
    color: "amber",
  },
  {
    id: 3,
    type: "rating",
    title: "New 5-Star Rating",
    message: "Emma Wilson left you a positive review",
    time: "1 hour ago",
    read: false,
    icon: Star,
    color: "yellow",
  },
  {
    id: 4,
    type: "inventory",
    title: "Low Stock Alert",
    message: "Bakery Surprise Bags running low (2 left)",
    time: "2 hours ago",
    read: true,
    icon: AlertTriangle,
    color: "red",
  },
];

const topCustomers = [
  { name: "Emma Wilson", orders: 24, spent: "$119.76", rating: 5 },
  { name: "John Smith", orders: 18, spent: "$89.82", rating: 5 },
  { name: "Sarah Johnson", orders: 15, spent: "$74.85", rating: 4.8 },
  { name: "Mike Chen", orders: 12, spent: "$59.88", rating: 4.9 },
  { name: "Alex Turner", orders: 10, spent: "$69.90", rating: 5 },
];

// Helper function to determine expiry status dynamically
const calculateExpiryStatus = (expiryText: string) => {
  const now = new Date();

  // Parse expiry times
  let expiryDate = new Date();

  if (expiryText.includes("Today, 6:00 PM")) {
    expiryDate.setHours(18, 0, 0, 0); // Today at 6:00 PM
  } else if (expiryText.includes("Tomorrow, 12:00 PM")) {
    expiryDate.setDate(expiryDate.getDate() + 1);
    expiryDate.setHours(12, 0, 0, 0); // Tomorrow at 12:00 PM
  } else if (expiryText.includes("Tomorrow, 8:00 PM")) {
    expiryDate.setDate(expiryDate.getDate() + 1);
    expiryDate.setHours(20, 0, 0, 0); // Tomorrow at 8:00 PM
  }

  // Calculate time difference in hours
  const timeDiffHours =
    (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60);

  // Determine status based on time remaining
  if (timeDiffHours <= 2) return "critical"; // Less than 2 hours (RED)
  if (timeDiffHours <= 6) return "low"; // Less than 6 hours (ORANGE)
  if (timeDiffHours <= 24) return "medium"; // Less than 24 hours (YELLOW)
  return "good"; // More than 24 hours (GREEN)
};

const inventoryItems = [
  {
    id: 1,
    name: "Bakery Surprise Bag",
    stock: 2,
    expiry: "Today, 6:00 PM",
  },
  {
    id: 2,
    name: "Pastry Assortment",
    stock: 5,
    expiry: "Tomorrow, 12:00 PM",
  },
  {
    id: 3,
    name: "Sandwich Bundle",
    stock: 8,
    expiry: "Tomorrow, 8:00 PM",
  },
].map((item) => ({
  ...item,
  status: calculateExpiryStatus(item.expiry),
}));

const monthlyGoals = [
  { name: "Food Saved", current: 1240, target: 1500, percentage: 83 },
  { name: "Revenue", current: 842.5, target: 750, percentage: 112 },
  { name: "Customer Rating", current: 4.7, target: 4.5, percentage: 104 },
];

type OrderStatus = "Picked Up" | "Ready for Pickup" | "Pending Pickup";
type PickupStatus = "Picked Up" | "Ready" | "Pending";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customer: string;
  item: string;
  amount: string;
  status: OrderStatus;
  time: string;
  timeSlot: string;
  orderPlacedTime: Date;
  customerEmail: string;
  customerPhone: string;
  pickupAddress: string;
  paymentMethod: string;
  orderNotes: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
}

interface Pickup {
  id: number;
  customer: string;
  orderId: string;
  timeSlot: string;
  status: PickupStatus;
  items: string[];
}

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: any;
  color: string;
}

export function VendorDashboard() {
  const navigate = useNavigate();
  const [statsData, setStatsData] = useState(initialStatsData);
  const [recentOrders, setRecentOrders] =
    useState<Order[]>(initialRecentOrders);
  const [todayPickups, setTodayPickups] =
    useState<Pickup[]>(initialTodayPickups);
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "All">("All");
  const [pickupStatusFilter, setPickupStatusFilter] = useState<
    PickupStatus | "All"
  >("All");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showPickupFilters, setShowPickupFilters] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  // Filter orders based on search and status
  const filteredOrders = useMemo(() => {
    return recentOrders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.item.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [recentOrders, searchQuery, statusFilter]);

  // Calculate selectable orders
  const selectableOrders = useMemo(() => {
    return filteredOrders
      .filter((order) => order.status !== "Picked Up")
      .map((order) => order.id);
  }, [filteredOrders]);

  // Check if all selectable orders are selected
  const allSelected = useMemo(() => {
    return (
      selectableOrders.length > 0 &&
      selectedOrders.length === selectableOrders.length
    );
  }, [selectedOrders, selectableOrders]);

  // Update Pickups Today stat whenever todayPickups changes
  useEffect(() => {
    const pickedUpCount = todayPickups.filter(
      (p) => p.status === "Picked Up",
    ).length;
    const totalPickups = todayPickups.length;

    setStatsData((prev) =>
      prev.map((stat) => {
        if (stat.title === "Pickups Today") {
          const [currentCompleted, currentTotal] = stat.value
            .split("/")
            .map(Number);
          const change = pickedUpCount - currentCompleted;

          return {
            ...stat,
            value: `${pickedUpCount}/${totalPickups}`,
            change:
              change > 0 ? `+${change}` : change === 0 ? "+0" : `${change}`,
          };
        }
        return stat;
      }),
    );
  }, [todayPickups]);

  // Filter pickups based on status
  const filteredPickups = useMemo(() => {
    if (pickupStatusFilter === "All") return todayPickups;
    return todayPickups.filter(
      (pickup) => pickup.status === pickupStatusFilter,
    );
  }, [todayPickups, pickupStatusFilter]);

  // Auto-update order statuses based on time
  useEffect(() => {
    const checkOrderStatuses = () => {
      setRecentOrders((prev) =>
        prev.map((order) => {
          // Only update from Ready for Pickup to Pending Pickup if overdue
          if (
            order.status === "Ready for Pickup" &&
            isOrderOverdue(order.timeSlot, order.orderPlacedTime)
          ) {
            // Update corresponding pickup status
            setTodayPickups((pickups) =>
              pickups.map((pickup) =>
                pickup.orderId === order.id
                  ? { ...pickup, status: "Pending" as PickupStatus }
                  : pickup,
              ),
            );
            return { ...order, status: "Pending Pickup" as OrderStatus };
          }
          return order;
        }),
      );
    };

    // Check every minute
    const interval = setInterval(checkOrderStatuses, 60000);

    // Initial check
    checkOrderStatuses();

    return () => clearInterval(interval);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Prevent shortcuts when typing in inputs
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
          case "m":
            e.preventDefault();
            if (selectedOrders.length > 0) {
              handleBulkMarkAsPickedUp();
            }
            break;
        }
      }
      if (e.key === "/" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        document.getElementById("order-search")?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [selectedOrders]);

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

  const handleMarkAsPickedUp = (orderId: string) => {
    // Update order status
    setRecentOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? { ...order, status: "Picked Up" as OrderStatus }
          : order,
      ),
    );

    // Update pickup status
    setTodayPickups((prev) =>
      prev.map((pickup) =>
        pickup.orderId === orderId
          ? { ...pickup, status: "Picked Up" as PickupStatus }
          : pickup,
      ),
    );

    // Remove from selected orders
    setSelectedOrders((prev) => prev.filter((id) => id !== orderId));

    toast.success(`Order ${orderId} marked as picked up!`, {
      icon: "✅",
      duration: 3000,
    });

    // Check if all pickups are completed
    const updatedPickups = todayPickups.map((pickup) =>
      pickup.orderId === orderId
        ? { ...pickup, status: "Picked Up" as PickupStatus }
        : pickup,
    );

    const allPickedUp = updatedPickups.every((p) => p.status === "Picked Up");
    if (allPickedUp) {
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
        toast.success("🎉 All pickups completed for today!", {
          duration: 5000,
        });
      }, 500);
    }
  };

  const handleBulkMarkAsPickedUp = () => {
    if (selectedOrders.length === 0) {
      toast.error("Please select orders first");
      return;
    }

    // Update order statuses
    setRecentOrders((prev) =>
      prev.map((order) =>
        selectedOrders.includes(order.id)
          ? { ...order, status: "Picked Up" as OrderStatus }
          : order,
      ),
    );

    // Update pickup statuses
    setTodayPickups((prev) =>
      prev.map((pickup) =>
        selectedOrders.includes(pickup.orderId)
          ? { ...pickup, status: "Picked Up" as PickupStatus }
          : pickup,
      ),
    );

    toast.success(
      `${selectedOrders.length} order${selectedOrders.length > 1 ? "s" : ""} marked as picked up!`,
      {
        icon: "✅",
        duration: 3000,
      },
    );

    // Clear selection
    setSelectedOrders([]);
  };

  const handleRemindCustomer = (orderId: string, customer: string) => {
    // Update order status from Pending Pickup to Ready for Pickup
    setRecentOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? { ...order, status: "Ready for Pickup" as OrderStatus }
          : order,
      ),
    );

    // Update pickup status
    setTodayPickups((prev) =>
      prev.map((pickup) =>
        pickup.orderId === orderId
          ? { ...pickup, status: "Ready" as PickupStatus }
          : pickup,
      ),
    );

    // Remove from selected orders if it was selected
    setSelectedOrders((prev) => prev.filter((id) => id !== orderId));

    toast.promise(
      new Promise((resolve) => {
        // Simulate sending reminder
        setTimeout(() => {
          resolve(`Reminder sent to ${customer}`);
        }, 1000);
      }),
      {
        loading: `Sending reminder to ${customer}...`,
        success: (message) => `${message} - Status updated to Ready for Pickup`,
        error: "Failed to send reminder",
      },
      {
        duration: 3000,
        icon: "📱",
      },
    );
  };

  const handleBulkRemind = () => {
    if (selectedOrders.length === 0) {
      toast.error("Please select orders first");
      return;
    }

    // Update statuses for selected orders
    setRecentOrders((prev) =>
      prev.map((order) =>
        selectedOrders.includes(order.id) && order.status === "Pending Pickup"
          ? { ...order, status: "Ready for Pickup" as OrderStatus }
          : order,
      ),
    );

    // Update pickup statuses
    setTodayPickups((prev) =>
      prev.map((pickup) =>
        selectedOrders.includes(pickup.orderId) && pickup.status === "Pending"
          ? { ...pickup, status: "Ready" as PickupStatus }
          : pickup,
      ),
    );

    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: `Sending reminders to ${selectedOrders.length} customer${selectedOrders.length > 1 ? "s" : ""}...`,
        success: `Reminders sent to ${selectedOrders.length} customer${selectedOrders.length > 1 ? "s" : ""}! Statuses updated to Ready for Pickup`,
        error: "Failed to send reminders",
      },
      {
        duration: 3000,
      },
    );

    setSelectedOrders([]);
  };

  const handleExportOrders = () => {
    const csv = [
      ["Order ID", "Customer", "Item", "Amount", "Status", "Pickup Time"],
      ...filteredOrders.map((order) => [
        order.id,
        order.customer,
        order.item,
        order.amount,
        order.status,
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

  const handleViewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const markNotificationAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)),
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
    toast.success("All notifications marked as read");
  };

  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId],
    );
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      // Deselect all
      setSelectedOrders([]);
    } else {
      // Select all selectable orders
      setSelectedOrders([...selectableOrders]);
    }
  };

  const deselectAllOrders = () => {
    setSelectedOrders([]);
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

  // Calculate pickup stats
  const pickedUpCount = todayPickups.filter(
    (p) => p.status === "Picked Up",
  ).length;
  const pendingCount = todayPickups.filter(
    (p) => p.status === "Pending",
  ).length;
  const readyCount = todayPickups.filter((p) => p.status === "Ready").length;

  // Unread notifications count
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="p-6 space-y-6 relative">
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
                    <Badge className="bg-green-100 text-green-800 border-green-200">
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

      {/* Header with Notifications */}
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
            <div className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-gray-100 rounded border">/</kbd>
              <span>Search</span>
            </div>
          </div>
        </div>

        {/* Notifications Bell */}
        <div className="relative">
          <Button
            variant="outline"
            size="icon"
            className="relative h-10 w-10"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-semibold">
                {unreadCount}
              </span>
            )}
          </Button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border z-50 max-h-[500px] overflow-hidden flex flex-col">
              <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-white">
                <h3 className="font-semibold text-lg">Notifications</h3>
                <div className="flex gap-2">
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllNotificationsAsRead}
                      className="text-xs"
                    >
                      Mark all read
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setShowNotifications(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="overflow-y-auto flex-1">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Bell className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p>No notifications</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
                        !notif.read ? "bg-blue-50" : ""
                      }`}
                      onClick={() => markNotificationAsRead(notif.id)}
                    >
                      <div className="flex gap-3">
                        <div
                          className={`p-2 rounded-lg bg-${notif.color}-100 h-fit flex-shrink-0`}
                        >
                          <notif.icon
                            className={`h-5 w-5 text-${notif.color}-600`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-semibold text-sm">
                              {notif.title}
                            </p>
                            {!notif.read && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1 break-words">
                            {notif.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {notif.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
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

      {/* Three Column Layout: Charts, Customer Insights, Inventory */}
      {/* Monthly Goals */}
      <Card className="border-emerald-200 bg-emerald-50/30">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-emerald-600" />
            <CardTitle className="text-emerald-900">Monthly Goals</CardTitle>
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
                // Determine styling based on status
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

      {/* Customer Insights & Revenue Breakdown Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Insights */}
        <Card>
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

        {/* Revenue Breakdown */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <CardTitle>Revenue Breakdown</CardTitle>
            </div>
            <p className="text-sm text-gray-500">By item category</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={revenueBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {revenueBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {revenueBreakdown.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="font-semibold">${item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Environmental Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <p className="text-sm text-gray-500">Frequently used tasks</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                      <p className="text-sm text-gray-500">Add surplus items</p>
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
                      <p className="text-sm text-gray-500">Today's schedule</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Environmental Impact */}
        <Card className="border-emerald-200 bg-emerald-50/30">
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
            <div className="space-y-3">
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
      </div>

      {/* Recent Orders Table with Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Last 7 days of order activity
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="order-search"
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
                onClick={handleViewAllOrders}
                className="gap-2"
              >
                View All
                <ChevronRight className="h-4 w-4" />
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
                      statusFilter === "Picked Up" ? "default" : "outline"
                    }
                    onClick={() => setStatusFilter("Picked Up")}
                  >
                    Picked Up
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
                      statusFilter === "Pending Pickup" ? "default" : "outline"
                    }
                    onClick={() => setStatusFilter("Pending Pickup")}
                  >
                    Pending
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Bulk Actions Bar - Always visible when there are selectable orders */}
          {selectableOrders.length > 0 && (
            <div
              className={`mt-4 p-3 rounded-lg flex items-center justify-between flex-wrap gap-3 transition-all duration-300 ${
                selectedOrders.length > 0
                  ? "bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200"
                  : "bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    selectedOrders.length > 0
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {selectedOrders.length > 0 ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <CheckSquare className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <p
                    className={`font-medium ${
                      selectedOrders.length > 0
                        ? "text-blue-900"
                        : "text-gray-700"
                    }`}
                  >
                    {selectedOrders.length > 0 ? (
                      <>
                        <span className="font-bold">
                          {selectedOrders.length}
                        </span>{" "}
                        order{selectedOrders.length > 1 ? "s" : ""} selected
                      </>
                    ) : (
                      "Select orders to perform bulk actions"
                    )}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedOrders.length === 0
                      ? `${selectableOrders.length} orders available for selection`
                      : allSelected
                        ? "All selectable orders selected"
                        : `${selectedOrders.length} of ${selectableOrders.length} selected`}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                {selectedOrders.length > 0 ? (
                  <>
                    <Button
                      size="sm"
                      onClick={handleBulkMarkAsPickedUp}
                      className="gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 border-none"
                    >
                      <Check className="h-4 w-4" />
                      Mark as Picked Up
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleBulkRemind}
                      className="gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 border-none"
                    >
                      <Mail className="h-4 w-4" />
                      Send Reminders
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={deselectAllOrders}
                      className="gap-2 bg-white hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                    >
                      <XCircle className="h-4 w-4" />
                      Clear
                    </Button>
                  </>
                ) : (
                  <Button
                    size="sm"
                    onClick={toggleSelectAll}
                    variant="outline"
                    className="gap-2 bg-white hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
                  >
                    <CheckSquare className="h-4 w-4" />
                    Select All
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                  <th className="text-left py-3 px-4 w-12">
                    <button
                      onClick={toggleSelectAll}
                      className={`h-8 w-8 flex items-center justify-center rounded border transition-all ${
                        allSelected
                          ? "bg-blue-500 border-blue-500 text-white"
                          : "bg-white border-gray-300 hover:bg-gray-100 hover:border-gray-400"
                      }`}
                      title={allSelected ? "Deselect all" : "Select all"}
                    >
                      {allSelected ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                    </button>
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                    Order ID
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                    Customer
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                    Item
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                    Pickup Time
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                    Status
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
                      className={`border-b last:border-b-0 transition-colors ${
                        selectedOrders.includes(order.id)
                          ? "bg-blue-50 hover:bg-blue-100"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedOrders.includes(order.id)}
                            onChange={() => toggleOrderSelection(order.id)}
                            disabled={order.status === "Picked Up"}
                            className={`h-4 w-4 rounded border transition-all cursor-pointer ${
                              order.status === "Picked Up"
                                ? "opacity-30 cursor-not-allowed"
                                : selectedOrders.includes(order.id)
                                  ? "border-blue-500 bg-blue-500"
                                  : "border-gray-300 hover:border-gray-400"
                            }`}
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-sm">
                        {order.id}
                      </td>
                      <td className="py-3 px-4 text-sm">{order.customer}</td>
                      <td className="py-3 px-4 text-sm">{order.item}</td>
                      <td className="py-3 px-4 font-medium text-sm">
                        {order.amount}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {order.timeSlot}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant="outline"
                          className={`${
                            order.status === "Picked Up"
                              ? "bg-green-100 text-green-800 border-green-200"
                              : order.status === "Ready for Pickup"
                                ? "bg-blue-100 text-blue-800 border-blue-200"
                                : "bg-red-100 text-red-800 border-red-200"
                          }`}
                        >
                          {order.status}
                          {order.status === "Pending Pickup" && " (Overdue)"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        {order.status === "Ready for Pickup" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleMarkAsPickedUp(order.id)}
                              className="border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400"
                            >
                              Mark Picked Up
                            </Button>
                          </div>
                        )}
                        {order.status === "Pending Pickup" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleRemindCustomer(order.id, order.customer)
                              }
                              className="border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400"
                            >
                              Remind Customer
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleMarkAsPickedUp(order.id)}
                              className="border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400"
                            >
                              Mark Picked Up
                            </Button>
                          </div>
                        )}
                        {order.status === "Picked Up" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewOrderDetails(order)}
                            className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Results Summary */}
          {filteredOrders.length > 0 && (
            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
              <div>
                Showing {filteredOrders.length} of {recentOrders.length} orders
              </div>
              <div className="flex items-center gap-4">
                {selectedOrders.length > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="font-medium text-blue-600">
                      {selectedOrders.length} selected
                    </span>
                  </div>
                )}
                <div className="text-gray-400">
                  {selectableOrders.length} orders available for selection
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
