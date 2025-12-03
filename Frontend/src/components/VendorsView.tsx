import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Search, Plus, MapPin, Phone, Mail, Store, Heart } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const vendors = [
  { id: 1, name: 'Green Valley Bakery', type: 'Vendor', category: 'Bakery', contact: 'Jane Cooper', email: 'manager@greenvalley.com', phone: '(555) 111-2222', address: '123 Valley Road', listings: 12, revenue: '$842.50', rating: 4.8, status: 'Active' },
  { id: 2, name: 'City Cafe', type: 'Vendor', category: 'Cafe', contact: 'Tom Harris', email: 'contact@citycafe.com', phone: '(555) 222-3333', address: '456 Main Street', listings: 8, revenue: '$625.40', rating: 4.6, status: 'Active' },
  { id: 3, name: 'Fresh Market', type: 'Vendor', category: 'Grocery', contact: 'Sarah Miller', email: 'info@freshmarket.com', phone: '(555) 333-4444', address: '789 Market Ave', listings: 15, revenue: '$1,124.80', rating: 4.9, status: 'Active' },
  { id: 4, name: 'Downtown Deli', type: 'Vendor', category: 'Restaurant', contact: 'Mike Johnson', email: 'owner@downtowndeli.com', phone: '(555) 444-5555', address: '321 Downtown Blvd', listings: 10, revenue: '$758.20', rating: 4.7, status: 'Active' },
  { id: 5, name: 'Community Food Bank', type: 'NGO Partner', category: 'Non-Profit', contact: 'Emily Davis', email: 'info@foodbank.org', phone: '(555) 555-6666', address: '654 Hope Avenue', listings: 0, revenue: '$0.00', rating: 5.0, status: 'Active' },
  { id: 6, name: 'Organic Bistro', type: 'Vendor', category: 'Restaurant', contact: 'Robert Lee', email: 'hello@organicbistro.com', phone: '(555) 666-7777', address: '987 Organic Way', listings: 11, revenue: '$892.60', rating: 4.5, status: 'Active' },
  { id: 7, name: 'Sweet Treats', type: 'Vendor', category: 'Bakery', contact: 'Linda White', email: 'sweet@treats.com', phone: '(555) 777-8888', address: '258 Sweet Lane', listings: 9, revenue: '$698.30', rating: 4.8, status: 'Active' },
  { id: 8, name: 'Hope Shelter', type: 'NGO Partner', category: 'Non-Profit', contact: 'James Brown', email: 'contact@hopeshelter.org', phone: '(555) 888-9999', address: '147 Shelter Street', listings: 0, revenue: '$0.00', rating: 5.0, status: 'Active' },
];

export function VendorsView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || vendor.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const regularVendors = vendors.filter(v => v.type === 'Vendor');
  const ngoPartners = vendors.filter(v => v.type === 'NGO Partner');

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1>Vendors & Partners</h1>
          <p className="text-gray-500">Manage vendor accounts and NGO partnerships</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Vendor
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Vendor</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Business Name</Label>
                <Input placeholder="Enter business name" />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vendor">Vendor</SelectItem>
                    <SelectItem value="ngo">NGO Partner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bakery">Bakery</SelectItem>
                    <SelectItem value="restaurant">Restaurant</SelectItem>
                    <SelectItem value="cafe">Cafe</SelectItem>
                    <SelectItem value="grocery">Grocery</SelectItem>
                    <SelectItem value="nonprofit">Non-Profit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Contact Person</Label>
                <Input placeholder="Contact name" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" placeholder="email@example.com" />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input type="tel" placeholder="(555) 123-4567" />
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input placeholder="Street address" />
              </div>
              <Button className="w-full bg-green-600 hover:bg-green-700">Add Vendor</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 mb-1">Total Vendors</p>
            <h3>{regularVendors.length}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 mb-1">NGO Partners</p>
            <h3>{ngoPartners.length}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 mb-1">Active Listings</p>
            <h3>{vendors.reduce((sum, v) => sum + v.listings, 0)}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
            <h3>${vendors.reduce((sum, v) => sum + parseFloat(v.revenue.replace(/[$,]/g, '')), 0).toFixed(2)}</h3>
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
                placeholder="Search vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Vendor">Vendors</SelectItem>
                <SelectItem value="NGO Partner">NGO Partners</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredVendors.map((vendor) => (
          <Card key={vendor.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${vendor.type === 'NGO Partner' ? 'bg-pink-100' : 'bg-blue-100'}`}>
                    {vendor.type === 'NGO Partner' ? (
                      <Heart className={`h-6 w-6 text-pink-600`} />
                    ) : (
                      <Store className={`h-6 w-6 text-blue-600`} />
                    )}
                  </div>
                  <div>
                    <h4>{vendor.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={vendor.type === 'NGO Partner' ? 'secondary' : 'default'}>
                        {vendor.category}
                      </Badge>
                      <span className="text-sm text-gray-500">★ {vendor.rating}</span>
                    </div>
                  </div>
                </div>
                <Badge variant="outline">{vendor.status}</Badge>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">Contact:</span>
                  <span>{vendor.contact}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  {vendor.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  {vendor.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  {vendor.address}
                </div>
              </div>

              {vendor.type === 'Vendor' && (
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm text-gray-500">Active Listings</p>
                    <p>{vendor.listings}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Revenue</p>
                    <p>{vendor.revenue}</p>
                  </div>
                </div>
              )}

              {vendor.type === 'NGO Partner' && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600">This organization receives donated surplus food from vendors to support their community programs.</p>
                </div>
              )}

              <Button variant="outline" className="w-full mt-4">View Details</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
