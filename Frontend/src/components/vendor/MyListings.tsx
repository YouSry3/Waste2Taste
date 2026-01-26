import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Clock, Edit, Trash2, Eye } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Switch } from "../ui/switch";

type MyListingsProps = {
  onCreate: () => void;
};

const listings = [
  {
    id: 1,
    title: "Bakery Surprise Bag",
    category: "Bakery",
    originalPrice: "$15.00",
    salePrice: "$4.99",
    quantity: 5,
    pickupTime: "6:00 PM - 7:00 PM",
    status: "Active",
    image: "https://images.unsplash.com/photo-1696721497670-d57754966c1e",
    sold: 3,
    views: 45,
  },
  {
    id: 2,
    title: "Fresh Pastries Box",
    category: "Bakery",
    originalPrice: "$18.00",
    salePrice: "$5.99",
    quantity: 0,
    pickupTime: "7:00 PM - 8:00 PM",
    status: "Sold Out",
    image: "https://images.unsplash.com/photo-1730660501229-145c09eb9b7a",
    sold: 6,
    views: 52,
  },
  {
    id: 3,
    title: "Dessert Selection",
    category: "Bakery",
    originalPrice: "$20.00",
    salePrice: "$6.99",
    quantity: 4,
    pickupTime: "8:00 PM - 9:00 PM",
    status: "Active",
    image: "https://images.unsplash.com/photo-1706463996554-6c6318946b3f",
    sold: 2,
    views: 38,
  },
];

export function MyListings({ onCreate }: MyListingsProps) {
  const [listingStates, setListingStates] = useState(
    listings.map((l) => ({
      id: l.id,
      active: l.status === "Active",
    }))
  );

  const toggleListing = (id: number) => {
    setListingStates((prev) =>
      prev.map((state) =>
        state.id === id ? { ...state, active: !state.active } : state
      )
    );
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1>My Listings</h1>
          <p className="text-gray-500">Manage your surplus food listings</p>
        </div>

        <Button className="bg-green-600 hover:bg-green-700" onClick={onCreate}>
          Create New Listing
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
            <h3>{listings.filter((l) => l.status === "Active").length}</h3>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 mb-1">Total Sold</p>
            <h3>{listings.reduce((sum, l) => sum + l.sold, 0)}</h3>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 mb-1">Total Views</p>
            <h3>{listings.reduce((sum, l) => sum + l.views, 0)}</h3>
          </CardContent>
        </Card>
      </div>

      {/* Listings */}
      <div className="space-y-4">
        {listings.map((listing) => {
          const isActive = listingStates.find(
            (s) => s.id === listing.id
          )?.active;

          return (
            <Card key={listing.id}>
              <CardContent className="p-6">
                <div className="flex gap-6">
                  {/* Image */}
                  <div className="w-32 h-32 flex-shrink-0">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <ImageWithFallback
                        src={listing.image}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="mb-2">{listing.title}</h4>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge>{listing.category}</Badge>
                          {listing.status === "Sold Out" ? (
                            <Badge variant="secondary">Sold Out</Badge>
                          ) : (
                            <Badge variant={isActive ? "default" : "secondary"}>
                              {isActive ? "Active" : "Paused"}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <Switch
                        checked={isActive}
                        onCheckedChange={() => toggleListing(listing.id)}
                        disabled={listing.status === "Sold Out"}
                      />
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                      <Clock className="h-4 w-4" />
                      Pickup: {listing.pickupTime}
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>

                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
