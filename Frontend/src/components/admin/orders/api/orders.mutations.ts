/**
 * ORDERS MUTATION HOOKS - READY FOR API INTEGRATION
 *
 * INSTRUCTIONS FOR AI DEVELOPER:
 *
 * 1. IMPLEMENT ALL MUTATIONS:
 *    - Replace mock mutationFn with actual API calls
 *    - Add optimistic updates for better UX
 *    - Implement proper error handling
 *
 * 2. OPTIMISTIC UPDATES:
 *    - Update cache immediately on mutation
 *    - Rollback on error
 *    - Show loading states
 *
 * 3. ERROR HANDLING:
 *    - Add error toasts/notifications
 *    - Implement retry logic
 *    - Handle validation errors
 *
 * 4. CACHE INVALIDATION:
 *    - Invalidate related queries after mutations
 *    - Update specific cache entries
 */

import {
  useMutation,
  useQueryClient,
  UseMutationOptions,
  QueryFilters,
} from "@tanstack/react-query";
import { ordersApi } from "./orders.api";
import { orderQueryKeys } from "./orders.queries";
import {
  Order,
  OrderStatus,
  ExportFormat,
  OrderFilters,
  ApiResponse,
  ApiError,
  FilterOptions,
  OrderStats,
} from "../types/orders.types";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * MUTATION: Update order status
 * AI: Implement optimistic update for instant feedback
 */
export const useUpdateOrderStatus = (
  options?: UseMutationOptions<
    ApiResponse<Order>,
    Error,
    { orderId: string; status: string }
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Order>,
    Error,
    { orderId: string; status: string }
  >({
    mutationFn: ({ orderId, status }) =>
      ordersApi.updateOrderStatus(orderId, status),

    onSuccess: (data, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.stats() });

      // TODO: Show success toast
      console.log("Order status updated successfully:", variables.orderId);
    },

    ...options,
  });
};

/**
 * MUTATION: Export orders data
 * AI: Implement file download in onSuccess callback
 */
export const useExportOrders = (
  options?: UseMutationOptions<
    Blob,
    Error,
    { format: ExportFormat; filters?: OrderFilters }
  >,
) => {
  return useMutation<
    Blob,
    Error,
    { format: ExportFormat; filters?: OrderFilters }
  >({
    mutationFn: ({ format, filters }) =>
      ordersApi.exportOrders(format, filters),

    onSuccess: (data, variables) => {
      // TODO: Implement file download
      console.log("Export completed:", variables.format);
      // TODO: Show success toast
    },

    onError: (error) => {
      console.error("Export failed:", error);
      // TODO: Show error toast
    },

    ...options,
  });
};

/**
 * MUTATION: Bulk update orders
 * AI: Implement for bulk actions (mark multiple as complete/ready)
 */
export const useBulkUpdateOrders = (
  options?: UseMutationOptions<
    ApiResponse<Order[]>,
    Error,
    { orderIds: string[]; status: OrderStatus }
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Order[]>,
    Error,
    { orderIds: string[]; status: OrderStatus }
  >({
    mutationFn: async ({ orderIds, status }) => {
      // TODO: Implement bulk update API call
      console.log("Bulk update orders:", orderIds, status);
      return {
        success: true,
        data: [],
        timestamp: new Date().toISOString(),
      } as ApiResponse<Order[]>;
    },

    onSuccess: (data, variables) => {
      // Invalidate all order queries
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.all });
      // TODO: Show success toast
    },

    ...options,
  });
};

/**
 * MUTATION: Refresh orders data
 * AI: Manual refresh button functionality
 */
export const useRefreshOrders = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // No API call needed - just invalidate cache
      return Promise.resolve();
    },

    onSuccess: () => {
      // Invalidate all order queries to force refetch
      const filters: QueryFilters = { queryKey: orderQueryKeys.all };
      queryClient.invalidateQueries(filters);
      // TODO: Show refresh toast
    },
  });
};

/**
 * UTILITY: Order mutation helpers
 */
export const useOrderMutations = () => {
  const updateStatus = useUpdateOrderStatus();
  const exportOrders = useExportOrders();
  const bulkUpdate = useBulkUpdateOrders();
  const refresh = useRefreshOrders();

  return {
    markAsCompleted: (orderId: string) =>
      updateStatus.mutate({ orderId, status: "Completed" }),

    markAsReady: (orderId: string) =>
      updateStatus.mutate({ orderId, status: "Ready for Pickup" }),

    markAsInProgress: (orderId: string) =>
      updateStatus.mutate({ orderId, status: "In Progress" }),

    cancelOrder: (orderId: string) =>
      updateStatus.mutate({ orderId, status: "Cancelled" }),

    exportToCSV: (filters?: OrderFilters) =>
      exportOrders.mutate({ format: "csv", filters }),

    exportToPDF: (filters?: OrderFilters) =>
      exportOrders.mutate({ format: "pdf", filters }),

    refreshOrders: () => refresh.mutate(),

    // Mutation states
    isUpdating: updateStatus.isPending,
    isExporting: exportOrders.isPending,
    isRefreshing: refresh.isPending,
  };
};

// ============================================
// UTILITY FUNCTIONS (Non-React-Query)
// ============================================

/**
 * Filter orders based on UI filter options
 */
export const filterOrders = (
  orders: Order[],
  options: Pick<
    FilterOptions,
    | "searchTerm"
    | "filterStatus"
    | "minAmount"
    | "maxAmount"
    | "startDate"
    | "endDate"
  >,
): Order[] => {
  return orders.filter((order) => {
    const searchValue = options.searchTerm.toLowerCase();
    const matchesSearch =
      options.searchTerm === "" ||
      order.orderNumber.toLowerCase().includes(searchValue) ||
      order.customerName.toLowerCase().includes(searchValue) ||
      order.vendorName.toLowerCase().includes(searchValue) ||
      order.items.toLowerCase().includes(searchValue) ||
      order.deliveryAddress.toLowerCase().includes(searchValue);

    const matchesStatus =
      options.filterStatus === "all" || order.status === options.filterStatus;

    const orderPrice = order.amountValue;
    let matchesAmount = true;
    if (options.minAmount)
      matchesAmount = orderPrice >= parseFloat(options.minAmount);
    if (options.maxAmount)
      matchesAmount = orderPrice <= parseFloat(options.maxAmount);

    let matchesDate = true;
    if (options.startDate)
      matchesDate = new Date(order.orderDate) >= new Date(options.startDate);
    if (options.endDate)
      matchesDate = new Date(order.orderDate) <= new Date(options.endDate);

    return matchesSearch && matchesStatus && matchesAmount && matchesDate;
  });
};

/**
 * Sort orders by specified criteria
 */
export const sortOrders = (orders: Order[], sortBy: string): Order[] => {
  return [...orders].sort((a, b) => {
    switch (sortBy) {
      case "dateAsc":
        return (
          new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime()
        );
      case "dateDesc":
        return (
          new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
        );
      case "amountAsc":
        return a.amountValue - b.amountValue;
      case "amountDesc":
        return b.amountValue - a.amountValue;
      case "status":
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });
};

/**
 * Calculate order statistics
 */
export const calculateOrderStats = (orders: Order[]): OrderStats => {
  const totalRevenue = orders.reduce((sum, o) => {
    if (o.status !== "Cancelled") return sum + o.amountValue;
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
      o.orderDate === new Date().toISOString().split("T")[0],
  ).length;

  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

  // Fix: Format to 2 decimal places
  const formattedAvgOrderValue = parseFloat(avgOrderValue.toFixed(2));
  const formattedTotalRevenue = parseFloat(totalRevenue.toFixed(2));

  return {
    totalRevenue: formattedTotalRevenue,
    readyForPickup,
    pendingPickups,
    completedToday,
    avgOrderValue: formattedAvgOrderValue, // Now shows only 2 decimal places
    totalOrders: orders.length,
  };
};

/**
 * Export orders to CSV
 */
export const exportCSV = (orders: Order[]) => {
  const headers = [
    "Order ID",
    "Order Number",
    "Customer",
    "Vendor",
    "Items",
    "Quantity",
    "Amount",
    "Pickup Time",
    "Status",
    "Order Date",
    "Address",
    "Payment Method",
    "Notes",
    "Customer Email",
    "Customer Phone",
    "Vendor Email",
    "Vendor Phone",
    "Created At",
    "Picked Up At",
  ];

  const rows = orders.map((order) => [
    order.id,
    order.orderNumber,
    order.customerName,
    order.vendorName,
    order.items,
    order.quantity,
    order.totalAmount,
    order.pickupTime,
    order.status,
    order.orderDate,
    order.deliveryAddress,
    order.paymentMethod,
    order.notes || "",
    order.customerEmail,
    order.customerPhone,
    order.vendorEmail,
    order.vendorPhone,
    order.createdAt,
    order.pickedUpAt || "N/A",
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, `orders-${new Date().toISOString().split("T")[0]}.csv`);
};

/**
 * Export orders to PDF
 */
export const exportPDF = (orders: Order[], stats: OrderStats) => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(20);
  doc.text("Orders Report", 14, 22);

  // Date
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);

  // Stats
  doc.setFontSize(12);
  doc.text(`Total Orders: ${orders.length}`, 14, 40);
  doc.text(`Total Revenue: $${stats.totalRevenue.toFixed(2)}`, 14, 47);

  // Table
  autoTable(doc, {
    startY: 55,
    head: [["Order ID", "Customer", "Vendor", "Amount", "Status", "Date"]],
    body: orders.map((order) => [
      order.orderNumber,
      order.customerName,
      order.vendorName,
      order.totalAmount,
      order.status,
      order.orderDate,
    ]),
    theme: "grid",
    styles: { fontSize: 8 },
    headStyles: { fillColor: [16, 185, 129] },
  });

  doc.save(`orders-${new Date().toISOString().split("T")[0]}.pdf`);
};

/**
 * Bulk update orders
 */
export const bulkUpdateOrders = (
  orders: Order[],
  orderIds: string[],
  action: "complete" | "cancel" | "ready",
): Order[] => {
  return orders.map((order) => {
    if (!orderIds.includes(order.id)) return order;

    switch (action) {
      case "complete":
        return {
          ...order,
          status: "Completed",
          pickedUpAt: new Date().toLocaleString(),
        };
      case "ready":
        if (
          order.status === "In Progress" ||
          order.status === "Pending Pickup"
        ) {
          return { ...order, status: "Ready for Pickup" };
        }
        return order;
      case "cancel":
        return { ...order, status: "Cancelled" };
      default:
        return order;
    }
  });
};

/**
 * Mark order as picked up
 */
export const markAsPickedUp = (orders: Order[], orderId: string): Order[] => {
  return orders.map((order) => {
    if (order.id === orderId) {
      return {
        ...order,
        status: "Completed" as const,
        pickedUpAt: new Date().toLocaleString(),
      };
    }
    return order;
  });
};

/**
 * Mark order as ready for pickup
 */
export const markAsReady = (orders: Order[], orderId: string): Order[] => {
  return orders.map((order) => {
    if (
      order.id === orderId &&
      (order.status === "In Progress" || order.status === "Pending Pickup")
    ) {
      return {
        ...order,
        status: "Ready for Pickup" as const,
      };
    }
    return order;
  });
};

/**
 * Cancel an order
 */
export const cancelOrder = (orders: Order[], orderId: string): Order[] => {
  return orders.map((order) =>
    order.id === orderId ? { ...order, status: "Cancelled" } : order,
  );
};
