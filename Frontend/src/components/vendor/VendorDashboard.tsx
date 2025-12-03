import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Package, DollarSign, ShoppingBag, TrendingUp } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

const statsData = [
  { title: 'Active Listings', value: '12', change: '+2', icon: Package, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  { title: 'Revenue (30d)', value: '$842.50', change: '+18%', icon: DollarSign, color: 'text-green-600', bgColor: 'bg-green-100' },
  { title: 'Orders', value: '156', change: '+12%', icon: ShoppingBag, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  { title: 'Food Saved (lbs)', value: '1,240', change: '+24%', icon: TrendingUp, color: 'text-orange-600', bgColor: 'bg-orange-100' },
];

const weeklyData = [
  { day: 'Mon', sales: 45, items: 8 },
  { day: 'Tue', sales: 52, items: 10 },
  { day: 'Wed', sales: 38, items: 7 },
  { day: 'Thu', sales: 65, items: 12 },
  { day: 'Fri', sales: 78, items: 15 },
  { day: 'Sat', sales: 92, items: 18 },
  { day: 'Sun', sales: 71, items: 14 },
];

const recentOrders = [
  { id: '#ORD-1247', customer: 'Emma Wilson', item: 'Bakery Surprise Bag', amount: '$4.99', status: 'Picked Up', time: '2 hours ago' },
  { id: '#ORD-1246', customer: 'John Smith', item: 'Bakery Surprise Bag', amount: '$4.99', status: 'Picked Up', time: '4 hours ago' },
  { id: '#ORD-1245', customer: 'Sarah Johnson', item: 'Bakery Surprise Bag', amount: '$4.99', status: 'Pending Pickup', time: '30 min ago' },
  { id: '#ORD-1244', customer: 'Mike Chen', item: 'Bakery Surprise Bag', amount: '$4.99', status: 'Picked Up', time: '1 day ago' },
];

export function VendorDashboard() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1>Dashboard</h1>
        <p className="text-gray-500">Welcome back! Here's your business overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <span className="text-sm text-green-600">{stat.change}</span>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                <h3>{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#10b981" name="Sales ($)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Items Sold This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="items" stroke="#3b82f6" strokeWidth={2} name="Items" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Button variant="outline" size="sm">View All</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Order ID</th>
                  <th className="text-left py-3 px-4">Customer</th>
                  <th className="text-left py-3 px-4">Item</th>
                  <th className="text-left py-3 px-4">Amount</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Time</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{order.id}</td>
                    <td className="py-3 px-4">{order.customer}</td>
                    <td className="py-3 px-4">{order.item}</td>
                    <td className="py-3 px-4">{order.amount}</td>
                    <td className="py-3 px-4">
                      <Badge variant={order.status === 'Picked Up' ? 'default' : 'secondary'}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">{order.time}</td>
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
