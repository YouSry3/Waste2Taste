import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Search, Mail, Phone, ShoppingBag, Calendar } from 'lucide-react';

const users = [
  { id: 1, name: 'Emma Wilson', email: 'emma.w@email.com', phone: '(555) 123-4567', orders: 28, totalSpent: '$142.50', status: 'Active', joined: '2024-03-15', lastOrder: '2025-10-29' },
  { id: 2, name: 'John Smith', email: 'john.smith@email.com', phone: '(555) 234-5678', orders: 42, totalSpent: '$215.80', status: 'Active', joined: '2024-01-20', lastOrder: '2025-10-30' },
  { id: 3, name: 'Sarah Johnson', email: 'sarah.j@email.com', phone: '(555) 345-6789', orders: 35, totalSpent: '$189.20', status: 'Active', joined: '2024-05-10', lastOrder: '2025-10-28' },
  { id: 4, name: 'Mike Chen', email: 'mike.chen@email.com', phone: '(555) 456-7890', orders: 18, totalSpent: '$95.40', status: 'Active', joined: '2024-06-22', lastOrder: '2025-10-27' },
  { id: 5, name: 'Lisa Anderson', email: 'lisa.a@email.com', phone: '(555) 567-8901', orders: 51, totalSpent: '$268.90', status: 'Active', joined: '2024-04-18', lastOrder: '2025-10-30' },
  { id: 6, name: 'Robert Wilson', email: 'r.wilson@email.com', phone: '(555) 678-9012', orders: 12, totalSpent: '$67.50', status: 'Inactive', joined: '2024-08-05', lastOrder: '2025-09-15' },
  { id: 7, name: 'Jessica Brown', email: 'jess.b@email.com', phone: '(555) 789-0123', orders: 24, totalSpent: '$128.70', status: 'Active', joined: '2024-07-12', lastOrder: '2025-10-29' },
  { id: 8, name: 'David Lee', email: 'david.lee@email.com', phone: '(555) 890-1234', orders: 38, totalSpent: '$198.30', status: 'Active', joined: '2024-02-28', lastOrder: '2025-10-30' },
];

export function UsersView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && user.status === 'Active') ||
                         (filterStatus === 'inactive' && user.status === 'Inactive');
    return matchesSearch && matchesStatus;
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1>Users</h1>
          <p className="text-gray-500">Manage customer accounts</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 mb-1">Total Users</p>
            <h3>{users.length}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 mb-1">Active Users</p>
            <h3>{users.filter(u => u.status === 'Active').length}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 mb-1">Total Orders</p>
            <h3>{users.reduce((sum, u) => sum + u.orders, 0)}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
            <h3>${users.reduce((sum, u) => sum + parseFloat(u.totalSpent.replace('$', '')), 0).toFixed(2)}</h3>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant={filterStatus === 'all' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilterStatus('all')}
              >
                All
              </Button>
              <Button 
                variant={filterStatus === 'active' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilterStatus('active')}
              >
                Active
              </Button>
              <Button 
                variant={filterStatus === 'inactive' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilterStatus('inactive')}
              >
                Inactive
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">User</th>
                  <th className="text-left py-3 px-4">Contact</th>
                  <th className="text-left py-3 px-4">Orders</th>
                  <th className="text-left py-3 px-4">Total Spent</th>
                  <th className="text-left py-3 px-4">Last Order</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div>{user.name}</div>
                          <div className="text-xs text-gray-500">Joined {user.joined}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <div className="flex items-center gap-1 mb-1">
                          <Mail className="h-3 w-3 text-gray-400" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3 text-gray-400" />
                          {user.phone}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">{user.orders}</td>
                    <td className="py-3 px-4">{user.totalSpent}</td>
                    <td className="py-3 px-4">{user.lastOrder}</td>
                    <td className="py-3 px-4">
                      <Badge variant={user.status === 'Active' ? 'default' : 'secondary'}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm">View</Button>
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
