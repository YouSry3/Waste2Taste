import React, { useState } from "react";
import { Listing } from "../../types";
import { Card, CardContent } from "../../../../ui/card";
import { Badge } from "../../../../ui/badge";
import { Checkbox } from "../../../../ui/checkbox";
import { ImageWithFallback } from "../../../../figma/ImageWithFallback";
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
  onSelect: (id: number, checked: boolean) => void;
  onApprove: (id: number) => Promise<void> | void;
  onReject: (id: number) => void; // Changed: This should open dialog, not actually reject
  onRequestChanges: (id: number) => void;
  onZoomImage: (image: string) => void;
}

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
  const [isLocalLoading, setIsLocalLoading] = useState({
    approve: false,
    reject: false,
  });

  const handleApprove = async () => {
    setIsLocalLoading((prev) => ({ ...prev, approve: true }));
    try {
      await onApprove(listing.id);
    } catch (error) {
      console.error("Failed to approve:", error);
    } finally {
      setIsLocalLoading((prev) => ({ ...prev, approve: false }));
    }
  };

  const handleReject = () => {
    // Just open the rejection dialog, don't try to await it
    onReject(listing.id);
  };

  const isApproveLoading = isLoading || isLocalLoading.approve;
  const isRejectLoading = isLoading || isLocalLoading.reject;

  return (
    <Card
      className={`shadow-sm hover:shadow-md transition-all ${
        listing.flagged
          ? "border-2 border-red-400 bg-red-50/30"
          : "border border-gray-200"
      }`}
    >
      <CardContent className="p-6">
        {/* AI Flag Alert */}
        {listing.flagged && listing.aiFlag && (
          <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 rounded-r-lg flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-900 mb-1">
                🚨 AI Quality Flag: {listing.aiFlag.type}
              </p>
              <p className="text-xs text-red-800">
                {listing.aiFlag.reason} • Confidence:{" "}
                {(listing.aiFlag.confidence * 100).toFixed(0)}%
              </p>
            </div>
            <div className="flex gap-2">
              <Button className="p-2 border border-gray-300 hover:bg-gray-50 rounded-lg">
                <ThumbsUp className="h-3 w-3" />
              </Button>
              <Button className="p-2 border border-gray-300 hover:bg-gray-50 rounded-lg">
                <ThumbsDown className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Checkbox & Image */}
          <div className="lg:col-span-1">
            <div className="flex items-start gap-3">
              <Checkbox
                checked={isSelected}
                onCheckedChange={(checked) => onSelect(listing.id, !!checked)}
                className="mt-1"
              />
              <div className="relative flex-1 aspect-square rounded-xl overflow-hidden bg-gray-100 shadow-sm cursor-pointer group">
                <ImageWithFallback
                  src={listing.image}
                  alt={listing.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/50 transition-all duration-300"
                  onClick={() => onZoomImage(listing.image)}
                >
                  <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-1">
                {listing.title}
              </h4>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <Store className="h-4 w-4" />
                {listing.vendor}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200">
                {listing.category}
              </Badge>
              <span className="text-sm text-gray-400">•</span>
              <span className="text-sm text-gray-600 font-medium">
                {listing.quantity} bags available
              </span>
            </div>

            <div className="space-y-2 text-sm bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-gray-700">
                <Clock className="h-4 w-4 text-orange-500" />
                <span className="font-medium">Pickup Window:</span>
                {listing.pickupTime}
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Package className="h-4 w-4 text-green-600" />
                <span className="font-medium">Submitted:</span>
                {listing.submitted}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <span className="text-lg text-gray-400 line-through">
                {listing.originalPrice}
              </span>
              <span className="text-2xl font-bold text-green-600">
                {listing.price}
              </span>
              <Badge variant="outline" className="text-xs">
                {(
                  ((parseFloat(listing.originalPrice.slice(1)) -
                    parseFloat(listing.price.slice(1))) /
                    parseFloat(listing.originalPrice.slice(1))) *
                  100
                ).toFixed(0)}
                % off
              </Badge>
            </div>
          </div>

          {/* Actions */}
          <div className="lg:col-span-1 flex flex-col gap-2">
            <Button
              onClick={handleApprove}
              disabled={isApproveLoading}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
            >
              {isApproveLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Approving...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Approve & Publish
                </>
              )}
            </Button>
            <Button
              onClick={handleReject}
              disabled={isRejectLoading}
             
              className="w-full bg-red-600 text-white"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject Listing
            </Button>
          
            <Button
              onClick={() => onRequestChanges(listing.id)} // Make sure this passes the ID
              className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
            >
              <Flag className="h-4 w-4" />
              Request Changes
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
