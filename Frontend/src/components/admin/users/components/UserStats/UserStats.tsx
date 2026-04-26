import { Card, CardContent } from "../../../../../components/ui/card";
import { User } from "../../types";

interface UsersOverview {
  totalUsers: number;
  activeUsers: number;
  totalOrders: number;
  topSpenders: Array<{
    id: string;
    fullName: string;
    initials: string;
    totalSpent: number;
    rank: number;
  }>;
}

interface UserStatsProps {
  users?: User[];
  overview?: UsersOverview;
}

export function UserStats({ users, overview }: UserStatsProps) {
  // Use overview data if available, otherwise calculate from users array
  if (overview) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 mb-1">Total Users</p>
            <h3 className="text-3xl font-bold text-gray-900">{overview.totalUsers}</h3>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 mb-1">Active Users</p>
            <h3 className="text-3xl font-bold text-green-600">
              {overview.activeUsers}
            </h3>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 mb-1">Total Orders</p>
            <h3 className="text-3xl font-bold text-gray-900">{overview.totalOrders}</h3>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
            <h3 className="text-3xl font-bold text-green-600">
              ${overview.topSpenders.reduce((sum, spender) => sum + (spender.totalSpent || 0), 0).toFixed(2)}
            </h3>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fallback: calculate from users array if overview is not available
  if (!users) return null;

  const activeUsers = users.filter((u) => u.isActive);
  const totalRevenue = users.reduce((sum, u) => sum + (u.totalSpent || 0), 0);
  const totalOrders = users.reduce((sum, u) => sum + (u.ordersCount || 0), 0);

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
            ${typeof totalRevenue === 'number' && !isNaN(totalRevenue) ? totalRevenue.toFixed(2) : '0.00'}
          </h3>
        </CardContent>
      </Card>
    </div>
  );
}
