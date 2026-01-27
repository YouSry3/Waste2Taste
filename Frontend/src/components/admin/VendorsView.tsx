import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  Search,
  Plus,
  MapPin,
  Phone,
  Mail,
  Store,
  Heart,
  Edit,
  Trash2,
  Download,
  ArrowUpDown,
  Filter,
  X,
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
import { Button } from "../ui/button";
/* ================= TYPES ================= */
interface Vendor {
  id: number;
  name: string;
  type: "Vendor" | "NGO Partner";
  category: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  listings: number;
  revenue: string;
  rating: number;
  status: "Active" | "Inactive";
}

/* ================= MOCK DATA ================= */
const initialVendors: Vendor[] = [
  {
    id: 1,
    name: "Green Valley Bakery",
    type: "Vendor",
    category: "Bakery",
    contact: "Jane Cooper",
    email: "manager@greenvalley.com",
    phone: "(555) 111-2222",
    address: "123 Valley Road",
    listings: 12,
    revenue: "$842.50",
    rating: 4.8,
    status: "Active",
  },
  {
    id: 2,
    name: "City Cafe",
    type: "Vendor",
    category: "Cafe",
    contact: "Tom Harris",
    email: "contact@citycafe.com",
    phone: "(555) 222-3333",
    address: "456 Main Street",
    listings: 8,
    revenue: "$625.40",
    rating: 4.6,
    status: "Active",
  },
  {
    id: 3,
    name: "Fresh Market",
    type: "Vendor",
    category: "Grocery",
    contact: "Sarah Miller",
    email: "info@freshmarket.com",
    phone: "(555) 333-4444",
    address: "789 Market Ave",
    listings: 15,
    revenue: "$1,124.80",
    rating: 4.9,
    status: "Active",
  },
  {
    id: 4,
    name: "Downtown Deli",
    type: "Vendor",
    category: "Restaurant",
    contact: "Mike Johnson",
    email: "owner@downtowndeli.com",
    phone: "(555) 444-5555",
    address: "321 Downtown Blvd",
    listings: 10,
    revenue: "$758.20",
    rating: 4.7,
    status: "Active",
  },
  {
    id: 5,
    name: "Community Food Bank",
    type: "NGO Partner",
    category: "Non-Profit",
    contact: "Emily Davis",
    email: "info@foodbank.org",
    phone: "(555) 555-6666",
    address: "654 Hope Avenue",
    listings: 0,
    revenue: "$0.00",
    rating: 5.0,
    status: "Active",
  },
  {
    id: 6,
    name: "Organic Bistro",
    type: "Vendor",
    category: "Restaurant",
    contact: "Robert Lee",
    email: "hello@organicbistro.com",
    phone: "(555) 666-7777",
    address: "987 Organic Way",
    listings: 11,
    revenue: "$892.60",
    rating: 4.5,
    status: "Active",
  },
  {
    id: 7,
    name: "Sweet Treats",
    type: "Vendor",
    category: "Bakery",
    contact: "Linda White",
    email: "sweet@treats.com",
    phone: "(555) 777-8888",
    address: "258 Sweet Lane",
    listings: 9,
    revenue: "$698.30",
    rating: 4.8,
    status: "Active",
  },
  {
    id: 8,
    name: "Hope Shelter",
    type: "NGO Partner",
    category: "Non-Profit",
    contact: "James Brown",
    email: "contact@hopeshelter.org",
    phone: "(555) 888-9999",
    address: "147 Shelter Street",
    listings: 0,
    revenue: "$0.00",
    rating: 5.0,
    status: "Active",
  },
];

/* ================= COMPONENT ================= */
export function VendorsView() {
  const [vendors, setVendors] = useState<Vendor[]>(initialVendors);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState<
    "name" | "revenue" | "rating" | "listings"
  >("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [vendorToDelete, setVendorToDelete] = useState<Vendor | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    type: "Vendor" as "Vendor" | "NGO Partner",
    category: "",
    contact: "",
    email: "",
    phone: "",
    address: "",
  });

  // Form errors
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Validation functions
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

    if (!formData.name.trim()) errors.name = "Business name is required";
    if (!formData.category) errors.category = "Category is required";
    if (!formData.contact.trim()) errors.contact = "Contact person is required";
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
    if (!formData.address.trim()) errors.address = "Address is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === "phone") {
      value = formatPhoneNumber(value);
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
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
      type: "Vendor",
      category: "",
      contact: "",
      email: "",
      phone: "",
      address: "",
    });
    setFormErrors({});
  };

  const handleAddVendor = () => {
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    const newVendor: Vendor = {
      id: Math.max(...vendors.map((v) => v.id), 0) + 1,
      name: formData.name,
      type: formData.type,
      category: formData.category,
      contact: formData.contact,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      listings: 0,
      revenue: "$0.00",
      rating: 5.0,
      status: "Active",
    };

    setVendors((prev) => [...prev, newVendor]);
    toast.success(`${formData.name} added successfully!`);
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEditVendor = () => {
    if (!validateForm() || !selectedVendor) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setVendors((prev) =>
      prev.map((v) =>
        v.id === selectedVendor.id
          ? {
              ...v,
              name: formData.name,
              type: formData.type,
              category: formData.category,
              contact: formData.contact,
              email: formData.email,
              phone: formData.phone,
              address: formData.address,
            }
          : v,
      ),
    );

    toast.success(`${formData.name} updated successfully!`);
    resetForm();
    setIsEditDialogOpen(false);
    setIsDialogOpen(false);
  };

  const handleDeleteVendor = () => {
    if (!vendorToDelete) return;

    setVendors((prev) => prev.filter((v) => v.id !== vendorToDelete.id));
    toast.success(`${vendorToDelete.name} deleted successfully`);
    setVendorToDelete(null);
    setIsDeleteDialogOpen(false);
    setIsDialogOpen(false);
  };

  const handleToggleStatus = (vendor: Vendor) => {
    const newStatus = vendor.status === "Active" ? "Inactive" : "Active";
    setVendors((prev) =>
      prev.map((v) => (v.id === vendor.id ? { ...v, status: newStatus } : v)),
    );
    toast.success(`${vendor.name} is now ${newStatus}`);
  };

  const openEditDialog = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setFormData({
      name: vendor.name,
      type: vendor.type,
      category: vendor.category,
      contact: vendor.contact,
      email: vendor.email,
      phone: vendor.phone,
      address: vendor.address,
    });
    setIsDialogOpen(false);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (vendor: Vendor) => {
    setVendorToDelete(vendor);
    setIsDialogOpen(false);
    setIsDeleteDialogOpen(true);
  };

  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Name",
      "Type",
      "Category",
      "Contact",
      "Email",
      "Phone",
      "Address",
      "Listings",
      "Revenue",
      "Rating",
      "Status",
    ];
    const csvData = vendors.map((v) => [
      v.id,
      v.name,
      v.type,
      v.category,
      v.contact,
      v.email,
      v.phone,
      v.address,
      v.listings,
      v.revenue,
      v.rating,
      v.status,
    ]);

    const csv = [
      headers.join(","),
      ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vendors-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success("Vendor list exported successfully!");
  };

  const toggleSort = (field: "name" | "revenue" | "rating" | "listings") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // Filter and sort vendors
  const filteredAndSortedVendors = vendors
    .filter((vendor) => {
      const matchesSearch =
        vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === "all" || vendor.type === filterType;
      const matchesCategory =
        filterCategory === "all" || vendor.category === filterCategory;
      const matchesStatus =
        filterStatus === "all" || vendor.status === filterStatus;
      return matchesSearch && matchesType && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      let aVal, bVal;

      switch (sortBy) {
        case "name":
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case "revenue":
          aVal = parseFloat(a.revenue.replace(/[$,]/g, ""));
          bVal = parseFloat(b.revenue.replace(/[$,]/g, ""));
          break;
        case "rating":
          aVal = a.rating;
          bVal = b.rating;
          break;
        case "listings":
          aVal = a.listings;
          bVal = b.listings;
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

  const regularVendors = vendors.filter((v) => v.type === "Vendor");
  const ngoPartners = vendors.filter((v) => v.type === "NGO Partner");
  const categories = Array.from(new Set(vendors.map((v) => v.category)));

  // Calculate top performers
  const topVendorsByRevenue = [...regularVendors]
    .sort(
      (a, b) =>
        parseFloat(b.revenue.replace(/[$,]/g, "")) -
        parseFloat(a.revenue.replace(/[$,]/g, "")),
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
          <h1 className="text-2xl font-semibold">Vendors & Partners</h1>
          <p className="text-gray-500">
            Manage vendor accounts and NGO partnerships
          </p>
        </div>

        <div className="flex gap-3">
          {/* Export Button */}
          <Button
            variant="outline"
            className="flex items-center gap-2 border-green-600 text-green-600 hover:bg-green-50"
            onClick={handleExportCSV}
          >
            <Download className="h-4 w-4" /> Export CSV
          </Button>

          {/* Add Vendor Button */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700 flex items-center gap-2">
                <Plus className="h-4 w-4" /> Add Vendor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Vendor</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label className="text-sm font-medium">Business Name *</Label>
                  <Input
                    placeholder="Enter business name"
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
                  <Label className="text-sm font-medium">Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleInputChange("type", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Vendor">Vendor</SelectItem>
                      <SelectItem value="NGO Partner">NGO Partner</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      handleInputChange("category", value)
                    }
                  >
                    <SelectTrigger
                      className={`mt-1 ${formErrors.category ? "border-red-500" : ""}`}
                    >
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bakery">Bakery</SelectItem>
                      <SelectItem value="Restaurant">Restaurant</SelectItem>
                      <SelectItem value="Cafe">Cafe</SelectItem>
                      <SelectItem value="Grocery">Grocery</SelectItem>
                      <SelectItem value="Non-Profit">Non-Profit</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.category && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.category}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-medium">
                    Contact Person *
                  </Label>
                  <Input
                    placeholder="Enter contact name"
                    value={formData.contact}
                    onChange={(e) =>
                      handleInputChange("contact", e.target.value)
                    }
                    className={`mt-1 ${formErrors.contact ? "border-red-500" : ""}`}
                  />
                  {formErrors.contact && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.contact}
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

                <div>
                  <Label className="text-sm font-medium">Address *</Label>
                  <Input
                    placeholder="Enter business address"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    className={`mt-1 ${formErrors.address ? "border-red-500" : ""}`}
                  />
                  {formErrors.address && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.address}
                    </p>
                  )}
                </div>

                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={handleAddVendor}
                >
                  Add Vendor
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
            <p className="text-sm text-gray-500 mb-1">Total Vendors</p>
            <h3 className="text-3xl font-bold text-gray-900">
              {regularVendors.length}
            </h3>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 mb-1">NGO Partners</p>
            <h3 className="text-3xl font-bold text-gray-900">
              {ngoPartners.length}
            </h3>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 mb-1">Active Listings</p>
            <h3 className="text-3xl font-bold text-gray-900">
              {vendors.reduce((s, v) => s + v.listings, 0)}
            </h3>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
            <h3 className="text-3xl font-bold text-green-600">
              $
              {vendors
                .reduce(
                  (s, v) => s + parseFloat(v.revenue.replace(/[$,]/g, "")),
                  0,
                )
                .toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
            </h3>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      {topVendorsByRevenue.length > 0 && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <span className="text-yellow-500">⭐</span> Top Performers by
              Revenue
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topVendorsByRevenue.map((vendor, index) => (
                <div
                  key={vendor.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="text-2xl font-bold text-gray-400">
                    #{index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{vendor.name}</p>
                    <p className="text-green-600 font-semibold">
                      {vendor.revenue}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search & Filter */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-10"
              placeholder="Search vendors by name, contact, category, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Vendor">Vendors</SelectItem>
              <SelectItem value="NGO Partner">NGO Partners</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Additional Filters */}
        <div className="flex gap-4 items-center">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort Options */}
          <div className="flex gap-2 ml-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleSort("name")}
              className={
                sortBy === "name" ? "bg-green-50 border-green-600" : ""
              }
            >
              Name <ArrowUpDown className="ml-2 h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleSort("revenue")}
              className={
                sortBy === "revenue" ? "bg-green-50 border-green-600" : ""
              }
            >
              Revenue <ArrowUpDown className="ml-2 h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleSort("rating")}
              className={
                sortBy === "rating" ? "bg-green-50 border-green-600" : ""
              }
            >
              Rating <ArrowUpDown className="ml-2 h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Active Filters Display */}
        {(filterType !== "all" ||
          filterCategory !== "all" ||
          filterStatus !== "all") && (
          <div className="flex gap-2 items-center">
            <span className="text-sm text-gray-500">Active filters:</span>
            {filterType !== "all" && (
              <Badge variant="outline" className="gap-1">
                Type: {filterType}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setFilterType("all")}
                />
              </Badge>
            )}
            {filterCategory !== "all" && (
              <Badge variant="outline" className="gap-1">
                Category: {filterCategory}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setFilterCategory("all")}
                />
              </Badge>
            )}
            {filterStatus !== "all" && (
              <Badge variant="outline" className="gap-1">
                Status: {filterStatus}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setFilterStatus("all")}
                />
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-gray-500">
          Showing {filteredAndSortedVendors.length} of {vendors.length} vendor
          {vendors.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Vendors Grid */}
      {filteredAndSortedVendors.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <Store className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No vendors found
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm ||
              filterType !== "all" ||
              filterCategory !== "all" ||
              filterStatus !== "all"
                ? "Try adjusting your filters or search terms"
                : "Get started by adding your first vendor"}
            </p>
            {(searchTerm ||
              filterType !== "all" ||
              filterCategory !== "all" ||
              filterStatus !== "all") && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setFilterType("all");
                  setFilterCategory("all");
                  setFilterStatus("all");
                }}
              >
                Clear All Filters
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAndSortedVendors.map((vendor) => (
            <Card key={vendor.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between mb-4">
                  <div className="flex gap-3 flex-1">
                    <div
                      className={`p-3 rounded-lg ${vendor.type === "NGO Partner" ? "bg-pink-100" : "bg-blue-100"}`}
                    >
                      {vendor.type === "NGO Partner" ? (
                        <Heart className="text-pink-600 h-6 w-6" />
                      ) : (
                        <Store className="text-blue-600 h-6 w-6" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-lg truncate">
                        {vendor.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className="text-xs" variant="outline">
                          {vendor.category}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm">
                          <span className="text-yellow-500">★</span>
                          <span className="font-medium">{vendor.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge
                      className={`h-fit cursor-pointer ${
                        vendor.status === "Active"
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      onClick={() => handleToggleStatus(vendor)}
                    >
                      {vendor.status}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    <a
                      href={`mailto:${vendor.email}`}
                      className="hover:text-green-600 truncate"
                    >
                      {vendor.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 flex-shrink-0" />
                    <a
                      href={`tel:${vendor.phone}`}
                      className="hover:text-green-600"
                    >
                      {vendor.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{vendor.address}</span>
                  </div>
                </div>
                <div className="flex gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-gray-500">Listings:</span>{" "}
                    <span className="font-semibold">
                      {vendor.type === "Vendor" ? vendor.listings : "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Revenue:</span>{" "}
                    <span
                      className={`font-semibold ${vendor.type === "Vendor" ? "text-green-600" : "text-gray-500"}`}
                    >
                      {vendor.type === "Vendor" ? vendor.revenue : "Non-Profit"}
                    </span>
                  </div>
                </div>

                {/* View Details Button */}
                <Button
                  variant="outline"
                  className="w-full border-green-600 text-green-600 hover:bg-green-50"
                  onClick={() => {
                    setSelectedVendor(vendor);
                    setIsDialogOpen(true);
                  }}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* View Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Vendor Details</DialogTitle>
          </DialogHeader>
          {selectedVendor && (
            <div className="mt-4 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex gap-3 flex-1">
                  <div
                    className={`p-3 rounded-lg ${selectedVendor.type === "NGO Partner" ? "bg-pink-100" : "bg-blue-100"}`}
                  >
                    {selectedVendor.type === "NGO Partner" ? (
                      <Heart className="text-pink-600 h-6 w-6" />
                    ) : (
                      <Store className="text-blue-600 h-6 w-6" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">
                      {selectedVendor.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {selectedVendor.type} – {selectedVendor.category}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Contact: {selectedVendor.contact}
                    </p>
                  </div>
                </div>
                <Badge
                  className={`h-fit cursor-pointer ${
                    selectedVendor.status === "Active"
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => handleToggleStatus(selectedVendor)}
                >
                  {selectedVendor.status}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-yellow-500">★</span>
                <span className="font-semibold">{selectedVendor.rating}</span>
                <span className="text-gray-500 text-sm">rating</span>
              </div>

              <hr className="border-gray-200" />

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <a
                      href={`mailto:${selectedVendor.email}`}
                      className="text-sm hover:text-green-600"
                    >
                      {selectedVendor.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <a
                      href={`tel:${selectedVendor.phone}`}
                      className="text-sm hover:text-green-600"
                    >
                      {selectedVendor.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="text-sm">{selectedVendor.address}</p>
                  </div>
                </div>
              </div>

              <hr className="border-gray-200" />

              {selectedVendor.type === "Vendor" ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Active Listings</p>
                    <p className="text-lg font-semibold">
                      {selectedVendor.listings}
                    </p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Revenue</p>
                    <p className="text-lg font-semibold text-green-600">
                      {selectedVendor.revenue}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-pink-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">
                    This NGO receives donated surplus food from vendors.
                  </p>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1 border-green-600 text-green-600 hover:bg-green-50"
                  onClick={() => openEditDialog(selectedVendor)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-red-600 text-red-600 hover:bg-red-50"
                  onClick={() => openDeleteDialog(selectedVendor)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Vendor</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-sm font-medium">Business Name *</Label>
              <Input
                placeholder="Enter business name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`mt-1 ${formErrors.name ? "border-red-500" : ""}`}
              />
              {formErrors.name && (
                <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
              )}
            </div>

            <div>
              <Label className="text-sm font-medium">Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleInputChange("type", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Vendor">Vendor</SelectItem>
                  <SelectItem value="NGO Partner">NGO Partner</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange("category", value)}
              >
                <SelectTrigger
                  className={`mt-1 ${formErrors.category ? "border-red-500" : ""}`}
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bakery">Bakery</SelectItem>
                  <SelectItem value="Restaurant">Restaurant</SelectItem>
                  <SelectItem value="Cafe">Cafe</SelectItem>
                  <SelectItem value="Grocery">Grocery</SelectItem>
                  <SelectItem value="Non-Profit">Non-Profit</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.category && (
                <p className="text-red-500 text-xs mt-1">
                  {formErrors.category}
                </p>
              )}
            </div>

            <div>
              <Label className="text-sm font-medium">Contact Person *</Label>
              <Input
                placeholder="Enter contact name"
                value={formData.contact}
                onChange={(e) => handleInputChange("contact", e.target.value)}
                className={`mt-1 ${formErrors.contact ? "border-red-500" : ""}`}
              />
              {formErrors.contact && (
                <p className="text-red-500 text-xs mt-1">
                  {formErrors.contact}
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

            <div>
              <Label className="text-sm font-medium">Address *</Label>
              <Input
                placeholder="Enter business address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className={`mt-1 ${formErrors.address ? "border-red-500" : ""}`}
              />
              {formErrors.address && (
                <p className="text-red-500 text-xs mt-1">
                  {formErrors.address}
                </p>
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
                onClick={handleEditVendor}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Vendor</DialogTitle>
          </DialogHeader>
          {vendorToDelete && (
            <div className="py-4">
              <p className="text-gray-700">
                Are you sure you want to delete{" "}
                <strong>{vendorToDelete.name}</strong>? This action cannot be
                undone.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setVendorToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteVendor}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
