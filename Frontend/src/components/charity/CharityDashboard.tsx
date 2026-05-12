import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { UserCheck, Users, Package, Heart } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

const statsData = [
  { title: 'Pending Requests', value: '8', icon: UserCheck, color: 'text-orange-600', bgColor: 'bg-orange-100' },
  { title: 'Approved Users', value: '142', icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  { title: 'Active Listings', value: '6', icon: Package, color: 'text-green-600', bgColor: 'bg-green-100' },
  { title: 'People Helped (30d)', value: '324', icon: Heart, color: 'text-pink-600', bgColor: 'bg-pink-100' },
];

const monthlyData = [
  { month: 'Jan', users: 95, items: 420 },
  { month: 'Feb', users: 108, items: 485 },
  { month: 'Mar', users: 118, items: 520 },
  { month: 'Apr', users: 125, items: 548 },
  { month: 'May', users: 135, items: 592 },
  { month: 'Jun', users: 142, items: 615 },
];

const recentVerifications = [
  { id: 1, name: 'Ahmed Hassan', status: 'Pending', submitted: '2025-10-29', reason: 'Financial Hardship' },
  { id: 2, name: 'Fatima Ali', status: 'Pending', submitted: '2025-10-29', reason: 'Unemployed' },
  { id: 3, name: 'Omar Saeed', status: 'Approved', submitted: '2025-10-28', reason: 'Low Income' },
  { id: 4, name: 'Layla Ibrahim', status: 'Pending', submitted: '2025-10-28', reason: 'Student' },
];

export function CharityDashboard() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-500">Manage assisted user verifications and free food distribution</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {statsData.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                <div className={`p-2 sm:p-3 rounded-lg ${stat.bgColor} flex-shrink-0`}>
                  <stat.icon className={`h-5 sm:h-6 w-5 sm:w-6 ${stat.color}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-500 mb-1">{stat.title}</p>
                  <h3 className="text-lg sm:text-2xl font-bold">{stat.value}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart */}
      <Card className="mb-6 sm:mb-8">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Growth Overview</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="w-full h-64 sm:h-80 lg:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} name="Approved Users" />
                <Line type="monotone" dataKey="items" stroke="#10b981" strokeWidth={2} name="Items Distributed" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Verifications */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle className="text-lg sm:text-xl">Recent Verification Requests</CardTitle>
            <Button variant="outline" size="sm" className="text-xs sm:text-sm">View All</Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold">Name</th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold hidden sm:table-cell">Reason</th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold hidden md:table-cell">Submitted</th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold">Status</th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentVerifications.map((request) => (
                  <tr key={request.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-2 sm:px-4 text-xs sm:text-sm">{request.name}</td>
                    <td className="py-3 px-4">{request.reason}</td>
                    <td className="py-3 px-4">{request.submitted}</td>
                    <td className="py-3 px-4">
                      <Badge variant={request.status === 'Approved' ? 'default' : 'secondary'}>
                        {request.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      {request.status === 'Pending' && (
                        <Button variant="outline" size="sm">Review</Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
