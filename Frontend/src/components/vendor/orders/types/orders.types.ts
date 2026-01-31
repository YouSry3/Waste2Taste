/**
 * ORDER TYPES - READY FOR API INTEGRATION
 *
 * INSTRUCTIONS FOR AI DEVELOPER:
 * 1. Match these interfaces exactly with your backend API response
 * 2. Add pagination types if your API uses cursor/offset pagination
 * 3. Add filter parameter types matching your API endpoints
 * 4. Add validation with Zod if needed
 */

export type OrderStatus =
  | "Completed"
  | "Pending Pickup"
  | "Cancelled"
  | "In Progress"
  | "Ready for Pickup";

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: string;
  priceValue: number;
  sku?: string;
  category?: string;
  // TODO: Add more item fields from your API
}

export interface Order {
  id: string;
  orderNumber: string; // API: Use the actual field name from your backend
  customerName: string; // API: Might be "customer.name" or "user.name"
  vendorName: string; // API: Might be "vendor.name" or "store.name"
  items: string; // API: Comma-separated or array from API
  quantity: number;
  totalAmount: string; // API: Format as needed (currency)
  amountValue: number; // API: Raw number for calculations
  pickupTime: string; // API: ISO string or formatted time
  status: OrderStatus; // API: Ensure status values match backend enum
  orderDate: string; // API: ISO date string
  deliveryAddress: string; // API: Full address or address object
  paymentMethod: string; // API: "credit_card", "paypal", etc.
  notes?: string;
  customerEmail: string;
  customerPhone: string;
  vendorEmail: string;
  vendorPhone: string;
  itemsList?: OrderItem[];
  createdAt: string; // API: ISO timestamp
  updatedAt?: string; // API: ISO timestamp
  pickedUpAt?: string; // API: ISO timestamp
  // TODO: Add all fields from your actual API response
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  statusCode?: number;
}

// Filter Types for API
export interface OrderFilters {
  status?: OrderStatus | "all";
  search?: string;
  minAmount?: number;
  maxAmount?: number;
  startDate?: string; // ISO date
  endDate?: string; // ISO date
  vendorId?: string;
  customerId?: string;
  // TODO: Add all filter parameters your API supports
}

// UI Filter Options (for the filter components)
export interface FilterOptions {
  searchTerm: string;
  filterStatus: string;
  minAmount: string;
  maxAmount: string;
  startDate: string;
  endDate: string;
  sortBy: string;
  itemsPerPage: number;
  currentPage: number;
}

// Pagination Types
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Statistics Types
export interface OrderStats {
  totalRevenue: number;
  readyForPickup: number;
  pendingPickups: number;
  completedToday: number;
  avgOrderValue: number;
  totalOrders: number;
  // TODO: Add more stats from your API
}

// Export Types
export type ExportFormat = "csv" | "pdf" | "excel" | "json";

// UI Constants (Moved from original file)
export const orderStatusColors: Record<OrderStatus, string> = {
  Completed: "bg-green-100 text-green-700 hover:bg-green-200",
  "Ready for Pickup": "bg-blue-100 text-blue-700 hover:bg-blue-200",
  "Pending Pickup": "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
  Cancelled: "bg-red-100 text-red-700 hover:bg-red-200",
  "In Progress": "bg-purple-100 text-purple-700 hover:bg-purple-200",
};

// ============================================
// UI Constants & Defaults
// ============================================

// Default filter values
export const DEFAULT_FILTER_OPTIONS: FilterOptions = {
  searchTerm: "",
  filterStatus: "all",
  minAmount: "",
  maxAmount: "",
  startDate: "",
  endDate: "",
  sortBy: "dateDesc",
  itemsPerPage: 5,
  currentPage: 1,
};

// Sort options for UI
export const SORT_OPTIONS = [
  { value: "dateDesc", label: "Newest First" },
  { value: "dateAsc", label: "Oldest First" },
  { value: "amountDesc", label: "Highest Price" },
  { value: "amountAsc", label: "Lowest Price" },
  { value: "status", label: "Status" },
] as const;

// Status filter options for UI
export const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "Ready for Pickup", label: "Ready for Pickup" },
  { value: "Pending Pickup", label: "Pending Pickup" },
  { value: "In Progress", label: "In Progress" },
  { value: "Completed", label: "Completed" },
  { value: "Cancelled", label: "Cancelled" },
] as const;

// Items per page options
export const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50] as const;

// For backward compatibility - map old field names to new ones
export const mapToLegacyOrder = (order: Order) => ({
  id: order.id,
  user: order.customerName,
  vendor: order.vendorName,
  items: order.items,
  quantity: order.quantity,
  amount: order.totalAmount,
  pickup: order.pickupTime,
  status: order.status,
  date: order.orderDate,
  address: order.deliveryAddress,
  paymentMethod: order.paymentMethod,
  notes: order.notes,
  customerEmail: order.customerEmail,
  customerPhone: order.customerPhone,
  vendorEmail: order.vendorEmail,
  vendorPhone: order.vendorPhone,
  itemsList: order.itemsList,
  createdAt: order.createdAt,
  pickedUpAt: order.pickedUpAt,
});

// Initial orders (for development/demo)
export const initialOrders: Order[] = [
  {
    id: "#ORD-1247",
    orderNumber: "ORD-1247",
    customerName: "Emma Wilson",
    vendorName: "Green Valley Bakery",
    items: "Bakery Surprise Bag",
    quantity: 1,
    totalAmount: "$4.99",
    amountValue: 4.99,
    pickupTime: "Today, 6:00 PM - 7:00 PM",
    status: "Ready for Pickup",
    orderDate: "2025-10-30",
    deliveryAddress: "123 Valley Road, Suite 101",
    paymentMethod: "Credit Card",
    notes: "Leave at front desk",
    customerEmail: "emma.w@email.com",
    customerPhone: "(555) 123-4567",
    vendorEmail: "bakery@greenvalley.com",
    vendorPhone: "(555) 987-6543",
    itemsList: [
      {
        id: "1",
        name: "Assorted Pastries",
        quantity: 3,
        price: "$2.99",
        priceValue: 2.99,
      },
      {
        id: "2",
        name: "Fresh Bread",
        quantity: 1,
        price: "$2.00",
        priceValue: 2.0,
      },
    ],
    createdAt: "2025-10-30 14:30",
    pickedUpAt: "2025-10-30 18:45",
  },
  // ... Add the rest of your initial orders here
  {
    id: "#ORD-1246",
    orderNumber: "ORD-1246",
    customerName: "John Smith",
    vendorName: "City Cafe",
    items: "Coffee & Pastries",
    quantity: 1,
    totalAmount: "$5.99",
    amountValue: 5.99,
    pickupTime: "Today, 8:00 PM - 9:00 PM",
    status: "Pending Pickup",
    orderDate: "2025-10-30",
    deliveryAddress: "456 Main Street",
    paymentMethod: "Credit Card",
    notes: "",
    customerEmail: "john.smith@email.com",
    customerPhone: "(555) 234-5678",
    vendorEmail: "contact@citycafe.com",
    vendorPhone: "(555) 876-5432",
    itemsList: [
      {
        id: "3",
        name: "Specialty Coffee",
        quantity: 1,
        price: "$3.50",
        priceValue: 3.5,
      },
      {
        id: "4",
        name: "Croissant",
        quantity: 1,
        price: "$2.49",
        priceValue: 2.49,
      },
    ],
    createdAt: "2025-10-30 13:15",
  },
  {
    id: "#ORD-1245",
    orderNumber: "ORD-1245",
    customerName: "Sarah Johnson",
    vendorName: "Fresh Market",
    items: "Produce Box",
    quantity: 1,
    totalAmount: "$7.99",
    amountValue: 7.99,
    pickupTime: "Today, 7:00 PM - 8:00 PM",
    status: "In Progress",
    orderDate: "2025-10-30",
    deliveryAddress: "789 Market Ave, Unit 5",
    paymentMethod: "Debit Card",
    notes: "Ring bell on arrival",
    customerEmail: "sarah.j@email.com",
    customerPhone: "(555) 345-6789",
    vendorEmail: "info@freshmarket.com",
    vendorPhone: "(555) 765-4321",
    itemsList: [
      {
        id: "5",
        name: "Fresh Vegetables",
        quantity: 1,
        price: "$4.50",
        priceValue: 4.5,
      },
      {
        id: "6",
        name: "Seasonal Fruits",
        quantity: 1,
        price: "$3.49",
        priceValue: 3.49,
      },
    ],
    createdAt: "2025-10-30 11:45",
  },
  // Add more orders as needed...
];
