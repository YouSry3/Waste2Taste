import { CheckCircle, Eye, MoreVertical, Package, Printer, X } from "lucide-react";
import { Badge } from "../../../ui/badge";
import { Button } from "../../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../ui/dropdown-menu";
import { VendorOrder } from "../../types";

interface RecentOrdersTableProps {
  orders: VendorOrder[];
  onViewAllOrders: () => void;
  onViewOrderDetails: (order: VendorOrder) => void;
  onMarkAsPickedUp: (orderId: string) => void;
  onMarkAsReady: (orderId: string) => void;
  onCancelOrder: (orderId: string) => void;
  onPrintOrder: (order: VendorOrder) => void;
  onCopyOrderId: (orderId: string) => void;
  getInitials: (name: string) => string;
  getStatusColor: (status: VendorOrder["status"]) => string;
}

export function RecentOrdersTable({
  orders,
  onViewAllOrders,
  onViewOrderDetails,
  onMarkAsPickedUp,
  onMarkAsReady,
  onCancelOrder,
  onPrintOrder,
  onCopyOrderId,
  getInitials,
  getStatusColor,
}: RecentOrdersTableProps) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Orders</CardTitle>
          <p className="text-sm text-gray-500 mt-1">Latest order activity</p>
        </div>
        <Button
          onClick={onViewAllOrders}
          variant="ghost"
          size="sm"
          className="text-green-600 hover:text-green-700 hover:bg-green-50"
        >
          View all orders
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                  Order ID
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                  Customer
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                  Item
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                  Amount
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                  Pickup Time
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                  Status
                </th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm w-[300px]">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500">
                    No recent orders
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4 font-medium text-sm whitespace-nowrap">
                      {order.id}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-8 h-8 flex items-center justify-center rounded-full ${
                            order.avatarColor ??
                            "bg-gradient-to-br from-purple-400 to-blue-500"
                          } text-white font-bold text-xs`}
                        >
                          {getInitials(order.customer)}
                        </div>
                        <span className="text-sm whitespace-nowrap">
                          {order.customer}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-sm whitespace-nowrap">
                      {order.item}
                    </td>

                    <td className="py-3 px-4 font-medium text-sm whitespace-nowrap">
                      {order.amount}
                    </td>

                    <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap">
                      {order.timeSlot}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <Badge
                        variant="outline"
                        className={getStatusColor(order.status)}
                      >
                        {order.status}
                      </Badge>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex justify-end items-center gap-2 whitespace-nowrap">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onViewOrderDetails(order)}
                          className="border-blue-300 text-blue-700 hover:bg-blue-50"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>

                        {order.status === "Ready for Pickup" && (
                          <Button
                            size="sm"
                            className="w-[120px] justify-center bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => onMarkAsPickedUp(order.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Picked Up
                          </Button>
                        )}

                        {(order.status === "In Progress" ||
                          order.status === "Pending Pickup") && (
                          <Button
                            size="sm"
                            className="w-[120px] justify-center bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => onMarkAsReady(order.id)}
                          >
                            <Package className="h-4 w-4 mr-1" />
                            Mark Ready
                          </Button>
                        )}

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="outline">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent
                            align="end"
                            className="w-48 bg-white"
                          >
                            <DropdownMenuLabel>
                              Order Actions
                            </DropdownMenuLabel>

                            <DropdownMenuItem
                              onClick={() => onCopyOrderId(order.id)}
                            >
                              Copy Order ID
                            </DropdownMenuItem>

                            <DropdownMenuItem onClick={() => onPrintOrder(order)}>
                              <Printer className="h-4 w-4 mr-2" />
                              Print Receipt
                            </DropdownMenuItem>

                            {order.status !== "Picked Up" &&
                              order.status !== "Cancelled" && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => onCancelOrder(order.id)}
                                    className="text-red-600"
                                  >
                                    <X className="h-4 w-4 mr-2" />
                                    Cancel Order
                                  </DropdownMenuItem>
                                </>
                              )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
