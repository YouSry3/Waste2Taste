import { Card, CardContent } from "../../../../../components/ui/card";
import { User } from "../../types";

interface UserStatsProps {
  users: User[];
}

export function UserStats({ users }: UserStatsProps) {
  const activeUsers = users.filter((u) => u.status === "Active");
  const totalRevenue = users.reduce(
    (sum, u) => sum + parseFloat(u.totalSpent.replace("$", "")),
    0,
  );
  const totalOrders = users.reduce((sum, u) => sum + u.orders, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <p className="text-sm text-gray-500 mb-1">Total Users</p>
          <h3 className="text-3xl font-bold text-gray-900">{users.length}</h3>
        </CardContent>
      </Card>
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <p className="text-sm text-gray-500 mb-1">Active Users</p>
          <h3 className="text-3xl font-bold text-green-600">
            {activeUsers.length}
          </h3>
        </CardContent>
      </Card>
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <p className="text-sm text-gray-500 mb-1">Total Orders</p>
          <h3 className="text-3xl font-bold text-gray-900">{totalOrders}</h3>
        </CardContent>
      </Card>
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
          <h3 className="text-3xl font-bold text-green-600">
            ${totalRevenue.toFixed(2)}
          </h3>
        </CardContent>
      </Card>
    </div>
  );
}
