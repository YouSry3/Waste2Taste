import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Search, Filter, MapPin, User, Store, DollarSign } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const orders = [
  { id: '#ORD-1247', user: 'Emma Wilson', vendor: 'Green Valley Bakery', items: 'Bakery Surprise Bag', quantity: 1, amount: '$4.99', pickup: '6:00 PM - 7:00 PM', status: 'Completed', date: '2025-10-30', address: '123 Valley Road', paymentMethod: 'Credit Card' },
  { id: '#ORD-1246', user: 'John Smith', vendor: 'City Cafe', items: 'Coffee & Pastries', quantity: 1, amount: '$5.99', pickup: '8:00 PM - 9:00 PM', status: 'Completed', date: '2025-10-30', address: '456 Main Street', paymentMethod: 'Credit Card' },
  { id: '#ORD-1245', user: 'Sarah Johnson', vendor: 'Fresh Market', items: 'Produce Box', quantity: 1, amount: '$7.99', pickup: '7:00 PM - 8:00 PM', status: 'Pending Pickup', date: '2025-10-30', address: '789 Market Ave', paymentMethod: 'Debit Card' },
  { id: '#ORD-1244', user: 'Mike Chen', vendor: 'Downtown Deli', items: 'Sandwich Pack', quantity: 1, amount: '$6.50', pickup: '5:00 PM - 6:00 PM', status: 'Completed', date: '2025-10-29', address: '321 Downtown Blvd', paymentMethod: 'Credit Card' },
  { id: '#ORD-1243', user: 'Lisa Anderson', vendor: 'Organic Bistro', items: 'Meal Box', quantity: 2, amount: '$19.98', pickup: '9:00 PM - 10:00 PM', status: 'Completed', date: '2025-10-29', address: '147 Organic Way', paymentMethod: 'PayPal' },
  { id: '#ORD-1242', user: 'David Lee', vendor: 'Sweet Treats', items: 'Dessert Box', quantity: 1, amount: '$6.99', pickup: '7:30 PM - 8:30 PM', status: 'Pending Pickup', date: '2025-10-30', address: '258 Sweet Lane', paymentMethod: 'Credit Card' },
  { id: '#ORD-1241', user: 'Jessica Brown', vendor: 'Green Valley Bakery', items: 'Bakery Surprise Bag', quantity: 1, amount: '$4.99', pickup: '6:00 PM - 7:00 PM', status: 'Cancelled', date: '2025-10-29', address: '123 Valley Road', paymentMethod: 'Credit Card' },
  { id: '#ORD-1240', user: 'Robert Wilson', vendor: 'City Cafe', items: 'Coffee & Pastries', quantity: 1, amount: '$5.99', pickup: '8:00 PM - 9:00 PM', status: 'Completed', date: '2025-10-28', address: '456 Main Street', paymentMethod: 'Debit Card' },
];

export function OrdersView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('all');

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesDate = filterDate === 'all' || order.date === filterDate;
    return matchesSearch && matchesStatus && matchesDate;
  });

  const totalRevenue = orders.reduce((sum, order) => {
    if (order.status !== 'Cancelled') {
      return sum + parseFloat(order.amount.replace('$', ''));
    }
    return sum;
  }, 0);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1>Orders</h1>
          <p className="text-gray-500">Manage customer orders and transactions</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 mb-1">Total Orders</p>
            <h3>{orders.length}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 mb-1">Pending Pickup</p>
            <h3>{orders.filter(o => o.status === 'Pending Pickup').length}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 mb-1">Completed</p>
            <h3>{orders.filter(o => o.status === 'Completed').length}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
            <h3>${totalRevenue.toFixed(2)}</h3>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending Pickup">Pending Pickup</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterDate} onValueChange={setFilterDate}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="2025-10-30">Oct 30, 2025</SelectItem>
                <SelectItem value="2025-10-29">Oct 29, 2025</SelectItem>
                <SelectItem value="2025-10-28">Oct 28, 2025</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h4>{order.id}</h4>
                    <Badge
                      variant={
                        order.status === 'Completed' ? 'default' :
                        order.status === 'Pending Pickup' ? 'secondary' :
                        'outline'
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">{order.date} • Pickup: {order.pickup}</p>
                </div>
                <div className="text-right">
                  <p className="text-green-600">{order.amount}</p>
                  <p className="text-xs text-gray-500">{order.paymentMethod}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4 pb-4 border-b">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Customer</p>
                    <p className="text-sm">{order.user}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Store className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Vendor</p>
                    <p className="text-sm">{order.vendor}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <MapPin className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Pickup Location</p>
                    <p className="text-sm">{order.address}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Items</p>
                  <p className="text-sm">
                    {order.items} × {order.quantity}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">View Details</Button>
                  {order.status === 'Pending Pickup' && (
                    <Button variant="outline" size="sm">Cancel</Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
