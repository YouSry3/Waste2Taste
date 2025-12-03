import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Search, Plus, Filter, Clock, MapPin } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';

const listings = [
  { id: 1, vendor: 'Green Valley Bakery', title: 'Bakery Surprise Bag', category: 'Bakery', originalPrice: '$15.00', salePrice: '$4.99', quantity: 5, pickupTime: '6:00 PM - 7:00 PM', status: 'Active', location: '123 Valley Road', rating: 4.8 },
  { id: 2, vendor: 'City Cafe', title: 'Coffee & Pastries', category: 'Cafe', originalPrice: '$18.00', salePrice: '$5.99', quantity: 3, pickupTime: '8:00 PM - 9:00 PM', status: 'Active', location: '456 Main Street', rating: 4.6 },
  { id: 3, vendor: 'Fresh Market', title: 'Produce Box', category: 'Grocery', originalPrice: '$25.00', salePrice: '$7.99', quantity: 8, pickupTime: '7:00 PM - 8:00 PM', status: 'Active', location: '789 Market Ave', rating: 4.9 },
  { id: 4, vendor: 'Downtown Deli', title: 'Sandwich Pack', category: 'Restaurant', originalPrice: '$20.00', salePrice: '$6.50', quantity: 0, pickupTime: '5:00 PM - 6:00 PM', status: 'Sold Out', location: '321 Downtown Blvd', rating: 4.7 },
  { id: 5, vendor: 'Organic Bistro', title: 'Meal Box', category: 'Restaurant', originalPrice: '$30.00', salePrice: '$9.99', quantity: 4, pickupTime: '9:00 PM - 10:00 PM', status: 'Active', location: '147 Organic Way', rating: 4.5 },
  { id: 6, vendor: 'Sweet Treats', title: 'Dessert Box', category: 'Bakery', originalPrice: '$22.00', salePrice: '$6.99', quantity: 6, pickupTime: '7:30 PM - 8:30 PM', status: 'Active', location: '258 Sweet Lane', rating: 4.8 },
];

export function ListingsView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || listing.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || listing.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1>Food Listings</h1>
          <p className="text-gray-500">Manage surplus food listings from vendors</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Create Listing
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 mb-1">Total Listings</p>
            <h3>{listings.length}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 mb-1">Active</p>
            <h3>{listings.filter(l => l.status === 'Active').length}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 mb-1">Available Items</p>
            <h3>{listings.reduce((sum, l) => sum + l.quantity, 0)}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 mb-1">Avg. Discount</p>
            <h3>67%</h3>
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
                placeholder="Search listings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Bakery">Bakery</SelectItem>
                <SelectItem value="Restaurant">Restaurant</SelectItem>
                <SelectItem value="Cafe">Cafe</SelectItem>
                <SelectItem value="Grocery">Grocery</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Sold Out">Sold Out</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((listing) => (
          <Card key={listing.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <Badge variant={listing.status === 'Active' ? 'default' : 'secondary'}>
                  {listing.status}
                </Badge>
                <span className="text-sm text-gray-500">★ {listing.rating}</span>
              </div>

              <h4 className="mb-2">{listing.title}</h4>
              <p className="text-sm text-gray-600 mb-4">{listing.vendor}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  {listing.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  Pickup: {listing.pickupTime}
                </div>
              </div>

              <div className="flex items-center justify-between mb-4 pb-4 border-b">
                <div>
                  <p className="text-sm text-gray-500 line-through">{listing.originalPrice}</p>
                  <p className="text-green-600">{listing.salePrice}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Available</p>
                  <p>{listing.quantity} bags</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" size="sm">Edit</Button>
                <Button variant="outline" className="flex-1" size="sm">View</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
