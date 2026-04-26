import React from "react";
import { Listing } from "../../types";
import { ListingCard } from "./ListingCard";
import { ListingBulkActions } from "./ListingBulkActions";
import { Card, CardContent } from "../../../../ui/card";
import { Package, ChevronLeft, ChevronRight } from "lucide-react";

interface ListingModerationProps {
  paginatedListings: Listing[];
  selectedListings: string[];

  loadingStates: { [key: string]: boolean };

  totalListingsPages: number;
  listingsPage: number;

  onSelectListing: (id: string, checked: boolean) => void;
  onApproveListing: (id: string) => void;
  onRejectListing: (id: string) => void;
  onRequestChanges: (id: string) => void;

  onBulkApproveListings: () => void;
  onBulkRejectListings: () => void;
  onClearSelection: () => void;

  onPageChange: (page: number) => void;
  onZoomImage: (image: string) => void;
}

export function ListingModeration({
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
      {/* BULK ACTIONS */}
      {selectedListings.length > 0 && (
        <ListingBulkActions
          selectedCount={selectedListings.length}
          loading={loadingStates["bulk"]}
          onApproveAll={onBulkApproveListings}
          onRejectAll={onBulkRejectListings}
          onClearSelection={onClearSelection}
        />
      )}

      {/* EMPTY STATE */}
      {paginatedListings.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center">
            <Package className="mx-auto text-gray-400" />
            <p>No listings found</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {paginatedListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              isSelected={selectedListings.includes(listing.id)}
              isLoading={loadingStates[listing.id]}
              onSelect={onSelectListing}
              onApprove={onApproveListing}
              onReject={onRejectListing}
              onRequestChanges={onRequestChanges}
              onZoomImage={onZoomImage}
            />
          ))}

          {/* PAGINATION */}
          <div className="flex justify-center gap-2 mt-6">
            <button
              onClick={() =>
                onPageChange(Math.max(1, listingsPage - 1))
              }
            >
              <ChevronLeft />
            </button>

            <span>
              Page {listingsPage} / {totalListingsPages}
            </span>

            <button
              onClick={() => onPageChange(listingsPage + 1)}
            >
              <ChevronRight />
            </button>
          </div>
        </>
      )}
    </div>
  );
}