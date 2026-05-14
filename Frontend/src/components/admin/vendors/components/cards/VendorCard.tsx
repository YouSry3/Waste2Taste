import { Card, CardContent } from "../../../../ui/card";
import { Badge } from "../../../../ui/badge";
import { Button } from "../../../../ui/button";
import { Store, Heart, ShieldOff, ShieldCheck, Loader2 } from "lucide-react";
import { Vendor } from "../../api/vendors.types";
import { BadgeStatus } from "../ui/BadgeStatus";
import { ContactInfo } from "../ui/ContactInfo";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../../ui/alert-dialog";

interface VendorCardProps {
  vendor: Vendor;
  onViewDetails: () => void;
  onToggleStatus: () => void;
  onToggleBlock: () => void;
  isBlocking?: boolean;
}

export function VendorCard({
  vendor,
  onViewDetails,
  onToggleStatus,
  onToggleBlock,
  isBlocking = false,
}: VendorCardProps) {
  const isBlocked = !!vendor.isBlocked;

  return (
    <Card
      className={`hover:shadow-lg transition-shadow ${isBlocked ? "border-red-300 bg-red-50/30" : ""}`}  >
      
      <CardContent className="p-6">
        {/* Blocked banner */}
        {isBlocked && (
          <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-red-100 border border-red-200 rounded-lg text-red-700 text-sm font-medium">
            <ShieldOff className="h-4 w-4" />
            This vendor is currently blocked
          </div>
        )}

        <div className="flex justify-between mb-4">
          <div className="flex gap-3 flex-1">
            <div
              className={`p-3 rounded-lg ${
                vendor.type === "NGO Partner" ? "bg-pink-100" : "bg-blue-100"
              }`}
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
                  {/* <span className="text-yellow-500">★</span>  */}
                  <div className="flex items-center gap-1 text-sm">
  {vendor.rating === 0 ? (
    <span className="text-xs text-gray-400 italic">Not rated yet</span>
  ) : (
    <>
      <span className="text-yellow-500">★</span>
      <span className="font-medium">{vendor.rating.toFixed(1)}</span>
    </>
  )}
</div>
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
            
          </div>
          <div>
            <span className="text-gray-500">Revenue:</span>{" "}
            <span
              className={`font-semibold ${
                vendor.type === "Vendor" ? "text-green-600" : "text-gray-500"
              }`}
            >
              {vendor.type === "Vendor" ? vendor.revenue : "Non-Profit"}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button
            className="flex-1 border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700"
            variant="outline"
            onClick={onViewDetails}
          >
            View Details
          </Button>

          {/* Block / Unblock */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                disabled={isBlocking}
                className={
                  isBlocked
                    ? "border-green-600 text-green-600 hover:bg-green-50"
                    : "border-red-500 text-red-600 hover:bg-red-50"
                }
              >
                {isBlocking ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isBlocked ? (
                  <>
                    <ShieldCheck className="h-4 w-4 mr-1" />
                    Unblock
                  </>
                ) : (
                  <>
                    <ShieldOff className="h-4 w-4 mr-1" />
                    Block
                  </>
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {isBlocked ? "Unblock" : "Block"} {vendor.name}?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {isBlocked
                    ? `This will restore ${vendor.name}'s access to the platform. They will be able to log in and manage their listings again.`
                    : `This will prevent ${vendor.name} from logging in or accessing the platform. Their listings will remain but they won't be able to manage them.`}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onToggleBlock}
                  className={
                    isBlocked
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-red-600 hover:bg-red-700 text-white"
                  }
                >
                  {isBlocked ? "Unblock Vendor" : "Block Vendor"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}