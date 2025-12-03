import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { DollarSign, Users, Store, ShoppingBag, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const statsData = [
  { title: 'Total Revenue', value: '$42,584', change: '+12.5%', icon: DollarSign, color: 'text-green-600', bgColor: 'bg-green-100', isPositive: true },
  { title: 'Active Users', value: '8,342', change: '+8.2%', icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-100', isPositive: true },
  { title: 'Vendors', value: '156', change: '+5.1%', icon: Store, color: 'text-purple-600', bgColor: 'bg-purple-100', isPositive: true },
  { title: 'Orders (30d)', value: '2,847', change: '-2.3%', icon: ShoppingBag, color: 'text-orange-600', bgColor: 'bg-orange-100', isPositive: false },
];

const monthlyData = [
  { month: 'Jan', revenue: 28500, orders: 625 },
  { month: 'Feb', revenue: 32200, orders: 710 },
  { month: 'Mar', revenue: 35800, orders: 790 },
  { month: 'Apr', revenue: 38900, orders: 850 },
  { month: 'May', revenue: 41200, orders: 920 },
  { month: 'Jun', revenue: 42584, orders: 950 },
];

const categoryData = [
  { name: 'Bakery', value: 35, color: '#f59e0b' },
  { name: 'Restaurants', value: 30, color: '#ef4444' },
  { name: 'Grocery', value: 20, color: '#10b981' },
  { name: 'Cafes', value: 10, color: '#3b82f6' },
  { name: 'Other', value: 5, color: '#8b5cf6' },
];

const recentOrders = [
  { id: '#ORD-1247', user: 'Emma Wilson', vendor: 'Green Valley Bakery', items: 'Surprise Bag', amount: '$4.99', status: 'Completed', time: '2 min ago' },
  { id: '#ORD-1246', user: 'John Smith', vendor: 'City Cafe', items: 'Coffee & Pastries', amount: '$5.99', status: 'Completed', time: '15 min ago' },
  { id: '#ORD-1245', user: 'Sarah Johnson', vendor: 'Fresh Market', items: 'Produce Box', amount: '$7.99', status: 'Pending Pickup', time: '32 min ago' },
  { id: '#ORD-1244', user: 'Mike Chen', vendor: 'Downtown Deli', items: 'Sandwich Pack', amount: '$6.50', status: 'Completed', time: '1 hour ago' },
];

export function Dashboard() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1>Dashboard</h1>
        <p className="text-gray-500">Overview of your food rescue marketplace</p>
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
                <div className="flex items-center gap-1">
                  {stat.isPositive ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <span className={`text-sm ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                <h3>{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue & Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} name="Revenue ($)" />
                <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={2} name="Orders" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Listings by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name} ${entry.value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Order ID</th>
                  <th className="text-left py-3 px-4">User</th>
                  <th className="text-left py-3 px-4">Vendor</th>
                  <th className="text-left py-3 px-4">Items</th>
                  <th className="text-left py-3 px-4">Amount</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Time</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{order.id}</td>
                    <td className="py-3 px-4">{order.user}</td>
                    <td className="py-3 px-4">{order.vendor}</td>
                    <td className="py-3 px-4">{order.items}</td>
                    <td className="py-3 px-4">{order.amount}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
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
