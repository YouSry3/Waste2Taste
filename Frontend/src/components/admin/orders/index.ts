/**
 * ORDERS COMPONENT BARREL EXPORTS - FIXED
 */

// Main component
export { OrdersView } from "./OrdersView";

// Types
export type {
  Order,
  OrderItem,
  OrderStatus,
  OrderStats,
  FilterOptions,
  OrderFilters,
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
  ExportFormat,
} from "./types/orders.types";

export {
  orderStatusColors,
  initialOrders,
  DEFAULT_FILTER_OPTIONS,
  SORT_OPTIONS,
  STATUS_FILTER_OPTIONS,
  ITEMS_PER_PAGE_OPTIONS,
} from "./types/orders.types";

// Query hooks (React Query)
export {
  useOrders,
  useOrder,
  useOrderStats,
  useVendors,
  useInfiniteOrders,
  orderQueryKeys,
  setupReactQueryInstructions,
} from "./api/orders.queries";

// Mutation hooks (React Query)
export {
  useUpdateOrderStatus,
  useExportOrders,
  useBulkUpdateOrders,
  useRefreshOrders,
  useOrderMutations,
} from "./api/orders.mutations";

// API service
export { ordersApi } from "./api/orders.api";

// Components - FIXED: Use DIFFERENT names for components
export { default as OrderDetailsDialog } from "./components/OrderDetailsDialog";
export { OrderCard } from "./components/OrderCard";
export { OrderFiltersComponent } from "./components/OrderFilters"; // Export as-is
export { OrderStatsComponent } from "./components/OrderStats"; // Export as-is
export { OrderActions } from "./components/OrderActions";
export { default as CustomCheckbox } from "./components/CustomCheckbox";

// Utility functions
export {
  filterOrders,
  sortOrders,
  calculateOrderStats,
  exportCSV,
  exportPDF,
  bulkUpdateOrders,
  markAsPickedUp,
  markAsReady,
  cancelOrder,
} from "./api/orders.mutations";
