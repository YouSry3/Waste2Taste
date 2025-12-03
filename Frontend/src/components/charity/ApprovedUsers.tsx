import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Search, Mail, Phone, Calendar } from 'lucide-react';

const approvedUsers = [
  { id: 1, name: 'Omar Saeed', email: 'omar.s@email.com', phone: '(+20) 10-1111-2222', approvedDate: '2025-10-28', itemsClaimed: 12, lastClaim: '2025-10-29', status: 'Active' },
  { id: 2, name: 'Nour Ahmed', email: 'nour.a@email.com', phone: '(+20) 11-2222-3333', approvedDate: '2025-10-25', itemsClaimed: 8, lastClaim: '2025-10-28', status: 'Active' },
  { id: 3, name: 'Youssef Mahmoud', email: 'youssef.m@email.com', phone: '(+20) 12-3333-4444', approvedDate: '2025-10-20', itemsClaimed: 15, lastClaim: '2025-10-30', status: 'Active' },
  { id: 4, name: 'Mona Hassan', email: 'mona.h@email.com', phone: '(+20) 15-4444-5555', approvedDate: '2025-10-18', itemsClaimed: 10, lastClaim: '2025-10-27', status: 'Active' },
  { id: 5, name: 'Karim Farid', email: 'karim.f@email.com', phone: '(+20) 10-5555-6666', approvedDate: '2025-10-15', itemsClaimed: 6, lastClaim: '2025-10-22', status: 'Active' },
];

export function ApprovedUsers() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = approvedUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1>Approved Users</h1>
        <p className="text-gray-500">Manage users with assisted status</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 mb-1">Total Approved</p>
            <h3>{approvedUsers.length}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 mb-1">Active This Month</p>
            <h3>{approvedUsers.filter(u => u.status === 'Active').length}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 mb-1">Total Claims</p>
            <h3>{approvedUsers.reduce((sum, u) => sum + u.itemsClaimed, 0)}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 mb-1">Avg. Claims/User</p>
            <h3>{(approvedUsers.reduce((sum, u) => sum + u.itemsClaimed, 0) / approvedUsers.length).toFixed(1)}</h3>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search approved users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Approved Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">User</th>
                  <th className="text-left py-3 px-4">Contact</th>
                  <th className="text-left py-3 px-4">Approved Date</th>
                  <th className="text-left py-3 px-4">Items Claimed</th>
                  <th className="text-left py-3 px-4">Last Claim</th>
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
                        <span>{user.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm space-y-1">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3 text-gray-400" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3 text-gray-400" />
                          {user.phone}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">{user.approvedDate}</td>
                    <td className="py-3 px-4">{user.itemsClaimed}</td>
                    <td className="py-3 px-4">{user.lastClaim}</td>
                    <td className="py-3 px-4">
                      <Badge variant="default">{user.status}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm">View Details</Button>
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
