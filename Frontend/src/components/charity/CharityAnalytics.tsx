import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const monthlyData = [
  { month: 'Jan', approved: 18, items: 420 },
  { month: 'Feb', approved: 22, items: 485 },
  { month: 'Mar', approved: 19, items: 520 },
  { month: 'Apr', approved: 24, items: 548 },
  { month: 'May', approved: 21, items: 592 },
  { month: 'Jun', approved: 28, items: 615 },
];

const distributionData = [
  { category: 'Bakery', items: 245 },
  { category: 'Produce', items: 189 },
  { category: 'Prepared Meals', items: 156 },
  { category: 'Dairy', items: 98 },
  { category: 'Other', items: 67 },
];

const impactStats = [
  { metric: 'Total People Helped', value: '1,247', change: '+15.3%' },
  { metric: 'Items Distributed', value: '3,658', change: '+22.8%' },
  { metric: 'Vendors Partnered', value: '12', change: '+3' },
  { metric: 'Verification Accuracy', value: '96.4%', change: '+1.2%' },
];

export function CharityAnalytics() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1>Analytics</h1>
        <p className="text-gray-500">Track your impact and program effectiveness</p>
      </div>

      {/* Impact Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {impactStats.map((stat) => (
          <Card key={stat.metric}>
            <CardContent className="p-6">
              <p className="text-sm text-gray-500 mb-1">{stat.metric}</p>
              <div className="flex items-end justify-between">
                <h3>{stat.value}</h3>
                <span className="text-sm text-green-600">{stat.change}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Approvals & Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="approved" stroke="#3b82f6" strokeWidth={2} name="Approvals" />
                <Line type="monotone" dataKey="items" stroke="#10b981" strokeWidth={2} name="Items Distributed" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribution by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={distributionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="items" fill="#10b981" name="Items Distributed" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Impact Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
        <CardContent className="p-6">
          <h3 className="mb-4">Program Impact Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-2">Food Waste Prevented</p>
              <p className="text-2xl">2,840 lbs</p>
              <p className="text-xs text-gray-500 mt-1">Equivalent to 9,467 meals</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Average Response Time</p>
              <p className="text-2xl">2.3 hours</p>
              <p className="text-xs text-gray-500 mt-1">For verification requests</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">User Satisfaction</p>
              <p className="text-2xl">4.8/5.0</p>
              <p className="text-xs text-gray-500 mt-1">Based on 324 responses</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
