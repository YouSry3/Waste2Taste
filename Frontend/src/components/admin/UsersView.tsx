//actions dropdown menu bug

import { useState, useRef, useEffect } from "react";
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
  ArrowUpDown,
  Download,
  Eye,
  UserPlus,
  Edit,
  Ban,
  CheckCircle,
  Check,
  Trash2,
  ChevronDown,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import toast, { Toaster } from "react-hot-toast";

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
  },
];

export function UsersView() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState<
    "name" | "orders" | "totalSpent" | "lastOrder"
  >("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [isBulkActionLoading, setIsBulkActionLoading] = useState(false);
  const [showActionsDropdown, setShowActionsDropdown] = useState(false);
  const actionsDropdownRef = useRef<HTMLDivElement>(null);

  // Form state for Add User
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    orders: "0",
    totalSpent: "0.00",
    status: "Active" as "Active" | "Inactive",
    joined: new Date().toISOString().split("T")[0],
    lastOrder: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

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
    if (!formData.orders.trim()) {
      errors.orders = "Orders is required";
    } else if (isNaN(Number(formData.orders)) || Number(formData.orders) < 0) {
      errors.orders = "Orders must be a positive number";
    }
    if (!formData.totalSpent.trim()) {
      errors.totalSpent = "Total spent is required";
    } else if (
      isNaN(Number(formData.totalSpent.replace("$", ""))) ||
      Number(formData.totalSpent.replace("$", "")) < 0
    ) {
      errors.totalSpent = "Total spent must be a positive number";
    }
    if (!formData.lastOrder.trim()) {
      errors.lastOrder = "Last order date is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === "phone") {
      value = formatPhoneNumber(value);
    }
    if (field === "totalSpent") {
      // Ensure it starts with $ and has proper format
      if (!value.startsWith("$") && value.trim() !== "") {
        value = "$" + value;
      }
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
      orders: "0",
      totalSpent: "0.00",
      status: "Active",
      joined: new Date().toISOString().split("T")[0],
      lastOrder: "",
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
      orders: Number(formData.orders),
      totalSpent: formData.totalSpent.startsWith("$")
        ? formData.totalSpent
        : `$${formData.totalSpent}`,
      status: formData.status,
      joined: formData.joined,
      lastOrder: formData.lastOrder,
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
              orders: Number(formData.orders),
              totalSpent: formData.totalSpent.startsWith("$")
                ? formData.totalSpent
                : `$${formData.totalSpent}`,
              status: formData.status,
              lastOrder: formData.lastOrder,
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
      orders: user.orders.toString(),
      totalSpent: user.totalSpent,
      status: user.status,
      joined: user.joined,
      lastOrder: user.lastOrder,
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
    field: "name" | "orders" | "totalSpent" | "lastOrder",
  ) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // Bulk Actions Functions
  const toggleUserSelection = (userId: number) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const toggleSelectAll = () => {
    if (isSelectAll) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredAndSortedUsers.map((user) => user.id));
    }
    setIsSelectAll(!isSelectAll);
  };

  const handleBulkAction = async (
    action: "activate" | "deactivate" | "delete",
  ) => {
    setIsBulkActionLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    switch (action) {
      case "activate":
        setUsers((prev) =>
          prev.map((u) =>
            selectedUsers.includes(u.id) ? { ...u, status: "Active" } : u,
          ),
        );
        toast.success(`${selectedUsers.length} users activated`);
        break;
      case "deactivate":
        setUsers((prev) =>
          prev.map((u) =>
            selectedUsers.includes(u.id) ? { ...u, status: "Inactive" } : u,
          ),
        );
        toast.success(`${selectedUsers.length} users deactivated`);
        break;
      case "delete":
        setUsers((prev) => prev.filter((u) => !selectedUsers.includes(u.id)));
        toast.success(`${selectedUsers.length} users deleted`);
        break;
    }

    setSelectedUsers([]);
    setIsSelectAll(false);
    setIsBulkActionLoading(false);
    setShowActionsDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        actionsDropdownRef.current &&
        !actionsDropdownRef.current.contains(event.target as Node)
      ) {
        setShowActionsDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredAndSortedUsers = users
    .filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === "all" || user.status.toLowerCase() === filterStatus;
      return matchesSearch && matchesStatus;
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
        default:
          return 0;
      }

      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      } else {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
      }
    });

  const activeUsers = users.filter((u) => u.status === "Active");
  const topSpenders = [...users]
    .sort(
      (a, b) =>
        parseFloat(b.totalSpent.replace(/[$,]/g, "")) -
        parseFloat(a.totalSpent.replace(/[$,]/g, "")),
    )
    .slice(0, 3);

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
            className="flex items-center gap-2  hover:bg-green-50 !important border-green-600 border-1 text-green-600"
            onClick={handleExportCSV}
          >
            <Download className="h-4 w-4" /> Export CSV
          </Button>

          <Dialog
            open={isAddDialogOpen}
            onOpenChange={(open) => {
              setIsAddDialogOpen(open);
              if (!open) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">
                <UserPlus className="h-4 w-4" /> Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Orders *</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={formData.orders}
                      onChange={(e) =>
                        handleInputChange("orders", e.target.value)
                      }
                      className={`mt-1 ${formErrors.orders ? "border-red-500" : ""}`}
                      min="0"
                    />
                    {formErrors.orders && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.orders}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Total Spent *</Label>
                    <Input
                      placeholder="$0.00"
                      value={formData.totalSpent}
                      onChange={(e) =>
                        handleInputChange("totalSpent", e.target.value)
                      }
                      className={`mt-1 ${formErrors.totalSpent ? "border-red-500" : ""}`}
                    />
                    {formErrors.totalSpent && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.totalSpent}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        handleInputChange("status", e.target.value)
                      }
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Joined Date</Label>
                    <Input
                      type="date"
                      value={formData.joined}
                      onChange={(e) =>
                        handleInputChange("joined", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">
                    Last Order Date *
                  </Label>
                  <Input
                    type="date"
                    value={formData.lastOrder}
                    onChange={(e) =>
                      handleInputChange("lastOrder", e.target.value)
                    }
                    className={`mt-1 ${formErrors.lastOrder ? "border-red-500" : ""}`}
                  />
                  {formErrors.lastOrder && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.lastOrder}
                    </p>
                  )}
                </div>

                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white mt-4"
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
            <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
            <h3 className="text-3xl font-bold text-green-600">
              $
              {users
                .reduce(
                  (sum, u) => sum + parseFloat(u.totalSpent.replace("$", "")),
                  0,
                )
                .toFixed(2)}
            </h3>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Actions Bar */}
      {selectedUsers.length > 0 && (
        <div className="sticky top-4 z-50 mb-6">
          <div className="text-black rounded-lg shadow-xl p-4 border border-gray-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-green-500/20 p-2 rounded-lg border border-green-500/30">
                  <Check className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <h3 className="text-black font-semibold">
                    {selectedUsers.length} user
                    {selectedUsers.length !== 1 ? "s" : ""} selected
                  </h3>
                  <p className="text-black text-sm">
                    Perform actions on selected users
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2" ref={actionsDropdownRef}>
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white"
                  size="sm"
                  onClick={() => {
                    setSelectedUsers([]);
                    setIsSelectAll(false);
                  }}
                  disabled={isBulkActionLoading}
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear
                </Button>

                <div className="relative">
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => setShowActionsDropdown(!showActionsDropdown)}
                    disabled={isBulkActionLoading}
                  >
                    Actions
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>

                  {showActionsDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-20">
                      <div className="py-2">
                        <button
                          onClick={() => handleBulkAction("activate")}
                          className="w-full px-4 py-3 text-sm text-left hover:bg-green-100 flex items-center gap-3 disabled:opacity-50 transition-colors border-b border-gray-200"
                          disabled={isBulkActionLoading}
                        >
                          <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                          </div>
                          <div>
                            <p className="font-medium text-green-600">
                              Activate Selected
                            </p>
                            <p className="text-xs text-green-600">
                              Set users to active status
                            </p>
                          </div>
                        </button>

                        <button
                          onClick={() => handleBulkAction("deactivate")}
                          className="w-full px-4 py-3 text-sm text-left hover:bg-gray-100  flex items-center gap-3 disabled:opacity-50 transition-colors border-b border-gray-200"
                          disabled={isBulkActionLoading}
                        >
                          <div className="w-8 h-8 rounded-lg bg-gray-700/50 flex items-center justify-center">
                            <Ban className="h-4 w-4 text-gray-300" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-600">
                              Deactivate Selected
                            </p>
                            <p className="text-xs text-gray-600">
                              Set users to inactive status
                            </p>
                          </div>
                        </button>

                        <button
                          onClick={() => handleBulkAction("delete")}
                          className="w-full px-4 py-3 text-sm text-left hover:bg-red-900/20 flex items-center gap-3 disabled:opacity-50 transition-colors"
                          disabled={isBulkActionLoading}
                        >
                          <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                            <Trash2 className="h-4 w-4 text-red-400" />
                          </div>
                          <div>
                            <p className="font-medium text-red-400">
                              Delete Selected
                            </p>
                            <p className="text-xs text-red-400/70">
                              Permanently remove users
                            </p>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filter - UPDATED WITH NAV TABS */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 focus:border-0"
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
                    ? "bg-green-600 hover:bg-green-700 text-white"
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
                    ? "bg-green-600 hover:bg-green-700 text-white"
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
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : ""
                }
              >
                Inactive
              </Button>
            </div>
          </div>

          {/* New: Sort Tabs Navigation */}
          <div className="mt-4 border-b border-gray-200">
            <div className="flex space-x-1 justify-self-end">
              <button
                onClick={() => toggleSort("name")}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all ${
                  sortBy === "name"
                    ? "bg-green-600 text-white border-b-2 border-green-600"
                    : "text-gray-600 hover:text-green-600 hover:bg-green-50"
                }`}
              >
                Sort by Name{" "}
                {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
              </button>
              <button
                onClick={() => toggleSort("orders")}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all ${
                  sortBy === "orders"
                    ? "bg-green-600 text-white border-b-2 border-green-600"
                    : "text-gray-600 hover:text-green-600 hover:bg-green-50"
                }`}
              >
                Sort by Orders{" "}
                {sortBy === "orders" && (sortOrder === "asc" ? "↑" : "↓")}
              </button>
              <button
                onClick={() => toggleSort("totalSpent")}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all ${
                  sortBy === "totalSpent"
                    ? "bg-green-600 text-white border-b-2 border-green-600"
                    : "text-gray-600 hover:text-green-600 hover:bg-green-50"
                }`}
              >
                Sort by Spend{" "}
                {sortBy === "totalSpent" && (sortOrder === "asc" ? "↑" : "↓")}
              </button>
              <button
                onClick={() => toggleSort("lastOrder")}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all ${
                  sortBy === "lastOrder"
                    ? "bg-green-600 text-white border-b-2 border-green-600"
                    : "text-gray-600 hover:text-green-600 hover:bg-green-50"
                }`}
              >
                Sort by Last Order{" "}
                {sortBy === "lastOrder" && (sortOrder === "asc" ? "↑" : "↓")}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sort Options and Bulk Select - REMOVED SORT BUTTONS HERE */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">
          Showing {filteredAndSortedUsers.length} of {users.length} user
          {users.length !== 1 ? "s" : ""}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSelectAll}
            className={`flex items-center gap-2 transition-all ${isSelectAll ? "bg-green-50 border-green-600 text-green-600" : ""}`}
          >
            <div
              className={`w-4 h-4 border rounded flex items-center justify-center transition-all ${
                isSelectAll
                  ? "bg-green-600 border-green-600"
                  : "border-gray-300"
              }`}
            >
              {isSelectAll && <Check className="h-3 w-3 text-white" />}
            </div>
            Select All
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users ({filteredAndSortedUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAndSortedUsers.length === 0 ? (
            <div className="text-center py-12">
              <UserPlus className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No users found
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || filterStatus !== "all"
                  ? "Try adjusting your filters or search terms"
                  : "Get started by adding your first user"}
              </p>
              {(searchTerm || filterStatus !== "all") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setFilterStatus("all");
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
                    <th className=" text-left py-3 pe-4 ps-1 font-semibold w-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleSelectAll}
                        className={`flex items-center justify-content-start gap-2 transition-all ${isSelectAll ? "bg-green-50 border-green-600 text-green-600" : ""}`}
                      >
                        <div
                          className={`w-4 h-4 border rounded flex items-center justify-center transition-all ${
                            isSelectAll
                              ? "bg-green-600 border-green-600"
                              : "border-gray-300"
                          }`}
                        >
                          {isSelectAll && (
                            <Check className="h-3 w-3 text-white" />
                          )}
                        </div>
                        Select All
                      </Button>
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">User</th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Contact
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Orders
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Total Spent
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Last Order
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
                  {filteredAndSortedUsers.map((user) => {
                    const isSelected = selectedUsers.includes(user.id);
                    return (
                      <tr
                        key={user.id}
                        className={`border-b transition-all ${
                          isSelected
                            ? "bg-green-50/50 hover:bg-green-50 border-green-100"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <td className="py-3 px-4">
                          <button
                            onClick={() => toggleUserSelection(user.id)}
                            className="group focus:outline-none"
                          >
                            <div
                              className={`w-5 h-5 border rounded-lg flex items-center justify-center transition-all ${
                                isSelected
                                  ? "bg-green-600 border-green-600"
                                  : "border-gray-300 group-hover:border-green-400"
                              }`}
                            >
                              {isSelected && (
                                <Check className="h-3 w-3 text-white" />
                              )}
                            </div>
                          </button>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-green-100 text-green-700 font-semibold">
                                  {getInitials(user.name)}
                                </AvatarFallback>
                              </Avatar>
                              {isSelected && (
                                <div className="absolute -top-1 -right-1">
                                  <div className="bg-green-600 rounded-full p-0.5">
                                    <Check className="h-3 w-3 text-white" />
                                  </div>
                                </div>
                              )}
                            </div>
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
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-green-600">
                            {user.totalSpent}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-600">
                            {user.lastOrder}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            className={`cursor-pointer transition-all ${
                              user.status === "Active"
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            } ${isSelected ? "ring-2 ring-green-300 ring-offset-1" : ""}`}
                            onClick={() => handleToggleStatus(user)}
                          >
                            {user.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-green-600 text-green-600 hover:bg-green-50"
                            onClick={() => {
                              setSelectedUser(user);
                              setIsViewDialogOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View User Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="mt-4 space-y-4">
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
                  </div>
                </div>
                <Badge
                  className={`h-fit cursor-pointer ${
                    selectedUser.status === "Active"
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => handleToggleStatus(selectedUser)}
                >
                  {selectedUser.status}
                </Badge>
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

              <div className="grid grid-cols-2 gap-4">
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
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Orders *</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.orders}
                  onChange={(e) => handleInputChange("orders", e.target.value)}
                  className={`mt-1 ${formErrors.orders ? "border-red-500" : ""}`}
                  min="0"
                />
                {formErrors.orders && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.orders}
                  </p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium">Total Spent *</Label>
                <Input
                  placeholder="$0.00"
                  value={formData.totalSpent}
                  onChange={(e) =>
                    handleInputChange("totalSpent", e.target.value)
                  }
                  className={`mt-1 ${formErrors.totalSpent ? "border-red-500" : ""}`}
                />
                {formErrors.totalSpent && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.totalSpent}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Status</Label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div>
                <Label className="text-sm font-medium">Last Order Date *</Label>
                <Input
                  type="date"
                  value={formData.lastOrder}
                  onChange={(e) =>
                    handleInputChange("lastOrder", e.target.value)
                  }
                  className={`mt-1 ${formErrors.lastOrder ? "border-red-500" : ""}`}
                />
                {formErrors.lastOrder && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.lastOrder}
                  </p>
                )}
              </div>
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
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                onClick={handleEditUser}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
