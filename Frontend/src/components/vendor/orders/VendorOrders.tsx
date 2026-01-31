import { useState, useMemo } from "react";
import { OrderActions } from "./components/OrderActions";
import { OrderStatsComponent } from "./components/OrderStats";
import { OrderFiltersComponent } from "./components/OrderFilters";
import { OrderCard } from "./components/OrderCard";
import OrderDetailsDialog from "./components/OrderDetailsDialog";
import BulkOrderActions from "./components/BulkOrderActions";

import {
  filterOrders,
  sortOrders,
  calculateOrderStats,
  exportCSV,
  exportPDF,
  markAsPickedUp,
  markAsReady,
  cancelOrder,
  initialOrders,
} from ".";
import type { Order } from "./types/orders.types";

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

/* -------------------- Component -------------------- */
export function VendorOrders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const [filterOptions, setFilterOptions] = useState({
    searchTerm: "",
    filterStatus: "all",
    minAmount: "",
    maxAmount: "",
    startDate: "",
    endDate: "",
    sortBy: "dateDesc",
    itemsPerPage: 5,
    currentPage: 1,
  });

  /* -------------------- Data -------------------- */
  const filteredOrders = useMemo(
    () => filterOrders(orders, filterOptions),
    [orders, filterOptions],
  );

  const sortedOrders = useMemo(
    () => sortOrders(filteredOrders, filterOptions.sortBy),
    [filteredOrders, filterOptions.sortBy],
  );

  const stats = useMemo(() => calculateOrderStats(orders), [orders]);

  /* -------------------- Pagination -------------------- */
  const totalPages = Math.ceil(
    sortedOrders.length / filterOptions.itemsPerPage,
  );

  const startIndex =
    (filterOptions.currentPage - 1) * filterOptions.itemsPerPage;

  const pagedOrders = sortedOrders.slice(
    startIndex,
    startIndex + filterOptions.itemsPerPage,
  );

  /* -------------------- Handlers -------------------- */
  const handleFilterChange = (updates: Partial<typeof filterOptions>) => {
    setFilterOptions((prev) => ({ ...prev, ...updates }));
  };

  const handleExportCSV = () => exportCSV(filteredOrders);
  const handleExportPDF = () => exportPDF(filteredOrders, stats);

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
    setOrders((prev) =>
      prev.map((order) =>
        selectedOrders.includes(order.id) ? { ...order, status } : order,
      ),
    );
    setSelectedOrders([]);
  };

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


      {/* Orders */}
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
            onMarkAsPickedUp={(id) => setOrders(markAsPickedUp(orders, id))}
            onMarkAsReady={(id) => setOrders(markAsReady(orders, id))}
            onCancelOrder={(id) => setOrders(cancelOrder(orders, id))}
            onPrintOrder={printOrder}
          />
        ))}
      </div>

      <OrderDetailsDialog
        order={selectedOrder}
        isOpen={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
        onMarkAsPickedUp={(id) => {
          setOrders(markAsPickedUp(orders, id));
          setIsViewDialogOpen(false);
        }}
        onMarkAsReady={(id) => {
          setOrders(markAsReady(orders, id));
          setIsViewDialogOpen(false);
        }}
      />
    </div>
  );
}
