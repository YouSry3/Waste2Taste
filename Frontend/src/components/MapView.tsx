import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { MapPin, Store, Phone, Mail, Navigation, Package } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const vendors = [
  { id: 1, name: 'Green Valley Bakery', category: 'Bakery', address: 'Zamalek, Cairo', coords: { lat: 30.0626, lng: 31.2197 }, activeListings: 5, status: 'Active', phone: '(+20) 2-123-4567', email: 'manager@greenvalley.com' },
  { id: 2, name: 'City Cafe', category: 'Cafe', address: 'Maadi, Cairo', coords: { lat: 29.9602, lng: 31.2497 }, activeListings: 3, status: 'Active', phone: '(+20) 2-234-5678', email: 'contact@citycafe.com' },
  { id: 3, name: 'Fresh Market', category: 'Grocery', address: 'Heliopolis, Cairo', coords: { lat: 30.0908, lng: 31.3228 }, activeListings: 8, status: 'Active', phone: '(+20) 2-345-6789', email: 'info@freshmarket.com' },
  { id: 4, name: 'Downtown Deli', category: 'Restaurant', address: 'Downtown, Cairo', coords: { lat: 30.0444, lng: 31.2357 }, activeListings: 4, status: 'Active', phone: '(+20) 2-456-7890', email: 'owner@downtowndeli.com' },
  { id: 5, name: 'Alexandria Bakery', category: 'Bakery', address: 'Stanley, Alexandria', coords: { lat: 31.2156, lng: 29.9467 }, activeListings: 6, status: 'Active', phone: '(+20) 3-567-8901', email: 'alex@bakery.com' },
  { id: 6, name: 'Giza Bistro', category: 'Restaurant', address: 'Dokki, Giza', coords: { lat: 30.0389, lng: 31.2110 }, activeListings: 7, status: 'Active', phone: '(+20) 2-678-9012', email: 'hello@gizabistro.com' },
  { id: 7, name: 'Nasr City Market', category: 'Grocery', address: 'Nasr City, Cairo', coords: { lat: 30.0626, lng: 31.3414 }, activeListings: 5, status: 'Active', phone: '(+20) 2-789-0123', email: 'info@nasrmarket.com' },
  { id: 8, name: 'Sweet Treats', category: 'Bakery', address: '6th of October City', coords: { lat: 29.9474, lng: 30.9378 }, activeListings: 4, status: 'Active', phone: '(+20) 2-890-1234', email: 'sweet@treats.com' },
];

const categoryColors: Record<string, string> = {
  Bakery: 'bg-orange-500',
  Cafe: 'bg-blue-500',
  Grocery: 'bg-green-500',
  Restaurant: 'bg-red-500',
};

export function MapView() {
  const [selectedVendor, setSelectedVendor] = useState<typeof vendors[0] | null>(null);
  const [filterCategory, setFilterCategory] = useState('all');

  const filteredVendors = vendors.filter(vendor => 
    filterCategory === 'all' || vendor.category === filterCategory
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1>Vendor Map</h1>
          <p className="text-gray-500">View all vendor locations across Egypt</p>
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-48">
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Area */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <div className="relative w-full h-[600px] bg-gray-100 rounded-lg overflow-hidden">
              {/* Mock Map - Egypt Centered */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Navigation className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Map centered on Egypt</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Showing {filteredVendors.length} vendor{filteredVendors.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Vendor Markers */}
              {filteredVendors.map((vendor) => {
                // Calculate position based on mock coordinates
                // Egypt bounds roughly: lat 22-32, lng 25-35
                const x = ((vendor.coords.lng - 25) / 10) * 100;
                const y = ((32 - vendor.coords.lat) / 10) * 100;
                
                return (
                  <div
                    key={vendor.id}
                    className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform"
                    style={{ left: `${x}%`, top: `${y}%` }}
                    onClick={() => setSelectedVendor(vendor)}
                  >
                    <div className={`${categoryColors[vendor.category]} rounded-full p-2 shadow-lg border-2 border-white`}>
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    {selectedVendor?.id === vendor.id && (
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white rounded-lg shadow-xl p-3 min-w-[200px] z-10">
                        <div className="text-sm">
                          <p className="mb-1">{vendor.name}</p>
                          <Badge variant="secondary" className="text-xs">
                            {vendor.category}
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4">
                <p className="text-sm mb-2">Categories</p>
                <div className="space-y-2">
                  {Object.entries(categoryColors).map(([category, color]) => (
                    <div key={category} className="flex items-center gap-2 text-xs">
                      <div className={`${color} w-3 h-3 rounded-full`} />
                      <span>{category}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vendor List Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vendors ({filteredVendors.length})</CardTitle>
            </CardHeader>
            <CardContent className="max-h-[600px] overflow-y-auto space-y-3">
              {filteredVendors.map((vendor) => (
                <div
                  key={vendor.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedVendor?.id === vendor.id
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedVendor(vendor)}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`${categoryColors[vendor.category]} rounded-lg p-2`}>
                      <Store className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm mb-1">{vendor.name}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {vendor.category}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      {vendor.address}
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="h-3 w-3" />
                      {vendor.activeListings} active listings
                    </div>
                  </div>

                  {selectedVendor?.id === vendor.id && (
                    <div className="mt-3 pt-3 border-t space-y-2 text-xs">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="h-3 w-3" />
                        {vendor.phone}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="h-3 w-3" />
                        {vendor.email}
                      </div>
                      <Button size="sm" className="w-full mt-2">View Details</Button>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
