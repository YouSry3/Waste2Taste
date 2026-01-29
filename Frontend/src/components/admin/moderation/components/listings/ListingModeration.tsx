import React, { useState } from "react";
import { Listing } from "../../types";
import { ListingCard } from "./ListingCard";
import { ListingBulkActions } from "./ListingBulkActions";
import { Card, CardContent } from "../../../../ui/card";
import { Package } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ListingModerationProps {
  listings: Listing[];
  filteredListings: Listing[];
  paginatedListings: Listing[];
  selectedListings: number[];
  loadingStates: { [key: string]: boolean };
  totalListingsPages: number;
  listingsPage: number;
  onSelectListing: (id: number, checked: boolean) => void;
  onApproveListing: (id: number) => void;
  onRejectListing: (id: number) => void;
  onRequestChanges: (id: number) => void;
  onBulkApproveListings: () => void;
  onBulkRejectListings: () => void;
  onClearSelection: () => void;
  onPageChange: (page: number) => void;
  onZoomImage: (image: string) => void;
  // REMOVED: statusFilter and onStatusFilterChange - moved to ActivityLog
}

export function ListingModeration({
  listings,
  filteredListings,
  paginatedListings,
  selectedListings,
  loadingStates,
  totalListingsPages,
  listingsPage,
  onSelectListing,
  onApproveListing,
  onRejectListing,
  onRequestChanges,
  onBulkApproveListings,
  onBulkRejectListings,
  onClearSelection,
  onPageChange,
  onZoomImage,
}: ListingModerationProps) {
  return (
    <div className="space-y-4">
      {/* REMOVED: Status Filter - moved to ActivityLog */}

      {/* Bulk Actions Bar */}
      {selectedListings.length > 0 && (
        <ListingBulkActions
          selectedCount={selectedListings.length}
          loading={loadingStates["bulk-approve-listings"]}
          onApproveAll={onBulkApproveListings}
          onRejectAll={onBulkRejectListings}
          onClearSelection={onClearSelection}
        />
      )}

      {paginatedListings.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No listings found</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {paginatedListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              isSelected={selectedListings.includes(listing.id)}
              isLoading={loadingStates[`listing-${listing.id}`]}
              onSelect={onSelectListing}
              onApprove={onApproveListing}
              onReject={onRejectListing}
              onRequestChanges={onRequestChanges}
              onZoomImage={onZoomImage}
            />
          ))}

          {/* Pagination */}
          {totalListingsPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => onPageChange(Math.max(1, listingsPage - 1))}
                disabled={listingsPage === 1}
                className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              <span className="text-sm text-gray-600 px-4">
                Page {listingsPage} of {totalListingsPages}
              </span>
              <button
                onClick={() => onPageChange(listingsPage + 1)}
                disabled={listingsPage >= totalListingsPages}
                className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
