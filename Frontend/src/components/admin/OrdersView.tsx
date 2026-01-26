//missing :  1-make the start/end dates more descreptive 2- fix: mark as picked up
import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Search, MapPin, User, Store, Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

const orders = [
  {
    id: "#ORD-1247",
    user: "Emma Wilson",
    vendor: "Green Valley Bakery",
    items: "Bakery Surprise Bag",
    quantity: 1,
    amount: "$4.99",
    pickup: "6:00 PM - 7:00 PM",
    status: "Completed",
    date: "2025-10-30",
    address: "123 Valley Road",
    paymentMethod: "Credit Card",
    notes: "Leave at front desk",
  },
  {
    id: "#ORD-1246",
    user: "John Smith",
    vendor: "City Cafe",
    items: "Coffee & Pastries",
    quantity: 1,
    amount: "$5.99",
    pickup: "8:00 PM - 9:00 PM",
    status: "Completed",
    date: "2025-10-30",
    address: "456 Main Street",
    paymentMethod: "Credit Card",
    notes: "",
  },
  {
    id: "#ORD-1245",
    user: "Sarah Johnson",
    vendor: "Fresh Market",
    items: "Produce Box",
    quantity: 1,
    amount: "$7.99",
    pickup: "7:00 PM - 8:00 PM",
    status: "Pending Pickup",
    date: "2025-10-30",
    address: "789 Market Ave",
    paymentMethod: "Debit Card",
    notes: "Ring bell on arrival",
  },
  {
    id: "#ORD-1244",
    user: "Mike Chen",
    vendor: "Downtown Deli",
    items: "Sandwich Pack",
    quantity: 1,
    amount: "$6.50",
    pickup: "5:00 PM - 6:00 PM",
    status: "Completed",
    date: "2025-10-29",
    address: "321 Downtown Blvd",
    paymentMethod: "Credit Card",
    notes: "",
  },
  {
    id: "#ORD-1243",
    user: "Lisa Anderson",
    vendor: "Organic Bistro",
    items: "Meal Box",
    quantity: 2,
    amount: "$19.98",
    pickup: "9:00 PM - 10:00 PM",
    status: "Completed",
    date: "2025-10-29",
    address: "147 Organic Way",
    paymentMethod: "PayPal",
    notes: "No onions, please",
  },
];

export function OrdersView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState("dateDesc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const pageSize = 5;

  // Pagination
  const paginate = (items: any[], page: number, size: number) => {
    const start = (page - 1) * size;
    return items.slice(start, start + size);
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const searchValue = searchTerm.toLowerCase();

    let matchesSearch = true;
    if (searchValue) {
      matchesSearch =
        order.id.toLowerCase().includes(searchValue) ||
        order.user.toLowerCase().includes(searchValue) ||
        order.vendor.toLowerCase().includes(searchValue) ||
        order.items.toLowerCase().includes(searchValue) ||
        order.address.toLowerCase().includes(searchValue);
    }

    const matchesStatus =
      filterStatus === "all" ? true : order.status === filterStatus;

    const orderPrice = parseFloat(order.amount.replace("$", ""));
    let matchesAmount = true;
    if (minAmount)
      matchesAmount = matchesAmount && orderPrice >= parseFloat(minAmount);
    if (maxAmount)
      matchesAmount = matchesAmount && orderPrice <= parseFloat(maxAmount);

    let matchesDate = true;
    if (startDate)
      matchesDate = matchesDate && new Date(order.date) >= new Date(startDate);
    if (endDate)
      matchesDate = matchesDate && new Date(order.date) <= new Date(endDate);

    return matchesSearch && matchesStatus && matchesAmount && matchesDate;
  });

  // Sorting
  filteredOrders.sort((a, b) => {
    switch (sortBy) {
      case "dateAsc":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "dateDesc":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "amountAsc":
        return (
          parseFloat(a.amount.replace("$", "")) -
          parseFloat(b.amount.replace("$", ""))
        );
      case "amountDesc":
        return (
          parseFloat(b.amount.replace("$", "")) -
          parseFloat(a.amount.replace("$", ""))
        );
      case "status":
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const pagedOrders = paginate(filteredOrders, currentPage, pageSize);

  const totalRevenue = orders.reduce((sum, o) => {
    if (o.status !== "Cancelled")
      return sum + parseFloat(o.amount.replace("$", ""));
    return sum;
  }, 0);

  // Export CSV
  const exportCSV = () => {
    const headers = [
      "Order ID",
      "Customer",
      "Vendor",
      "Items",
      "Qty",
      "Price",
      "Pickup Time",
      "Status",
      "Date",
      "Address",
      "Payment",
      "Notes",
    ];
    const rows = filteredOrders.map((o) => [
      o.id,
      o.user,
      o.vendor,
      o.items,
      o.quantity,
      o.amount,
      o.pickup,
      o.status,
      o.date,
      o.address,
      o.paymentMethod,
      o.notes,
    ]);
    const csvContent = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "orders.csv");
  };

  // Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [
        [
          "ID",
          "Customer",
          "Vendor",
          "Items",
          "Qty",
          "Price",
          "Pickup",
          "Status",
          "Date",
        ],
      ],
      body: filteredOrders.map((o) => [
        o.id,
        o.user,
        o.vendor,
        o.items,
        o.quantity,
        o.amount,
        o.pickup,
        o.status,
        o.date,
      ]),
    });
    doc.save("orders.pdf");
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-gray-500">
            Manage customer orders and transactions
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportCSV}>Export CSV</Button>
          <Button onClick={exportPDF}>Export PDF</Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="flex flex-wrap items-center gap-4 p-4">
          {/* Search */}
          <div className="flex-1 relative min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10"
            />
          </div>

          {/* Status */}
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full md:w-48 h-10">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Pending Pickup">Pending Pickup</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          {/* Price */}
          <Input
            type="number"
            placeholder="Min Price"
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
            className="w-28 h-10"
          />
          <Input
            type="number"
            placeholder="Max Price"
            value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)}
            className="w-28 h-10"
          />

          {/* Dates */}
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-36 h-10"
          />
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-36 h-10"
          />

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48 h-10">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dateAsc">Date ↑</SelectItem>
              <SelectItem value="dateDesc">Date ↓</SelectItem>
              <SelectItem value="amountAsc">Price ↑</SelectItem>
              <SelectItem value="amountDesc">Price ↓</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {pagedOrders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-gray-500">
              No orders found matching your criteria.
            </CardContent>
          </Card>
        ) : (
          pagedOrders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-bold">{order.id}</h4>
                      <Badge
                        variant={
                          order.status === "Completed"
                            ? "default"
                            : order.status === "Pending Pickup"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                      {order.date} • Pickup: {order.pickup}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-600 font-bold">{order.amount}</p>
                    <p className="text-xs text-gray-500">
                      {order.paymentMethod}
                    </p>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4 pb-4 border-b">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Customer</p>
                      <p className="text-sm">{order.user}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Store className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Vendor</p>
                      <p className="text-sm">{order.vendor}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <MapPin className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Pickup Location</p>
                      <p className="text-sm">{order.address}</p>
                    </div>
                  </div>
                </div>

                {/* Items & Actions */}
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm text-gray-500">Items</p>
                    <p className="text-sm">
                      {order.items} × {order.quantity}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedOrder(order)}
                    >
                      View Details
                    </Button>
                    {order.status === "Pending Pickup" && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => (order.status = "Completed")}
                      >
                        Mark as Picked Up
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            size="sm"
            variant={page === currentPage ? "default" : "outline"}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </Button>
        ))}
      </div>

      {/* Total Revenue */}
      <p className="text-right mt-4 text-gray-700 font-semibold">
        Total Revenue: ${totalRevenue.toFixed(2)}
      </p>

      {/* Modal */}
      {/* Modal */}
      {selectedOrder && (
        <Dialog
          open={!!selectedOrder}
          onOpenChange={() => setSelectedOrder(null)}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>View Order</DialogTitle>
            </DialogHeader>

            <Card className="mt-2">
              <CardContent className="flex flex-col gap-2">
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                  <Badge
                    variant={
                      selectedOrder.status === "Completed"
                        ? "default"
                        : selectedOrder.status === "Pending Pickup"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {selectedOrder.status}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {selectedOrder.date}
                  </span>
                </div>

                {/* Order ID & Customer */}
                <h4 className="text-lg font-semibold">{selectedOrder.id}</h4>
                <p className="text-sm text-gray-600">{selectedOrder.user}</p>
                <hr className="border-gray-200 my-1" />

                {/* Vendor */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Store className="h-4 w-4" />
                  {selectedOrder.vendor}
                </div>
                <hr className="border-gray-200 my-1" />

                {/* Items & Quantity */}
                <p className="text-sm text-gray-600">
                  Items: {selectedOrder.items} × {selectedOrder.quantity}
                </p>
                <hr className="border-gray-200 my-1" />

                {/* Pickup */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  {selectedOrder.address}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  Pickup: {selectedOrder.pickup}
                </div>
                <hr className="border-gray-200 my-1" />

                {/* Amount & Payment */}
                <p className="text-sm text-gray-500">
                  Price: {selectedOrder.amount}
                </p>
                <p className="text-sm text-gray-500">
                  Payment: {selectedOrder.paymentMethod}
                </p>
                <hr className="border-gray-200 my-1" />

                {/* Notes */}
                {selectedOrder.notes && (
                  <p className="text-sm text-gray-600">{selectedOrder.notes}</p>
                )}

                <Button
                  className="mt-4 bg-green-600 hover:bg-green-700"
                  onClick={() => setSelectedOrder(null)}
                >
                  Close
                </Button>
              </CardContent>
            </Card>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
