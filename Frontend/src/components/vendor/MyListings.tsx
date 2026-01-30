// src/components/vendor/listings/MyListings.tsx
import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Clock, Edit, Trash2, Eye, Plus } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Switch } from "../ui/switch";
import { useNavigate } from "react-router-dom";

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

export function MyListings() {
  const navigate = useNavigate();
  const [listingStates, setListingStates] = useState(
    listings.map((l) => ({
      id: l.id,
      active: l.status === "Active",
    })),
  );

  const toggleListing = (id: number) => {
    setListingStates((prev) =>
      prev.map((state) =>
        state.id === id ? { ...state, active: !state.active } : state,
      ),
    );
  };

  const handleCreateListing = () => {
    navigate("/panel/vendor/create-listing");
  };

  const handleEditListing = (id: number) => {
    navigate(`/panel/vendor/listings/edit/${id}`);
  };

  const handleViewListing = (id: number) => {
    navigate(`/panel/vendor/listings/${id}`);
  };

  const handleDeleteListing = (id: number) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      console.log(`Deleting listing ${id}`);
      // In a real app, you would call an API here
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Listings</h1>
          <p className="text-gray-500 mt-1">
            Manage your surplus food listings
          </p>
        </div>

        <Button
          className="bg-green-600 hover:bg-green-700 gap-2"
          onClick={handleCreateListing}
        >
          <Plus className="h-4 w-4" />
          Create New Listing
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-gray-500 mb-1">Total Listings</p>
            <h3 className="text-2xl font-bold">{listings.length}</h3>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-gray-500 mb-1">Active</p>
            <h3 className="text-2xl font-bold">
              {listingStates.filter((s) => s.active).length}
            </h3>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-gray-500 mb-1">Total Sold</p>
            <h3 className="text-2xl font-bold">
              {listings.reduce((sum, l) => sum + l.sold, 0)}
            </h3>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-gray-500 mb-1">Total Views</p>
            <h3 className="text-2xl font-bold">
              {listings.reduce((sum, l) => sum + l.views, 0)}
            </h3>
          </CardContent>
        </Card>
      </div>

      {/* Listings */}
      <div className="space-y-4">
        {listings.map((listing) => {
          const isActive = listingStates.find(
            (s) => s.id === listing.id,
          )?.active;

          return (
            <Card
              key={listing.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Image */}
                  <div className="w-full sm:w-32 h-48 sm:h-32 flex-shrink-0">
                    <div className="w-full h-full rounded-lg overflow-hidden bg-gray-100">
                      <ImageWithFallback
                        src={listing.image}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4">
                      <div className="mb-4 sm:mb-0">
                        <h4 className="text-lg font-semibold mb-2">
                          {listing.title}
                        </h4>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge>{listing.category}</Badge>
                          {listing.quantity === 0 ? (
                            <Badge
                              variant="secondary"
                              className="bg-red-100 text-red-800 hover:bg-red-100"
                            >
                              Sold Out
                            </Badge>
                          ) : (
                            <Badge
                              variant={isActive ? "default" : "secondary"}
                              className={
                                isActive
                                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                                  : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                              }
                            >
                              {isActive ? "Active" : "Paused"}
                            </Badge>
                          )}
                          <Badge
                            variant="outline"
                            className="border-blue-200 text-blue-700"
                          >
                            {listing.quantity} available
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                          {isActive ? "Active" : "Paused"}
                        </span>
                        <Switch
                          checked={isActive}
                          onCheckedChange={() => toggleListing(listing.id)}
                          disabled={listing.quantity === 0}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <Clock className="h-4 w-4" />
                          <span>Pickup: {listing.pickupTime}</span>
                        </div>
                        <div className="flex gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Price: </span>
                            <span className="font-semibold">
                              {listing.salePrice}
                            </span>
                            <span className="text-gray-400 line-through ml-2">
                              {listing.originalPrice}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Sold: </span>
                            <span className="font-semibold">
                              {listing.sold}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Views: </span>
                            <span className="font-semibold">
                              {listing.views}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditListing(listing.id)}
                        className="gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewListing(listing.id)}
                        className="gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        Preview
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteListing(listing.id)}
                        className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                      >
                        <Trash2 className="h-4 w-4" />
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
