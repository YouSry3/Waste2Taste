import React from "react";
import { Card, CardContent } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { Badge } from "../../../ui/badge";
import {
  User,
  Store,
  MapPin,
  MessageSquare,
  CreditCard,
  Calendar,
  Eye,
  CheckCircle,
  Package,
  MoreVertical,
  Printer,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../ui/dropdown-menu";
import { Order, orderStatusColors } from "../types/orders.types";
import CustomCheckbox from "./CustomCheckbox";

interface OrderCardProps {
  order: Order;
  isSelected: boolean;
  onSelect: (orderId: string) => void;
  onView: (order: Order) => void;
  onMarkAsPickedUp: (orderId: string) => void;
  onMarkAsReady: (orderId: string) => void;
  onCancelOrder: (orderId: string) => void;
  onPrintOrder: (order: Order) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  isSelected,
  onSelect,
  onView,
  onMarkAsPickedUp,
  onMarkAsReady,
  onCancelOrder,
  onPrintOrder,
}) => {
  return (
    <Card key={order.id} className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <CustomCheckbox
              id={`checkbox-${order.id}`}
              checked={isSelected}
              onChange={() => onSelect(order.id)}
            />
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h4 className="font-bold text-gray-900">{order.orderNumber}</h4>
                <Badge
                  className={`cursor-pointer ${orderStatusColors[order.status]}`}
                >
                  {order.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-3 w-3" />
                {order.orderDate} • {order.pickupTime}
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-green-600 font-bold text-lg">
              {order.totalAmount}
            </p>
            <div className="flex items-center gap-1 justify-end text-xs text-gray-500">
              <CreditCard className="h-3 w-3" />
              {order.paymentMethod}
            </div>
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
              <p className="text-sm font-medium">{order.customerName}</p>
              <p className="text-xs text-gray-500">{order.customerPhone}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Store className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Vendor</p>
              <p className="text-sm font-medium">{order.vendorName}</p>
              <p className="text-xs text-gray-500">{order.vendorPhone}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <MapPin className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pickup Location</p>
              <p className="text-sm font-medium">{order.deliveryAddress}</p>
              <p className="text-xs text-gray-500">{order.pickupTime}</p>
            </div>
          </div>
        </div>

        {/* Items & Actions */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Items</p>
            <p className="text-sm font-medium">
              {order.items} × {order.quantity}
            </p>
            {order.notes && (
              <div className="flex items-center gap-1 mt-1 text-xs text-gray-600">
                <MessageSquare className="h-3 w-3" />
                {order.notes}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              className="border-green-600 text-green-600 hover:text-green-700 hover:bg-green-100"
              onClick={() => onView(order)}
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>

            {/* Show appropriate action button based on status */}
            {order.status === "Ready for Pickup" && (
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => onMarkAsPickedUp(order.id)}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Mark as Picked Up
              </Button>
            )}
            {(order.status === "In Progress" ||
              order.status === "Pending Pickup") && (
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => onMarkAsReady(order.id)}
              >
                <Package className="h-4 w-4 mr-1" />
                Mark as Ready
              </Button>
            )}

            {/* Only show dropdown for non-completed/cancelled orders */}
            {order.status !== "Completed" && order.status !== "Cancelled" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="hover:bg-gray-100"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white">
                  <DropdownMenuLabel>Order Actions</DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() => {
                      navigator.clipboard.writeText(order.id);
                    }}
                    className="cursor-pointer"
                  >
                    Copy Order ID
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onPrintOrder(order)}
                    className="cursor-pointer"
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    Print Receipt
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />

                  {/* Status-specific actions */}
                  {(order.status === "In Progress" ||
                    order.status === "Pending Pickup") && (
                    <DropdownMenuItem
                      onClick={() => onMarkAsReady(order.id)}
                      className="cursor-pointer [&>*]:text-blue-600"
                    >
                      <Package className="h-4 w-4 mr-2" />
                      Mark as Ready
                    </DropdownMenuItem>
                  )}

                  {order.status === "Ready for Pickup" && (
                    <DropdownMenuItem
                      onClick={() => onMarkAsPickedUp(order.id)}
                      className="cursor-pointer [&>*]:text-green-600"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Picked Up
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onCancelOrder(order.id)}
                    className="cursor-pointer [&>*]:text-red-600"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel Order
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Show print-only dropdown for completed/cancelled orders */}
            {(order.status === "Completed" || order.status === "Cancelled") && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="hover:bg-gray-100"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white">
                  <DropdownMenuLabel>Order Actions</DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() => {
                      navigator.clipboard.writeText(order.id);
                    }}
                    className="cursor-pointer"
                  >
                    Copy Order ID
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onPrintOrder(order)}
                    className="cursor-pointer"
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    Print Receipt
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
