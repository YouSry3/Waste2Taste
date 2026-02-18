import { Card, CardContent } from "../../../ui/card";
import { Badge } from "../../../ui/badge";
import { Button } from "../../../ui/button";
import { MapPin, Clock, Image as ImageIcon } from "lucide-react";
import { statusColors } from "../constants/listings.data";
import { ListingCardProps } from "../types/listing.types";

export function ListingCard({
  listing,
  onEdit,
  onView,
  onDelete,
  isLoading = false,
}: ListingCardProps & { isLoading?: boolean }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* Photo Section */}
      <div
        className="relative h-48 bg-gray-100 overflow-hidden cursor-pointer"
        onClick={() => onView(listing)}
      >
        {listing.photos && listing.photos.length > 0 ? (
          <div className="h-full w-full flex items-center justify-center">
            <img
              src={listing.photos[0]} // Show first photo
              alt={listing.title}
              className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
            />
            {listing.photos.length > 1 && (
              <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md">
                +{listing.photos.length - 1} more
              </div>
            )}
          </div>
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center text-gray-400">
            <ImageIcon className="h-12 w-12 mb-2" />
            <p className="text-sm">No photos</p>
          </div>
        )}
        <Badge
          variant={statusColors[listing.status]}
          className="absolute top-3 left-3"
        >
          {listing.status}
        </Badge>
      </div>

      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 truncate">
              {listing.title}
            </h4>
            <p className="text-sm text-gray-600 truncate">{listing.vendor}</p>
          </div>
          <span className="text-sm text-gray-500 flex items-center">
            ★ {listing.rating}
          </span>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{listing.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4 flex-shrink-0" />
            <span>Pickup: {listing.pickupTime}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4 pb-4 border-b">
          <div>
            <p className="text-sm text-gray-500 line-through">
              ${listing.originalPrice.toFixed(2)}
            </p>
            <p className="text-green-600 font-semibold text-lg">
              ${listing.salePrice.toFixed(2)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Available</p>
            <p className="font-medium text-lg">{listing.quantity} bags</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            className="flex-1 bg-orange-400 hover:bg-orange-500 text-white"
            size="sm"
            onClick={() => onEdit(listing)}
            disabled={isLoading}
          >
            Edit
          </Button>
          <Button
            className="flex-1 border border-green-600 hover:bg-green-50 text-green-600 hover:text-green-700"
            size="sm"
            onClick={() => onView(listing)}
            disabled={isLoading}
          >
            View
          </Button>
          <Button
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            size="sm"
            onClick={() => onDelete(listing.id)}
            disabled={isLoading}
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
