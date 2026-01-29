// src/components/admin/dashboard/components/tables/RecentOrders.tsx
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../../ui/card";
import { Button } from "../../../../ui/button";
import { Badge } from "../../../../ui/badge";
import { useNavigate } from "react-router-dom";
import { RecentOrder } from "../../types";

interface RecentOrdersProps {
  orders: RecentOrder[];
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  const navigate = useNavigate();

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const handleViewAllOrders = () => {
    navigate("/panel/admin/orders");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest marketplace activity</CardDescription>
        </div>
        <Button
          onClick={handleViewAllOrders}
          variant="ghost"
          size="sm"
          className="text-green-600 hover:text-green-700 hover:bg-green-50"
        >
          View all orders
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Order ID
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  User
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Vendor
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Items
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Amount
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Time
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4">{order.id}</td>
                  <td className="py-3 px-4 flex items-center gap-2">
                    <div
                      className={`w-8 h-8 flex items-center justify-center rounded-full ${order.avatarColor} font-bold`}
                    >
                      {getInitials(order.user)}
                    </div>
                    {order.user}
                  </td>
                  <td className="py-3 px-4">{order.vendor}</td>
                  <td className="py-3 px-4">{order.items}</td>
                  <td className="py-3 px-4">{order.amount}</td>
                  <td className="py-3 px-4">
                    <Badge
                      variant={
                        order.status === "completed" ? "success" : "outline"
                      }
                    >
                      {order.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">{order.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
