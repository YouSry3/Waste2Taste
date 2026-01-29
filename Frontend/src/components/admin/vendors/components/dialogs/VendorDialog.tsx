import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../../ui/dialog";
import { Button } from "../../../../ui/button";
import { Badge } from "../../../../ui/badge";
import { Mail, Phone, MapPin, Store, Heart, Edit, Trash2 } from "lucide-react";
import { Vendor } from "../../api/vendors.types";
import { BadgeStatus } from "../ui/BadgeStatus";

interface VendorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  vendor: Vendor | null;
  onToggleStatus: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function VendorDialog({
  isOpen,
  onClose,
  vendor,
  onToggleStatus,
  onEdit,
  onDelete,
}: VendorDialogProps) {
  if (!vendor) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Vendor Details</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex gap-3 flex-1">
              <div
                className={`p-3 rounded-lg ${vendor.type === "NGO Partner" ? "bg-pink-100" : "bg-blue-100"}`}
              >
                {vendor.type === "NGO Partner" ? (
                  <Heart className="text-pink-600 h-6 w-6" />
                ) : (
                  <Store className="text-blue-600 h-6 w-6" />
                )}
              </div>
              <div>
                <h4 className="text-lg font-semibold">{vendor.name}</h4>
                <p className="text-sm text-gray-600">
                  {vendor.type} – {vendor.category}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Contact: {vendor.contact}
                </p>
              </div>
            </div>
            <BadgeStatus status={vendor.status} onClick={onToggleStatus} />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-yellow-500">★</span>
            <span className="font-semibold">{vendor.rating}</span>
            <span className="text-gray-500 text-sm">rating</span>
          </div>

          <hr className="border-gray-200" />

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <a
                  href={`mailto:${vendor.email}`}
                  className="text-sm hover:text-green-600"
                >
                  {vendor.email}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <a
                  href={`tel:${vendor.phone}`}
                  className="text-sm hover:text-green-600"
                >
                  {vendor.phone}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Address</p>
                <p className="text-sm">{vendor.address}</p>
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {vendor.type === "Vendor" ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Active Listings</p>
                <p className="text-lg font-semibold">{vendor.listings}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Revenue</p>
                <p className="text-lg font-semibold text-green-600">
                  {vendor.revenue}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-pink-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700">
                This NGO receives donated surplus food from vendors.
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              className="flex-1 border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700"
              onClick={onEdit}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              className="flex-1 border-red-600 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
