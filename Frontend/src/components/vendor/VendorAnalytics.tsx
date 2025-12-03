import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const monthlyRevenue = [
  { month: 'Jan', revenue: 680 },
  { month: 'Feb', revenue: 720 },
  { month: 'Mar', revenue: 765 },
  { month: 'Apr', revenue: 795 },
  { month: 'May', revenue: 810 },
  { month: 'Jun', revenue: 843 },
];

const categoryBreakdown = [
  { name: 'Surprise Bags', value: 65, color: '#10b981' },
  { name: 'Specific Items', value: 25, color: '#3b82f6' },
  { name: 'Donations', value: 10, color: '#f59e0b' },
];

const peakHours = [
  { hour: '5 PM', orders: 8 },
  { hour: '6 PM', orders: 15 },
  { hour: '7 PM', orders: 22 },
  { hour: '8 PM', orders: 18 },
  { hour: '9 PM', orders: 12 },
];

const topItems = [
  { name: 'Bakery Surprise Bag', sold: 45, revenue: '$224.55' },
  { name: 'Fresh Pastries Box', sold: 38, revenue: '$227.62' },
  { name: 'Dessert Selection', sold: 32, revenue: '$223.68' },
  { name: 'Bread Variety Pack', sold: 28, revenue: '$139.72' },
  { name: 'Cookie Assortment', sold: 13, revenue: '$64.87' },
];

export function VendorAnalytics() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1>Analytics</h1>
        <p className="text-gray-500">Insights into your business performance</p>
      </div>

      {/* Monthly Revenue */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Revenue Trend (Last 6 Months)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} name="Revenue ($)" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Sales by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name} ${entry.value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Peak Hours */}
        <Card>
          <CardHeader>
            <CardTitle>Peak Pickup Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={peakHours}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="#3b82f6" name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Items */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Item Name</th>
                  <th className="text-left py-3 px-4">Units Sold</th>
                  <th className="text-left py-3 px-4">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topItems.map((item, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{item.name}</td>
                    <td className="py-3 px-4">{item.sold}</td>
                    <td className="py-3 px-4">{item.revenue}</td>
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
