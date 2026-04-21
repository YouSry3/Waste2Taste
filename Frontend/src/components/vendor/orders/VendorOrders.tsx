import { useEffect, useMemo, useState } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { OrderActions } from "./components/OrderActions";
import { OrderStatsComponent } from "./components/OrderStats";
import { OrderFiltersComponent } from "./components/OrderFilters";
import { OrderCard } from "./components/OrderCard";
import OrderDetailsDialog from "./components/OrderDetailsDialog";
import BulkOrderActions from "./components/BulkOrderActions";
import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { Skeleton } from "../../ui/skeleton";

import {
  DEFAULT_FILTER_OPTIONS,
  type FilterOptions,
  type Order,
  type OrderStats,
} from "./types/orders.types";

import {
  filterOrders,
  sortOrders,
  calculateOrderStats,
  exportCSV,
  exportPDF,
  markAsPickedUp,
  markAsReady,
  cancelOrder,
} from ".";
import { useVendorOrdersDashboard } from "../../../hooks/useVendorOrders";

/* -------------------- Print Order -------------------- */
const printOrder = (order: Order) => {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  printWindow.document.write(`
    <html>
      <head>
        <title>Order ${order.orderNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .section { margin-bottom: 20px; }
          .label { font-weight: bold; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Order Receipt</h1>
          <h2>${order.orderNumber}</h2>
        </div>

        <div class="section">
          <div class="label">Customer:</div>
          ${order.customerName}
        </div>

        <div class="section">
          <div class="label">Total:</div>
          ${order.totalAmount}
        </div>
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.print();
};

const EMPTY_STATS: OrderStats = {
  totalRevenue: 0,
  readyForPickup: 0,
  pendingPickups: 0,
  completedToday: 0,
  avgOrderValue: 0,
  totalOrders: 0,
};

function OrdersSkeleton() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <Skeleton className="h-14 w-full mb-6 rounded-xl" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-28 w-full rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-40 w-full rounded-xl mb-6" />
      <Skeleton className="h-24 w-full rounded-xl mb-6" />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-48 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}

function OrdersErrorState({
  error,
  onRetry,
}: {
  error: unknown;
  onRetry: () => void;
}) {
  const details = (() => {
    const e = error as Record<string, unknown> | null;
    const response = (e?.response as Record<string, unknown> | undefined) ?? {};
    const responseData =
      (response.data as Record<string, unknown> | undefined) ?? {};

    return {
      status:
        (e?.statusCode as number | undefined) ??
        (response.status as number | undefined),
      message:
        (responseData.message as string | undefined) ??
        (responseData.title as string | undefined) ??
        (e?.message as string | undefined) ??
        "Unable to load vendor orders.",
    };
  })();

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <Card className="border-red-200 bg-red-50">
        <CardContent className="py-8 flex flex-col items-center gap-3 text-center">
          <AlertCircle className="h-8 w-8 text-red-600" />
          <p className="font-semibold text-red-800">Could not load orders.</p>
          <p className="text-sm text-red-700">
            Please retry or check that your vendor session is still valid.
          </p>
          <p className="text-xs text-red-800">
            {details.status ? `Status ${details.status}: ` : ""}
            {details.message}
          </p>
          <Button
            onClick={onRetry}
            variant="outline"
            className="border-red-300"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function OrdersEmptyState({
  hasActiveFilters,
  onResetFilters,
}: {
  hasActiveFilters: boolean;
  onResetFilters: () => void;
}) {
  return (
    <Card className="border-dashed border-gray-200 bg-white">
      <CardContent className="py-14 flex flex-col items-center gap-3 text-center">
        <div className="rounded-full bg-green-50 p-4 text-green-600">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          {hasActiveFilters
            ? "No orders match your filters"
            : "No vendor orders yet"}
        </h3>
        <p className="max-w-md text-sm text-gray-500">
          {hasActiveFilters
            ? "Try clearing the filters to view the live orders returned by the backend."
            : "The live dashboard endpoint returned no vendor orders at the moment."}
        </p>
        {hasActiveFilters && (
          <Button onClick={onResetFilters} variant="outline">
            Reset filters
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

/* -------------------- Component -------------------- */
export function VendorOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats>(EMPTY_STATS);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const [filterOptions, setFilterOptions] =
    useState<FilterOptions>(DEFAULT_FILTER_OPTIONS);

  const {
    data: dashboardData,
    isLoading,
    isError,
    error,
    refetch,
  } = useVendorOrdersDashboard();

  useEffect(() => {
    if (!dashboardData) return;

    setOrders(dashboardData.orders);
    setStats(dashboardData.stats);
    setSelectedOrders([]);
    setSelectedOrder(null);
    setIsViewDialogOpen(false);
  }, [dashboardData]);

  /* -------------------- Data -------------------- */
  const filteredOrders = useMemo(
    () => filterOrders(orders, filterOptions),
    [orders, filterOptions],
  );

  const sortedOrders = useMemo(
    () => sortOrders(filteredOrders, filterOptions.sortBy),
    [filteredOrders, filterOptions.sortBy],
  );

  /* -------------------- Pagination -------------------- */
  const totalPages = Math.ceil(sortedOrders.length / filterOptions.itemsPerPage);

  const startIndex =
    (filterOptions.currentPage - 1) * filterOptions.itemsPerPage;

  const pagedOrders = sortedOrders.slice(
    startIndex,
    startIndex + filterOptions.itemsPerPage,
  );

  const hasActiveFilters = useMemo(
    () =>
      Boolean(
        filterOptions.searchTerm ||
          filterOptions.filterStatus !== "all" ||
          filterOptions.minAmount ||
          filterOptions.maxAmount ||
          filterOptions.startDate ||
          filterOptions.endDate,
      ),
    [filterOptions],
  );

  /* -------------------- Handlers -------------------- */
  const handleFilterChange = (updates: Partial<FilterOptions>) => {
    setFilterOptions((prev) => {
      const next = { ...prev, ...updates };
      const hasPageUpdate = Object.prototype.hasOwnProperty.call(
        updates,
        "currentPage",
      );
      const hasItemsPerPageUpdate = Object.prototype.hasOwnProperty.call(
        updates,
        "itemsPerPage",
      );

      if (!hasPageUpdate && !hasItemsPerPageUpdate) {
        next.currentPage = 1;
      }

      return next;
    });
  };

  const applyOrdersUpdate = (nextOrders: Order[]) => {
    setOrders(nextOrders);
    setStats(calculateOrderStats(nextOrders));
    setSelectedOrders((prev) =>
      prev.filter((id) => nextOrders.some((order) => order.id === id)),
    );
    setSelectedOrder((current) =>
      current
        ? nextOrders.find((order) => order.id === current.id) ?? null
        : current,
    );
  };

  const handleExportCSV = () => exportCSV(filteredOrders);
  const handleExportPDF = () => exportPDF(filteredOrders, stats);

  const handleBulkAction = (action: "complete" | "cancel" | "print" | "ready") => {
    const selectedSet = new Set(selectedOrders);

    if (action === "print") {
      orders.forEach((order) => {
        if (selectedSet.has(order.id)) {
          printOrder(order);
        }
      });
      setSelectedOrders([]);
      return;
    }

    const nextOrders = orders.map((order) => {
      if (!selectedSet.has(order.id)) return order;

      switch (action) {
        case "complete":
          return { ...order, status: "Completed" };
        case "ready":
          return { ...order, status: "Ready for Pickup" };
        case "cancel":
          return { ...order, status: "Cancelled" };
        default:
          return order;
      }
    });

    applyOrdersUpdate(nextOrders);
    setSelectedOrders([]);
  };

  /* ---------- Select All (PER PAGE, SAFE) ---------- */
  const handleSelectAll = () => {
    const allPageSelected = pagedOrders.every((o) =>
      selectedOrders.includes(o.id),
    );

    if (allPageSelected) {
      setSelectedOrders((prev) =>
        prev.filter((id) => !pagedOrders.some((o) => o.id === id)),
      );
    } else {
      setSelectedOrders((prev) => [
        ...new Set([...prev, ...pagedOrders.map((o) => o.id)]),
      ]);
    }
  };

  /* -------------------- Bulk Updates -------------------- */
  const bulkUpdateStatus = (
    status: "Ready for Pickup" | "Completed" | "Cancelled",
  ) => {
    const selectedSet = new Set(selectedOrders);
    const nextOrders = orders.map((order) =>
      selectedSet.has(order.id) ? { ...order, status } : order,
    );

    applyOrdersUpdate(nextOrders);
    setSelectedOrders([]);
  };

  if (isLoading && !dashboardData) {
    return <OrdersSkeleton />;
  }

  if (isError && !dashboardData) {
    return <OrdersErrorState error={error} onRetry={() => refetch()} />;
  }

  /* -------------------- Render -------------------- */
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <OrderActions
        onExportCSV={handleExportCSV}
        onExportPDF={handleExportPDF}
        totalOrders={sortedOrders.length}
        itemsPerPage={filterOptions.itemsPerPage}
        onItemsPerPageChange={(value) =>
          handleFilterChange({ itemsPerPage: value, currentPage: 1 })
        }
        currentPage={filterOptions.currentPage}
        totalPages={totalPages}
        onPageChange={(page) => handleFilterChange({ currentPage: page })}
      />

      <OrderStatsComponent stats={stats} />

      <OrderFiltersComponent
        filters={filterOptions}
        onFilterChange={handleFilterChange}
        selectedOrdersCount={selectedOrders.length}
        onBulkAction={handleBulkAction}
        onClearSelection={() => setSelectedOrders([])}
      />

      {/* 🔥 BULK ACTIONS */}
      <BulkOrderActions
        visibleOrders={pagedOrders}
        selectedOrderIds={selectedOrders}
        onSelectAll={handleSelectAll}
        onClearSelection={() => setSelectedOrders([])}
        onBulkReady={() => bulkUpdateStatus("Ready for Pickup")}
        onBulkPickedUp={() => bulkUpdateStatus("Completed")}
        onBulkCancel={() => bulkUpdateStatus("Cancelled")}
      />

      {pagedOrders.length === 0 ? (
        <OrdersEmptyState
          hasActiveFilters={hasActiveFilters}
          onResetFilters={() => setFilterOptions(DEFAULT_FILTER_OPTIONS)}
        />
      ) : (
        <div className="space-y-4">
          {pagedOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              isSelected={selectedOrders.includes(order.id)}
              onSelect={(id) =>
                setSelectedOrders((prev) =>
                  prev.includes(id)
                    ? prev.filter((x) => x !== id)
                    : [...prev, id],
                )
              }
              onView={(order) => {
                setSelectedOrder(order);
                setIsViewDialogOpen(true);
              }}
              onMarkAsPickedUp={(id) =>
                applyOrdersUpdate(markAsPickedUp(orders, id))
              }
              onMarkAsReady={(id) =>
                applyOrdersUpdate(markAsReady(orders, id))
              }
              onCancelOrder={(id) => applyOrdersUpdate(cancelOrder(orders, id))}
              onPrintOrder={printOrder}
            />
          ))}
        </div>
      )}

      <OrderDetailsDialog
        order={selectedOrder}
        isOpen={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
        onMarkAsPickedUp={(id) => {
          applyOrdersUpdate(markAsPickedUp(orders, id));
          setIsViewDialogOpen(false);
        }}
        onMarkAsReady={(id) => {
          applyOrdersUpdate(markAsReady(orders, id));
          setIsViewDialogOpen(false);
        }}
      />
    </div>
  );
}
