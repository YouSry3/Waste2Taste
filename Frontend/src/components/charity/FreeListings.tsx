import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Plus, Clock, Users, Package } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

const listings = [
  {
    id: 1,
    title: 'Bakery Donation Box',
    vendor: 'Green Valley Bakery',
    quantity: 8,
    pickupTime: '6:00 PM - 7:00 PM',
    status: 'Available',
    claimed: 3,
    image: 'https://images.unsplash.com/photo-1696721497670-d57754966c1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWtlcnklMjBmb29kJTIwcGFzdHJpZXN8ZW58MXx8fHwxNzYxODI3NTk4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: 2,
    title: 'Fresh Produce Box',
    vendor: 'Fresh Market',
    quantity: 10,
    pickupTime: '7:00 PM - 8:00 PM',
    status: 'Available',
    claimed: 5,
    image: 'https://images.unsplash.com/photo-1714251033194-d46642d6df3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm9jZXJ5JTIwc3RvcmUlMjBwcm9kdWNlfGVufDF8fHx8MTc2MTc2NTI4Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: 3,
    title: 'Prepared Meals',
    vendor: 'Downtown Deli',
    quantity: 12,
    pickupTime: '5:00 PM - 6:00 PM',
    status: 'Available',
    claimed: 7,
    image: 'https://images.unsplash.com/photo-1636401870585-a8852371e84a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwa2l0Y2hlbiUyMGZvb2R8ZW58MXx8fHwxNzYxODI4MzY0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
];

export function FreeListings() {
  return (
    <div className="p-8 mt-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1>Product Listings</h1>
          <p className="text-gray-500">Post free food available for verified assisted customers</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Create Listing
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 mb-1">Active Listings</p>
            <h3>{listings.length}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 mb-1">Total Available</p>
            <h3>{listings.reduce((sum, l) => sum + l.quantity, 0)}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 mb-1">Total Claimed</p>
            <h3>{listings.reduce((sum, l) => sum + l.claimed, 0)}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 mb-1">People Helped Today</p>
            <h3>15</h3>
          </CardContent>
        </Card>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <Card key={listing.id}>
            <CardContent className="p-6">
              <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 mb-4">
                <ImageWithFallback
                  src={listing.image}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="mb-3">
                <h4 className="mb-2">{listing.title}</h4>
                <p className="text-sm text-gray-600">{listing.vendor}</p>
              </div>

              <Badge className="mb-3 bg-green-600">{listing.status}</Badge>

              <div className="space-y-2 mb-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Pickup: {listing.pickupTime}
                </div>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Available: {listing.quantity} items
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Claimed: {listing.claimed}
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button variant="outline" className="flex-1" size="sm">Edit</Button>
                <Button variant="outline" className="flex-1" size="sm">View Claims</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}