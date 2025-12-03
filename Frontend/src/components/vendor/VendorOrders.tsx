import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Search, Eye } from 'lucide-react';

const orders = [
  {
    id: 'ORD-001',
    customer: 'Ahmed Hassan',
    listing: 'Fresh Croissants Pack',
    amount: 'EGP 45',
    status: 'Completed',
    date: '2025-11-22 14:30',
  },
  {
    id: 'ORD-002',
    customer: 'Sara Mohamed',
    listing: 'Mixed Pastries Box',
    amount: 'EGP 60',
    status: 'Pending',
    date: '2025-11-22 13:15',
  },
  {
    id: 'ORD-003',
    customer: 'Khaled Ali',
    listing: 'Bread Assortment',
    amount: 'EGP 30',
    status: 'Completed',
    date: '2025-11-22 12:45',
  },
  {
    id: 'ORD-004',
    customer: 'Layla Ibrahim',
    listing: 'Fresh Croissants Pack',
    amount: 'EGP 45',
    status: 'Ready for Pickup',
    date: '2025-11-22 11:20',
  },
  {
    id: 'ORD-005',
    customer: 'Omar Youssef',
    listing: 'Cake Slices Pack',
    amount: 'EGP 50',
    status: 'Cancelled',
    date: '2025-11-22 10:10',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Completed':
      return 'bg-green-100 text-green-800';
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'Ready for Pickup':
      return 'bg-blue-100 text-blue-800';
    case 'Cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export function VendorOrders() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1>Orders</h1>
        <p className="text-gray-600">Manage and process orders for your branch</p>
      </div>

      <Card className="p-6">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by order ID, customer, or listing..."
              className="pl-10"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Order ID</th>
                <th className="text-left py-3 px-4">Customer</th>
                <th className="text-left py-3 px-4">Listing</th>
                <th className="text-left py-3 px-4">Amount</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{order.id}</td>
                  <td className="py-3 px-4">{order.customer}</td>
                  <td className="py-3 px-4">{order.listing}</td>
                  <td className="py-3 px-4">{order.amount}</td>
                  <td className="py-3 px-4">
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{order.date}</td>
                  <td className="py-3 px-4">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
