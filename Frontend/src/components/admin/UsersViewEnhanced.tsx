import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  Search,
  Mail,
  Phone,
  ShoppingBag,
  Calendar,
  X,
  Filter,
  ArrowUpDown,
  Download,
  Eye,
  UserPlus,
  Edit,
  Ban,
  CheckCircle,
  Clock,
  Tag,
  PieChart,
  ChevronLeft,
  ChevronRight,
  Send,
  Star,
  TrendingUp,
  FileText,
  MoreVertical,
  Check,
  MessageSquare,
  Award,
  Filter as FilterIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../ui/dialog";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import toast, { Toaster } from "react-hot-toast";
import { Textarea } from "../ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
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

/* ================= TYPES ================= */
interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  orders: number;
  totalSpent: string;
  status: "Active" | "Inactive";
  joined: string;
  lastOrder: string;
  tags: string[];
  loyaltyPoints: number;
  notes: string[];
}

interface Order {
  id: number;
  userId: number;
  date: string;
  amount: string;
  status: "Delivered" | "Pending" | "Cancelled";
  items: number;
}

interface TimelineEvent {
  id: number;
  userId: number;
  type: "order" | "registration" | "note" | "status_change";
  title: string;
  description: string;
  date: string;
  timestamp: string;
}

interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  body: string;
}

/* ================= MOCK DATA ================= */
const initialUsers: User[] = [
  {
    id: 1,
    name: "Emma Wilson",
    email: "emma.w@email.com",
    phone: "(555) 123-4567",
    orders: 28,
    totalSpent: "$142.50",
    status: "Active",
    joined: "2024-03-15",
    lastOrder: "2025-10-29",
    tags: ["VIP", "Frequent Buyer"],
    loyaltyPoints: 2850,
    notes: ["Loves eco-friendly products", "Prefers email communication"],
  },
  {
    id: 2,
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "(555) 234-5678",
    orders: 42,
    totalSpent: "$215.80",
    status: "Active",
    joined: "2024-01-20",
    lastOrder: "2025-10-30",
    tags: ["VIP", "Early Adopter"],
    loyaltyPoints: 4316,
    notes: ["Has a subscription for monthly delivery"],
  },
  {
    id: 3,
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "(555) 345-6789",
    orders: 35,
    totalSpent: "$189.20",
    status: "Active",
    joined: "2024-05-10",
    lastOrder: "2025-10-28",
    tags: ["New Customer"],
    loyaltyPoints: 3784,
    notes: [],
  },
  {
    id: 4,
    name: "Mike Chen",
    email: "mike.chen@email.com",
    phone: "(555) 456-7890",
    orders: 18,
    totalSpent: "$95.40",
    status: "Active",
    joined: "2024-06-22",
    lastOrder: "2025-10-27",
    tags: ["Tech Enthusiast"],
    loyaltyPoints: 1908,
    notes: ["Interested in new tech products"],
  },
  {
    id: 5,
    name: "Lisa Anderson",
    email: "lisa.a@email.com",
    phone: "(555) 567-8901",
    orders: 51,
    totalSpent: "$268.90",
    status: "Active",
    joined: "2024-04-18",
    lastOrder: "2025-10-30",
    tags: ["VIP", "Top Spender"],
    loyaltyPoints: 5378,
    notes: ["Contact for beta testing new features"],
  },
  {
    id: 6,
    name: "Robert Wilson",
    email: "r.wilson@email.com",
    phone: "(555) 678-9012",
    orders: 12,
    totalSpent: "$67.50",
    status: "Inactive",
    joined: "2024-08-05",
    lastOrder: "2025-09-15",
    tags: ["Inactive"],
    loyaltyPoints: 1350,
    notes: ["Last contacted 2 months ago"],
  },
  {
    id: 7,
    name: "Jessica Brown",
    email: "jess.b@email.com",
    phone: "(555) 789-0123",
    orders: 24,
    totalSpent: "$128.70",
    status: "Active",
    joined: "2024-07-12",
    lastOrder: "2025-10-29",
    tags: ["Loyal Customer"],
    loyaltyPoints: 2574,
    notes: ["Prefers phone calls"],
  },
  {
    id: 8,
    name: "David Lee",
    email: "david.lee@email.com",
    phone: "(555) 890-1234",
    orders: 38,
    totalSpent: "$198.30",
    status: "Active",
    joined: "2024-02-28",
    lastOrder: "2025-10-30",
    tags: ["VIP"],
    loyaltyPoints: 3966,
    notes: ["Bulk buyer for office supplies"],
  },
];

const initialOrders: Order[] = [
  { id: 1, userId: 1, date: "2025-10-29", amount: "$45.50", status: "Delivered", items: 3 },
  { id: 2, userId: 1, date: "2025-10-15", amount: "$32.00", status: "Delivered", items: 2 },
  { id: 3, userId: 2, date: "2025-10-30", amount: "$67.80", status: "Delivered", items: 5 },
  { id: 4, userId: 3, date: "2025-10-28", amount: "$89.20", status: "Pending", items: 4 },
  { id: 5, userId: 4, date: "2025-10-27", amount: "$25.40", status: "Delivered", items: 1 },
  { id: 6, userId: 5, date: "2025-10-30", amount: "$128.90", status: "Delivered", items: 8 },
  { id: 7, userId: 6, date: "2025-09-15", amount: "$35.50", status: "Delivered", items: 2 },
  { id: 8, userId: 7, date: "2025-10-29", amount: "$64.70", status: "Cancelled", items: 3 },
  { id: 9, userId: 8, date: "2025-10-30", amount: "$98.30", status: "Delivered", items: 6 },
];

const timelineEvents: TimelineEvent[] = [
  { id: 1, userId: 1, type: "registration", title: "Account Created", description: "Emma Wilson registered an account", date: "2024-03-15", timestamp: "10:30 AM" },
  { id: 2, userId: 1, type: "order", title: "Order Placed", description: "Placed order #ORD-001 for $45.50", date: "2024-03-20", timestamp: "02:15 PM" },
  { id: 3, userId: 1, type: "note", title: "Note Added", description: "Customer prefers eco-friendly products", date: "2024-04-05", timestamp: "11:00 AM" },
  { id: 4, userId: 1, type: "order", title: "Order Placed", description: "Placed order #ORD-008 for $32.00", date: "2025-10-15", timestamp: "09:45 AM" },
  { id: 5, userId: 2, type: "order", title: "Order Placed", description: "Placed order #ORD-012 for $67.80", date: "2025-10-30", timestamp: "03:20 PM" },
];

const emailTemplates: EmailTemplate[] = [
  { id: 1, name: "Welcome Email", subject: "Welcome to Our Store!", body: "Hi {{name}}, welcome to our store! Get 10% off your first order." },
  { id: 2, name: "Abandoned Cart", subject: "Forgot something?", body: "Hi {{name}}, you left items in your cart. Complete your purchase now!" },
  { id: 3, name: "VIP Promotion", subject: "Exclusive VIP Offer", body: "Hi {{name}}, as a valued VIP customer, here's an exclusive offer just for you!" },
  { id: 4, name: "Win Back", subject: "We miss you!", body: "Hi {{name}}, it's been a while! Here's 15% off to welcome you back." },
];

const userSegments = [
  { id: 1, name: "VIP Customers", count: 4, color: "#8b5cf6" },
  { id: 2, name: "New Customers", count: 2, color: "#3b82f6" },
  { id: 3, name: "Inactive", count: 1, color: "#6b7280" },
  { id: 4, name: "Frequent Buyers", count: 5, color: "#10b981" },
  { id: 5, name: "Top Spenders", count: 3, color: "#f59e0b" },
];

const monthlyGrowthData = [
  { month: "Jan", users: 120 },
  { month: "Feb", users: 135 },
  { month: "Mar", users: 150 },
  { month: "Apr", users: 165 },
  { month: "May", users: 180 },
  { month: "Jun", users: 200 },
  { month: "Jul", users: 220 },
  { month: "Aug", users: 240 },
  { month: "Sep", users: 260 },
  { month: "Oct", users: 285 },
];

const spendingTierData = [
  { name: "$0-50", users: 2 },
  { name: "$50-100", users: 3 },
  { name: "$100-200", users: 2 },
  { name: "$200+", users: 1 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export function UsersView() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState<
    "name" | "orders" | "totalSpent" | "lastOrder" | "loyaltyPoints"
  >("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [spendingTier, setSpendingTier] = useState("all");
  const [newNote, setNewNote] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Pagination
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\(\d{3}\)\s\d{3}-\d{4}$/;
    return phoneRegex.test(phone);
  };

  const formatPhoneNumber = (value: string): string => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6)
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      errors.email = "Invalid email format";
    }
    if (!formData.phone.trim()) {
      errors.phone = "Phone is required";
    } else if (!validatePhone(formData.phone)) {
      errors.phone = "Invalid phone format (555) 123-4567";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === "phone") {
      value = formatPhoneNumber(value);
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
    });
    setFormErrors({});
  };

  const handleAddUser = () => {
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    const newUser: User = {
      id: Math.max(...users.map((u) => u.id), 0) + 1,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      orders: 0,
      totalSpent: "$0.00",
      status: "Active",
      joined: new Date().toISOString().split("T")[0],
      lastOrder: "N/A",
      tags: ["New Customer"],
      loyaltyPoints: 0,
      notes: [],
    };

    setUsers((prev) => [...prev, newUser]);
    toast.success(`${formData.name} added successfully!`);
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEditUser = () => {
    if (!validateForm() || !selectedUser) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setUsers((prev) =>
      prev.map((u) =>
        u.id === selectedUser.id
          ? {
              ...u,
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
            }
          : u,
      ),
    );

    toast.success(`${formData.name} updated successfully!`);
    resetForm();
    setIsEditDialogOpen(false);
    setIsViewDialogOpen(false);
  };

  const handleToggleStatus = (user: User) => {
    const newStatus = user.status === "Active" ? "Inactive" : "Active";
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u)),
    );
    toast.success(`${user.name} is now ${newStatus}`);
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
    });
    setIsViewDialogOpen(false);
    setIsEditDialogOpen(true);
  };

  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Name",
      "Email",
      "Phone",
      "Orders",
      "Total Spent",
      "Status",
      "Joined",
      "Last Order",
      "Loyalty Points",
      "Tags",
    ];
    const csvData = users.map((u) => [
      u.id,
      u.name,
      u.email,
      u.phone,
      u.orders,
      u.totalSpent,
      u.status,
      u.joined,
      u.lastOrder,
      u.loyaltyPoints,
      u.tags.join("; "),
    ]);

    const csv = [
      headers.join(","),
      ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success("User list exported successfully!");
  };

  const toggleSort = (
    field: "name" | "orders" | "totalSpent" | "lastOrder" | "loyaltyPoints",
  ) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // Bulk Actions
  const toggleUserSelection = (userId: number) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const selectAllUsers = () => {
    if (selectedUsers.length === filteredAndSortedUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredAndSortedUsers.map((u) => u.id));
    }
  };

  const handleBulkAction = (action: "activate" | "deactivate" | "delete" | "export" | "tag") => {
    switch (action) {
      case "activate":
        setUsers((prev) =>
          prev.map((u) =>
            selectedUsers.includes(u.id) ? { ...u, status: "Active" } : u,
          ),
        );
        toast.success(`Activated ${selectedUsers.length} users`);
        break;
      case "deactivate":
        setUsers((prev) =>
          prev.map((u) =>
            selectedUsers.includes(u.id) ? { ...u, status: "Inactive" } : u,
          ),
        );
        toast.success(`Deactivated ${selectedUsers.length} users`);
        break;
      case "tag":
        // Add VIP tag to selected users
        setUsers((prev) =>
          prev.map((u) =>
            selectedUsers.includes(u.id)
              ? { ...u, tags: [...u.tags, "VIP"] }
              : u,
          ),
        );
        toast.success(`Added VIP tag to ${selectedUsers.length} users`);
        break;
    }
    setSelectedUsers([]);
  };

  // User Notes
  const addNote = () => {
    if (!newNote.trim() || !selectedUser) return;

    const updatedUser = {
      ...selectedUser,
      notes: [...selectedUser.notes, `${new Date().toISOString().split("T")[0]}: ${newNote}`],
    };

    setUsers((prev) =>
      prev.map((u) => (u.id === selectedUser.id ? updatedUser : u)),
    );
    setSelectedUser(updatedUser);
    setNewNote("");
    toast.success("Note added successfully!");
  };

  // Email Templates
  const loadTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setEmailSubject(template.subject);
    setEmailBody(template.body.replace("{{name}}", selectedUser?.name || "Customer"));
  };

  const sendEmail = () => {
    if (!selectedUser || !emailSubject || !emailBody) {
      toast.error("Please fill in all email fields");
      return;
    }

    toast.success(`Email sent to ${selectedUser.name}`);
    setIsEmailDialogOpen(false);
    setSelectedTemplate(null);
    setEmailSubject("");
    setEmailBody("");
  };

  // Advanced Filtering
  const getSpendingTier = (spent: string): string => {
    const amount = parseFloat(spent.replace(/[$,]/g, ""));
    if (amount === 0) return "$0";
    if (amount <= 50) return "$0-50";
    if (amount <= 100) return "$50-100";
    if (amount <= 200) return "$100-200";
    return "$200+";
  };

  const filteredAndSortedUsers = users
    .filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === "all" || user.status.toLowerCase() === filterStatus;
      
      // Date range filter
      const matchesDateRange = !dateRange.start || !dateRange.end || 
        (user.joined >= dateRange.start && user.joined <= dateRange.end);
      
      // Spending tier filter
      const matchesSpendingTier = spendingTier === "all" || 
        getSpendingTier(user.totalSpent) === spendingTier;

      return matchesSearch && matchesStatus && matchesDateRange && matchesSpendingTier;
    })
    .sort((a, b) => {
      let aVal, bVal;

      switch (sortBy) {
        case "name":
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case "orders":
          aVal = a.orders;
          bVal = b.orders;
          break;
        case "totalSpent":
          aVal = parseFloat(a.totalSpent.replace(/[$,]/g, ""));
          bVal = parseFloat(b.totalSpent.replace(/[$,]/g, ""));
          break;
        case "lastOrder":
          aVal = a.lastOrder === "N/A" ? 0 : new Date(a.lastOrder).getTime();
          bVal = b.lastOrder === "N/A" ? 0 : new Date(b.lastOrder).getTime();
          break;
        case "loyaltyPoints":
          aVal = a.loyaltyPoints;
          bVal = b.loyaltyPoints;
          break;
        default:
          return 0;
      }

      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      } else {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
      }
    })
    .slice(startIndex, endIndex);

  const activeUsers = users.filter((u) => u.status === "Active");
  const topSpenders = [...users]
    .sort(
      (a, b) =>
        parseFloat(b.totalSpent.replace(/[$,]/g, "")) -
        parseFloat(a.totalSpent.replace(/[$,]/g, "")),
    )
    .slice(0, 3);

  const userOrders = selectedUser ? initialOrders.filter(order => order.userId === selectedUser.id) : [];

  return (
    <div className="p-8">
      <Toaster
        position="top-right"
        toastOptions={{
          success: {
            style: {
              background: "#10b981",
              color: "white",
            },
            iconTheme: {
              primary: "white",
              secondary: "#10b981",
            },
          },
          error: {
            style: {
              background: "#ef4444",
              color: "white",
            },
          },
        }}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Users</h1>
          <p className="text-gray-500">Manage customer accounts</p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex items-center gap-2 border-green-600 text-green-600 hover:bg-green-50"
            onClick={handleExportCSV}
          >
            <Download className="h-4 w-4" /> Export CSV
          </Button>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700 flex items-center gap-2">
                <UserPlus className="h-4 w-4" /> Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label className="text-sm font-medium">Full Name *</Label>
                  <Input
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={`mt-1 ${formErrors.name ? "border-red-500" : ""}`}
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-medium">Email *</Label>
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`mt-1 ${formErrors.email ? "border-red-500" : ""}`}
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-medium">Phone *</Label>
                  <Input
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className={`mt-1 ${formErrors.phone ? "border-red-500" : ""}`}
                    maxLength={14}
                  />
                  {formErrors.phone && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.phone}
                    </p>
                  )}
                </div>

                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={handleAddUser}
                >
                  Add User
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 mb-1">Total Users</p>
            <h3 className="text-3xl font-bold text-gray-900">{users.length}</h3>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 mb-1">Active Users</p>
            <h3 className="text-3xl font-bold text-green-600">
              {activeUsers.length}
            </h3>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 mb-1">Total Orders</p>
            <h3 className="text-3xl font-bold text-gray-900">
              {users.reduce((sum, u) => sum + u.orders, 0)}
            </h3>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 mb-1">Total Loyalty Points</p>
            <h3 className="text-3xl font-bold text-yellow-600">
              {users.reduce((sum, u) => sum + u.loyaltyPoints, 0).toLocaleString()}
            </h3>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              User Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Spending Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={spendingTierData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="users"
                  >
                    {spendingTierData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Spenders */}
      {topSpenders.length > 0 && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <span className="text-yellow-500">⭐</span> Top Spenders
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topSpenders.map((user, index) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="text-2xl font-bold text-gray-400">
                    #{index + 1}
                  </div>
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-green-100 text-green-700">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{user.name}</p>
                    <p className="text-green-600 font-semibold">
                      {user.totalSpent}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Award className="h-3 w-3 text-yellow-500" />
                      <span className="text-xs text-gray-500">{user.loyaltyPoints} points</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filter */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            {/* Bulk Actions */}
            {selectedUsers.length > 0 && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium">
                  {selectedUsers.length} user{selectedUsers.length !== 1 ? "s" : ""} selected
                </span>
                <div className="flex gap-2 ml-auto">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkAction("activate")}
                    className="border-green-600 text-green-600"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Activate
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkAction("deactivate")}
                    className="border-gray-600 text-gray-600"
                  >
                    <Ban className="h-4 w-4 mr-1" />
                    Deactivate
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkAction("tag")}
                    className="border-purple-600 text-purple-600"
                  >
                    <Tag className="h-4 w-4 mr-1" />
                    Tag as VIP
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelectedUsers([])}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("all")}
                  className={
                    filterStatus === "all"
                      ? "bg-green-600 hover:bg-green-700"
                      : ""
                  }
                >
                  All
                </Button>
                <Button
                  variant={filterStatus === "active" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("active")}
                  className={
                    filterStatus === "active"
                      ? "bg-green-600 hover:bg-green-700"
                      : ""
                  }
                >
                  Active
                </Button>
                <Button
                  variant={filterStatus === "inactive" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("inactive")}
                  className={
                    filterStatus === "inactive"
                      ? "bg-green-600 hover:bg-green-700"
                      : ""
                  }
                >
                  Inactive
                </Button>
              </div>
            </div>

            {/* Advanced Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 bg-gray-50 rounded-lg">
              <div>
                <Label className="text-xs font-medium mb-1 block">Joined Date Range</Label>
                <div className="flex gap-2">
                  <Input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="text-sm"
                  />
                  <Input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="text-sm"
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs font-medium mb-1 block">Spending Tier</Label>
                <Select value={spendingTier} onValueChange={setSpendingTier}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All tiers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tiers</SelectItem>
                    <SelectItem value="$0-50">$0 - $50</SelectItem>
                    <SelectItem value="$50-100">$50 - $100</SelectItem>
                    <SelectItem value="$100-200">$100 - $200</SelectItem>
                    <SelectItem value="$200+">$200+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs font-medium mb-1 block">User Segments</Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select segment" />
                  </SelectTrigger>
                  <SelectContent>
                    {userSegments.map((segment) => (
                      <SelectItem key={segment.id} value={segment.name}>
                        {segment.name} ({segment.count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sort Options and Pagination */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <p className="text-sm text-gray-500">
          Showing {Math.min(filteredAndSortedUsers.length, itemsPerPage)} of {users.length} user
          {users.length !== 1 ? "s" : ""}
        </p>
        
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleSort("name")}
              className={sortBy === "name" ? "bg-green-50 border-green-600" : ""}
            >
              Name <ArrowUpDown className="ml-2 h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleSort("orders")}
              className={
                sortBy === "orders" ? "bg-green-50 border-green-600" : ""
              }
            >
              Orders <ArrowUpDown className="ml-2 h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleSort("loyaltyPoints")}
              className={
                sortBy === "loyaltyPoints" ? "bg-green-50 border-green-600" : ""
              }
            >
              Points <ArrowUpDown className="ml-2 h-3 w-3" />
            </Button>
          </div>
          
          {/* Pagination */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => setItemsPerPage(parseInt(value))}
            >
              <SelectTrigger className="w-24">
                <SelectValue placeholder="5" />
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
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAndSortedUsers.length === 0 ? (
            <div className="text-center py-12">
              <UserPlus className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No users found
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || filterStatus !== "all" || dateRange.start || spendingTier !== "all"
                  ? "Try adjusting your filters or search terms"
                  : "Get started by adding your first user"}
              </p>
              {(searchTerm || filterStatus !== "all" || dateRange.start || spendingTier !== "all") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setFilterStatus("all");
                    setDateRange({ start: "", end: "" });
                    setSpendingTier("all");
                  }}
                >
                  Clear All Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold w-8">
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === filteredAndSortedUsers.length && filteredAndSortedUsers.length > 0}
                        onChange={selectAllUsers}
                        className="rounded"
                      />
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">User</th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Contact
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Orders
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Loyalty Points
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Tags
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => toggleUserSelection(user.id)}
                          className="rounded"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-green-100 text-green-700 font-semibold">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Joined {user.joined}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm space-y-1">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3 text-gray-400" />
                            <a
                              href={`mailto:${user.email}`}
                              className="hover:text-green-600"
                            >
                              {user.email}
                            </a>
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3 text-gray-400" />
                            <a
                              href={`tel:${user.phone}`}
                              className="hover:text-green-600"
                            >
                              {user.phone}
                            </a>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <ShoppingBag className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">{user.orders}</span>
                        </div>
                        <div className="text-xs text-gray-500">{user.totalSpent} total</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <Award className="h-4 w-4 text-yellow-500" />
                          <span className="font-semibold text-yellow-600">
                            {user.loyaltyPoints.toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {user.tags.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          className={`cursor-pointer ${
                            user.status === "Active"
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                          onClick={() => handleToggleStatus(user)}
                        >
                          {user.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-green-600 text-green-600 hover:bg-green-50"
                            onClick={() => {
                              setSelectedUser(user);
                              setIsViewDialogOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEditDialog(user)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                setSelectedUser(user);
                                setIsEmailDialogOpen(true);
                              }}>
                                <Send className="h-4 w-4 mr-2" />
                                Send Email
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                setSelectedUser(user);
                                setIsNotesDialogOpen(true);
                              }}>
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Add Note
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleToggleStatus(user)}>
                                {user.status === "Active" ? (
                                  <>
                                    <Ban className="h-4 w-4 mr-2" />
                                    Deactivate
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Activate
                                  </>
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View User Dialog with Tabs */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <Tabs defaultValue="profile" className="mt-4">
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="orders">Orders ({userOrders.length})</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="notes">Notes ({selectedUser.notes.length})</TabsTrigger>
              </TabsList>
              
              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex gap-3 flex-1">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="bg-green-100 text-green-700 text-xl font-semibold">
                        {getInitials(selectedUser.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="text-lg font-semibold">
                        {selectedUser.name}
                      </h4>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <Calendar className="h-3 w-3" />
                        Joined {selectedUser.joined}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {selectedUser.tags.map((tag, index) => (
                          <Badge key={index} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge
                      className={`cursor-pointer ${
                        selectedUser.status === "Active"
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      onClick={() => handleToggleStatus(selectedUser)}
                    >
                      {selectedUser.status}
                    </Badge>
                    <div className="flex items-center gap-1 text-yellow-600">
                      <Award className="h-5 w-5" />
                      <span className="font-semibold">{selectedUser.loyaltyPoints.toLocaleString()} points</span>
                    </div>
                  </div>
                </div>

                <hr className="border-gray-200" />

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <a
                        href={`mailto:${selectedUser.email}`}
                        className="text-sm hover:text-green-600"
                      >
                        {selectedUser.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <a
                        href={`tel:${selectedUser.phone}`}
                        className="text-sm hover:text-green-600"
                      >
                        {selectedUser.phone}
                      </a>
                    </div>
                  </div>
                </div>

                <hr className="border-gray-200" />

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Total Orders</p>
                    <p className="text-lg font-semibold">{selectedUser.orders}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Total Spent</p>
                    <p className="text-lg font-semibold text-green-600">
                      {selectedUser.totalSpent}
                    </p>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Avg. Order Value</p>
                    <p className="text-lg font-semibold text-yellow-600">
                      ${(parseFloat(selectedUser.totalSpent.replace(/[$,]/g, "")) / selectedUser.orders || 0).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Last Order</p>
                  <p className="text-sm font-medium">{selectedUser.lastOrder}</p>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1 border-green-600 text-green-600 hover:bg-green-50"
                    onClick={() => openEditDialog(selectedUser)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50"
                    onClick={() => {
                      setIsViewDialogOpen(false);
                      setIsEmailDialogOpen(true);
                    }}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                  <Button
                    variant="outline"
                    className={`flex-1 ${
                      selectedUser.status === "Active"
                        ? "border-gray-600 text-gray-600 hover:bg-gray-50"
                        : "border-green-600 text-green-600 hover:bg-green-50"
                    }`}
                    onClick={() => handleToggleStatus(selectedUser)}
                  >
                    {selectedUser.status === "Active" ? (
                      <>
                        <Ban className="h-4 w-4 mr-2" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Activate
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>
              
              {/* Orders Tab */}
              <TabsContent value="orders" className="space-y-4">
                <h3 className="font-semibold">Order History</h3>
                {userOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No orders found</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {userOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Order #{order.id}</p>
                          <p className="text-sm text-gray-500">{order.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{order.amount}</p>
                          <Badge
                            className={
                              order.status === "Delivered"
                                ? "bg-green-100 text-green-700"
                                : order.status === "Pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }
                          >
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              {/* Activity Tab */}
              <TabsContent value="activity" className="space-y-4">
                <h3 className="font-semibold">Activity Timeline</h3>
                <div className="space-y-4">
                  {timelineEvents
                    .filter(event => event.userId === selectedUser.id)
                    .map((event) => (
                      <div key={event.id} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`w-2 h-2 rounded-full ${
                            event.type === "order" ? "bg-green-500" :
                            event.type === "registration" ? "bg-blue-500" :
                            event.type === "note" ? "bg-yellow-500" : "bg-purple-500"
                          }`} />
                          <div className="w-px h-full bg-gray-200" />
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex justify-between">
                            <p className="font-medium">{event.title}</p>
                            <p className="text-sm text-gray-500">{event.date} {event.timestamp}</p>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </TabsContent>
              
              {/* Notes Tab */}
              <TabsContent value="notes" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">Internal Notes</h3>
                  <Button
                    size="sm"
                    onClick={() => {
                      setIsViewDialogOpen(false);
                      setIsNotesDialogOpen(true);
                    }}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Add Note
                  </Button>
                </div>
                {selectedUser.notes.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No notes yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedUser.notes.map((note, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">{note}</p>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-sm font-medium">Full Name *</Label>
              <Input
                placeholder="Enter full name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`mt-1 ${formErrors.name ? "border-red-500" : ""}`}
              />
              {formErrors.name && (
                <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
              )}
            </div>

            <div>
              <Label className="text-sm font-medium">Email *</Label>
              <Input
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`mt-1 ${formErrors.email ? "border-red-500" : ""}`}
              />
              {formErrors.email && (
                <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
              )}
            </div>

            <div>
              <Label className="text-sm font-medium">Phone *</Label>
              <Input
                type="tel"
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className={`mt-1 ${formErrors.phone ? "border-red-500" : ""}`}
                maxLength={14}
              />
              {formErrors.phone && (
                <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
              )}
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setIsEditDialogOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={handleEditUser}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Note Dialog */}
      <Dialog open={isNotesDialogOpen} onOpenChange={setIsNotesDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Note for {selectedUser?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Enter internal note about this customer..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              rows={4}
            />
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsNotesDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={addNote}
              >
                Add Note
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Send Email Dialog */}
      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Send Email to {selectedUser?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Template</Label>
              <div className="flex flex-wrap gap-2">
                {emailTemplates.map((template) => (
                  <Button
                    key={template.id}
                    variant="outline"
                    size="sm"
                    onClick={() => loadTemplate(template)}
                    className={selectedTemplate?.id === template.id ? "border-green-600 bg-green-50" : ""}
                  >
                    {template.name}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Subject *</Label>
              <Input
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Email subject"
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Message *</Label>
              <Textarea
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                placeholder="Email body"
                rows={6}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsEmailDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={sendEmail}
              >
                <Send className="h-4 w-4 mr-2" />
                Send Email
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}