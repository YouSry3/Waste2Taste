// src/components/admin/listings/components/ListingCard.tsx
import { Card, CardContent } from "../../../ui/card";
import { Badge } from "../../../ui/badge";
import { Button } from "../../../ui/button";
import { MapPin, Clock } from "lucide-react";
import { statusColors } from "../constants/listings.data";
import { ListingCardProps } from "../types/listing.types";

export function ListingCard({
  listing,
  onEdit,
  onView,
  onDelete,
}: ListingCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <Badge variant={statusColors[listing.status]}>{listing.status}</Badge>
          <span className="text-sm text-gray-500">★ {listing.rating}</span>
        </div>
        <h4 className="mb-2 font-semibold text-gray-900">{listing.title}</h4>
        <p className="text-sm text-gray-600 mb-4">{listing.vendor}</p>
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            {listing.location}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" /> Pickup: {listing.pickupTime}
          </div>
        </div>
        <div className="flex items-center justify-between mb-4 pb-4 border-b">
          <div>
            <p className="text-sm text-gray-500 line-through">
              ${listing.originalPrice.toFixed(2)}
            </p>
            <p className="text-green-600 font-semibold">
              ${listing.salePrice.toFixed(2)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Available</p>
            <p className="font-medium">{listing.quantity} bags</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            className="flex-1 bg-orange-400 hover:bg-orange-500 text-white"
            size="sm"
            onClick={() => onEdit(listing)}
          >
            Edit
          </Button>
          <Button
            className="flex-1 border border-green-600 hover:bg-green-50 text-green-600 hover:text-green-700"
            size="sm"
            onClick={() => onView(listing)}
          >
            View
          </Button>
          <Button
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            size="sm"
            onClick={() => onDelete(listing.id)}
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
