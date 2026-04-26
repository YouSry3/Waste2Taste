import React, { useState } from "react";
import { Listing } from "../../types";
import { Card, CardContent } from "../../../../ui/card";
import { Badge } from "../../../../ui/badge";
import { Checkbox } from "../../../../ui/checkbox";
import { ImageWithFallback } from "../../../../ImageFallback/ImageWithFallback";
import {
  Store,
  Clock,
  Package,
  CheckCircle,
  XCircle,
  Flag,
  Loader2,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  ZoomIn,
} from "lucide-react";
import { Button } from "../../../../ui/button";

interface ListingCardProps {
  listing: Listing;
  isSelected: boolean;
  isLoading: boolean;
  onSelect: (id: string, checked: boolean) => void;
  onApprove: (id: string) => Promise<void> | void;
  onReject: (id: string) => void;
  onRequestChanges: (id: string) => void;
  onZoomImage: (image: string) => void;
}

/* ---------------- SAFE ---------------- */
const formatMoney = (value: number) =>
  typeof value === "number" ? `$${value.toFixed(2)}` : "$0.00";

export function ListingCard({
  listing,
  isSelected,
  isLoading,
  onSelect,
  onApprove,
  onReject,
  onRequestChanges,
  onZoomImage,
}: ListingCardProps) {
  const [loading, setLoading] = useState({
    approve: false,
  });

  const handleApprove = async () => {
    setLoading({ approve: true });
    await onApprove(listing.id);
    setLoading({ approve: false });
  };

  const discount =
    listing.originalPrice > 0
      ? Math.round(
          ((listing.originalPrice - listing.price) / listing.originalPrice) *
            100,
        )
      : 0;

  return (
    <Card className="shadow-sm hover:shadow-md transition-all border border-gray-200">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* IMAGE */}
          <div className="lg:col-span-1 flex gap-3">
            <Checkbox
              checked={isSelected}
              onCheckedChange={(v) => onSelect(listing.id, !!v)}
            />

            <div
              className="relative w-full aspect-square rounded-xl overflow-hidden cursor-pointer"
              onClick={() => onZoomImage(listing.imageUrl)}
            >
              <ImageWithFallback
                src={listing.imageUrl}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* DETAILS */}
          <div className="lg:col-span-2 space-y-2">
            <h2 className="text-lg font-bold">{listing.name}</h2>

            <p className="text-sm text-gray-600">{listing.description}</p>

            <p className="text-sm text-gray-500">Vendor: {listing.vendorId}</p>

            <Badge>{listing.category || "Uncategorized"}</Badge>

            <div className="text-sm text-gray-600">Qty: {listing.quantity}</div>

            <div className="text-sm text-gray-600">
              Expiry: {new Date(listing.expiryDate).toLocaleString()}
            </div>

            {/* PRICE */}
            <div className="flex gap-2 items-center pt-2">
              <span className="line-through text-gray-400">
                {formatMoney(listing.originalPrice)}
              </span>
              <span className="text-green-600 font-bold">
                {formatMoney(listing.price)}
              </span>
              <Badge>{discount}% OFF</Badge>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col gap-2">
            <Button
              onClick={handleApprove}
              disabled={loading.approve || isLoading}
              className="bg-green-600 text-white"
            >
              {loading.approve ? (
                <Loader2 className="animate-spin" />
              ) : (
                <CheckCircle />
              )}
              Approve
            </Button>

            <Button
              onClick={() => onReject(listing.id)}
              className="bg-red-600 text-white"
            >
              <XCircle />
              Reject
            </Button>

            <Button onClick={() => onRequestChanges(listing.id)}>
              <Flag />
              Request Changes
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
