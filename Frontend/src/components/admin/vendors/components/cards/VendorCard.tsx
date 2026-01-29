import { Card, CardContent } from "../../../../ui/card";
import { Badge } from "../../../../ui/badge";
import { Button } from "../../../../ui/button";
import { Mail, Phone, MapPin, Store, Heart } from "lucide-react";
import { Vendor } from "../../api/vendors.types";
import { BadgeStatus } from "../ui/BadgeStatus";
import { ContactInfo } from "../ui/ContactInfo";

interface VendorCardProps {
  vendor: Vendor;
  onViewDetails: () => void;
  onToggleStatus: () => void;
}

export function VendorCard({
  vendor,
  onViewDetails,
  onToggleStatus,
}: VendorCardProps) {
  return (
    <Card key={vendor.id} className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between mb-4">
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
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-lg truncate">{vendor.name}</h4>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="text-xs" variant="outline">
                  {vendor.category}
                </Badge>
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-yellow-500">★</span>
                  <span className="font-medium">{vendor.rating}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <BadgeStatus status={vendor.status} onClick={onToggleStatus} />
          </div>
        </div>

        <ContactInfo
          email={vendor.email}
          phone={vendor.phone}
          address={vendor.address}
        />

        <div className="flex gap-4 mb-4 text-sm">
          <div>
            <span className="text-gray-500">Listings:</span>{" "}
            <span className="font-semibold">
              {vendor.type === "Vendor" ? vendor.listings : "N/A"}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Revenue:</span>{" "}
            <span
              className={`font-semibold ${vendor.type === "Vendor" ? "text-green-600" : "text-gray-500"}`}
            >
              {vendor.type === "Vendor" ? vendor.revenue : "Non-Profit"}
            </span>
          </div>
        </div>

        <Button
          className="w-full border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700"
          onClick={onViewDetails}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}
