import { Card, CardContent } from "../../../ui/card";
import { Badge } from "../../../ui/badge";
import { Button } from "../../../ui/button";
import { Input } from "../../../ui/input";
import { Label } from "../../../ui/label";
import {
  MapPin,
  Clock,
  Image as ImageIcon,
  Loader2,
  X,
} from "lucide-react";
import { statusColors } from "../constants/listings.data";
import { ListingCardProps } from "../types/listing.types";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";

export function ListingCard({
  listing,
  onEdit,
  onView,
  onDelete,
  updateStock,
  isLoading = false,
}: ListingCardProps & {
  isLoading?: boolean;
  updateStock: (id: string | number, quantity: number) => Promise<void>;
}) {
  // ── Optimistic state ─────────────────────────────────────────────
  const [optimisticQuantity, setOptimisticQuantity] = useState<number>(
    listing.quantity ?? 0
  );
const isRejected = listing.status === "Discontinued";
  // ── Edit Modal State (Quantity ONLY) ────────────────────────────
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editQuantity, setEditQuantity] = useState<number>(listing.quantity ?? 0);

  // ── Open / Close Modal ───────────────────────────────────────────
  const openEditModal = useCallback(() => {
    setEditQuantity(listing.quantity ?? 0);
    setIsEditModalOpen(true);
  }, [listing]);

  const closeEditModal = useCallback(() => {
    setIsEditModalOpen(false);
  }, []);

  // ── Save Quantity from Modal ─────────────────────────────────────
  const handleEditSubmit = useCallback(async () => {
    if (editQuantity < 0) {
      toast.error("Quantity cannot be negative");
      return;
    }

    const previousQuantity = optimisticQuantity;
    
    // Optimistic update
    setOptimisticQuantity(editQuantity);
    setSavingEdit(true);

    try {
      // Uses the hook's wrapper which calls invalidateQueries after success
      await updateStock(listing.id, Number(editQuantity));
      toast.success("Stock updated");
      closeEditModal();
      onEdit?.(listing);
    } catch (err: any) {
      // Rollback on error
      setOptimisticQuantity(previousQuantity);
      setEditQuantity(previousQuantity);
      toast.error(err?.response?.data?.message || "Failed to update stock");
    } finally {
      setSavingEdit(false);
    }
  }, [
    editQuantity,
    optimisticQuantity,
    listing.id,
    updateStock,
    closeEditModal,
    onEdit,
    listing,
  ]);

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        {/* Photo Section */}
        <div
          className="relative h-48 bg-gray-100 overflow-hidden cursor-pointer"
          onClick={() => onView(listing)}
        >
          {listing.photos && listing.photos.length > 0 ? (
            <div className="h-full w-full flex items-center justify-center">
              <img
                src={listing.photos[0]}
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
            className="absolute bg-black/60 text-white top-3 left-3"
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

          {/* ── Price & Stock Display ───────────────────────────────── */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b">
            <div>
              <p className="text-sm text-gray-500 line-through">
                ${(listing.originalPrice ?? 0).toFixed(2)}
              </p>
              <p className="text-green-600 font-semibold text-lg">
                ${(listing.salePrice ?? listing.price ?? 0).toFixed(2)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Available</p>
              <p className="font-medium text-lg">
                {optimisticQuantity} units
              </p>
              {listing.expiryDate && (
                <p className="text-xs text-gray-400">
                  Exp: {listing.expiryDate.split("T")[0]}
                </p>
              )}
            </div>
          </div>

          {/* ── Action Buttons ──────────────────────────────────────── */}
<div className="flex gap-2">
  {isRejected ? (
    <div className="w-full text-center text-sm text-red-500 font-medium py-2 bg-red-50 rounded-md border border-red-200">
      ✕ Rejected by admin — no actions available
    </div>
  ) : (
    <>
      <Button
        className="flex-1 bg-orange-400 hover:bg-orange-500 text-white"
        size="sm"
        onClick={openEditModal}
        disabled={isLoading}
      >
        Edit Stock
      </Button>
      <Button
        className="flex-1 bg-red-600 hover:bg-red-700 text-white"
        size="sm"
        onClick={() => onDelete(listing.id)}
        disabled={isLoading}
      >
        Delete
      </Button>
    </>
  )}
</div>    
        </CardContent>
      </Card>

      {/* ═══════════════════════════════════════════════════════════════
          EDIT MODAL — Quantity ONLY
         ═══════════════════════════════════════════════════════════════ */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm">
            {/* Header */}
            <div className="border-b px-6 py-4 flex items-center justify-between rounded-t-xl">
              <h2 className="text-lg font-semibold text-gray-900">
                Edit Stock
              </h2>
              <button
                onClick={closeEditModal}
                className="p-1 rounded-md hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Body — Quantity Only */}
            <div className="px-6 py-6">
              <div>
                <Label
                  htmlFor="edit-qty"
                  className="text-sm font-medium text-gray-700"
                >
                  Quantity (bags)
                </Label>
                <Input
                  id="edit-qty"
                  type="number"
                  min={0}
                  value={editQuantity}
                  onChange={(e) => setEditQuantity(Number(e.target.value))}
                  className="mt-1"
                  autoFocus
                />
              </div>
            </div>

            {/* Footer */}
            <div className="border-t px-6 py-4 flex gap-3 rounded-b-xl">
              <Button
                variant="outline"
                className="flex-1"
                onClick={closeEditModal}
                disabled={savingEdit}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                onClick={handleEditSubmit}
                disabled={savingEdit}
              >
                {savingEdit ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}