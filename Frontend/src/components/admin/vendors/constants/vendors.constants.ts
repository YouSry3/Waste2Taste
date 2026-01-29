export const VENDOR_CATEGORIES = [
  "Bakery",
  "Restaurant",
  "Cafe",
  "Grocery",
  "Non-Profit",
  "Food Truck",
  "Catering",
  "Farmers Market",
] as const;

export const VENDOR_TYPES = [
  { value: "Vendor", label: "Vendor", color: "blue" },
  { value: "NGO Partner", label: "NGO Partner", color: "pink" },
] as const;

export const VENDOR_STATUSES = [
  { value: "Active", label: "Active", color: "green" },
  { value: "Inactive", label: "Inactive", color: "gray" },
] as const;

export const SORT_OPTIONS = [
  { value: "name", label: "Name" },
  { value: "revenue", label: "Revenue" },
  { value: "rating", label: "Rating" },
  { value: "listings", label: "Listings" },
] as const;

export const FILTER_COLORS = {
  search: "bg-blue-100 text-blue-700 border-blue-300",
  type: "bg-purple-100 text-purple-700 border-purple-300",
  category: "bg-green-100 text-green-700 border-green-300",
  status: "bg-amber-100 text-amber-700 border-amber-300",
} as const;

export const VENDOR_ICONS = {
  Vendor: "Store",
  "NGO Partner": "Heart",
} as const;

export const VENDOR_COLORS = {
  Vendor: "bg-blue-100 text-blue-600",
  "NGO Partner": "bg-pink-100 text-pink-600",
} as const;
