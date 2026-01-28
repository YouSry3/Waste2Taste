import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../../ui/dialog";
import { Badge } from "../../../../ui/badge";
import toast from "react-hot-toast";
import { ModerationAction } from "../../types";

interface ActivityDetailsDialogProps {
  open: boolean;
  selectedActivity: ModerationAction | null;
  onOpenChange: (open: boolean) => void;
}

export function ActivityDetailsDialog({
  open,
  selectedActivity,
  onOpenChange,
}: ActivityDetailsDialogProps) {
  const handleCopyDetails = () => {
    if (selectedActivity) {
      navigator.clipboard.writeText(JSON.stringify(selectedActivity, null, 2));
      toast.success("Activity details copied to clipboard");
    }
  };

  // Helper functions with safe access
  const getActionText = () => {
    if (!selectedActivity) return "Action";

    if (selectedActivity.type) {
      return selectedActivity.type
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
    }

    if (selectedActivity.action) {
      return selectedActivity.action
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
    }

    return "Action";
  };

  const getActionVariant = () => {
    if (!selectedActivity) return "outline";

    const action = selectedActivity.action || selectedActivity.type || "";

    if (
      action.includes("approval") ||
      action.includes("approved") ||
      action.includes("resolution")
    ) {
      return "default";
    }

    if (
      action.includes("rejection") ||
      action.includes("rejected") ||
      action.includes("dismissal")
    ) {
      return "destructive";
    }

    if (action.includes("warning")) {
      return "secondary";
    }

    if (action.includes("change")) {
      return "outline";
    }

    return "outline";
  };

  const getModeratorName = () => {
    if (!selectedActivity) return "Unknown";
    return (
      selectedActivity.moderatorName ||
      selectedActivity.moderator ||
      "Moderator"
    );
  };

  const getItemType = () => {
    if (!selectedActivity) return "Unknown";
    return selectedActivity.itemType || selectedActivity.targetType || "Item";
  };

  const getItemTitle = () => {
    if (!selectedActivity) return "No title";
    return (
      selectedActivity.itemTitle || selectedActivity.targetName || "Untitled"
    );
  };

  const getTimestamp = () => {
    if (!selectedActivity || !selectedActivity.timestamp) return "Unknown";

    try {
      return new Date(selectedActivity.timestamp).toLocaleString();
    } catch (error) {
      return selectedActivity.timestamp;
    }
  };

  const getNotes = () => {
    if (!selectedActivity) return "";
    return selectedActivity.notes || "";
  };

  const getDetails = () => {
    if (!selectedActivity) return null;
    return selectedActivity.details || selectedActivity.detailsObj || null;
  };

  if (!selectedActivity) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Activity Details</DialogTitle>
            <DialogDescription>No activity selected</DialogDescription>
          </DialogHeader>
          <div className="py-8 text-center text-gray-500">
            <p>Select an activity to view details</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const details = getDetails();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Activity Details</DialogTitle>
          <DialogDescription>
            Complete details of this moderation action
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Moderator</p>
              <p className="text-sm text-gray-900 font-medium">
                {getModeratorName()}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Action</p>
              <Badge variant={getActionVariant()} className="capitalize ">
                {getActionText()}
              </Badge>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Item Type</p>
              <p className="text-sm text-gray-900 capitalize">
                {getItemType()}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Timestamp</p>
              <p className="text-sm text-gray-900">{getTimestamp()}</p>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Item</p>
            <p className="text-sm text-gray-900 font-medium">
              {getItemTitle()}
            </p>
          </div>

          {/* Show main details if available */}
          {selectedActivity.details && (
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Details</p>
              <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200">
                {selectedActivity.details}
              </p>
            </div>
          )}

          {/* Show status change if available */}
          {selectedActivity.beforeStatus && selectedActivity.afterStatus && (
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Status Change</p>
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="outline" className="bg-gray-100">
                  {selectedActivity.beforeStatus}
                </Badge>
                <span className="text-gray-400">→</span>
                <Badge
                  variant={
                    selectedActivity.afterStatus === "approved" ||
                    selectedActivity.afterStatus === "resolved"
                      ? "default"
                      : selectedActivity.afterStatus === "rejected" ||
                          selectedActivity.afterStatus === "dismissed"
                        ? "destructive"
                        : "outline"
                  }
                >
                  {selectedActivity.afterStatus}
                </Badge>
              </div>
            </div>
          )}

          {getNotes() && (
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Notes</p>
              <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200 whitespace-pre-wrap">
                {getNotes()}
              </p>
            </div>
          )}

          {details && (
            <div className="border-t pt-4">
              <p className="text-sm font-medium text-gray-500 mb-3">
                Additional Details
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                {/* Warning Level */}
                {details.warningLevel && (
                  <div className="flex items-center justify-between p-2 bg-orange-50 rounded border border-orange-200">
                    <span className="text-gray-700">Warning Level:</span>
                    <Badge variant="secondary" className="capitalize">
                      {details.warningLevel}
                    </Badge>
                  </div>
                )}

                {/* Follow-up Required */}
                {details.followUpRequired !== undefined && (
                  <div className="flex items-center justify-between p-2 bg-blue-50 rounded border border-blue-200">
                    <span className="text-gray-700">Follow-up Required:</span>
                    <Badge
                      variant={
                        details.followUpRequired ? "destructive" : "outline"
                      }
                    >
                      {details.followUpRequired ? "Yes" : "No"}
                    </Badge>
                  </div>
                )}

                {/* Vendor Email */}
                {details.vendorEmail && (
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200">
                    <span className="text-gray-700">Vendor Email:</span>
                    <span className="text-gray-900 font-medium truncate max-w-[200px]">
                      {details.vendorEmail}
                    </span>
                  </div>
                )}

                {/* Customer Email */}
                {details.customerEmail && (
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200">
                    <span className="text-gray-700">Customer Email:</span>
                    <span className="text-gray-900 font-medium truncate max-w-[200px]">
                      {details.customerEmail}
                    </span>
                  </div>
                )}

                {/* Item ID */}
                {details.itemId && (
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200">
                    <span className="text-gray-700">Item ID:</span>
                    <span className="text-gray-900 font-medium">
                      #{details.itemId}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Documents if available */}
          {selectedActivity.documents &&
            selectedActivity.documents.length > 0 && (
              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-500 mb-2">
                  Documents
                </p>
                <div className="space-y-1">
                  {selectedActivity.documents.map((doc, index) => (
                    <div
                      key={index}
                      className="text-sm text-gray-700 bg-gray-50 p-2 rounded border border-gray-200"
                    >
                      📄 {doc}
                    </div>
                  ))}
                </div>
              </div>
            )}

          <div className="flex justify-end gap-2 pt-6 border-t">
            <button
              onClick={() => onOpenChange(false)}
              className="px-4 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
            >
              Close
            </button>
            <button
              onClick={handleCopyDetails}
              className="px-4 py-2.5 bg-gray-900 hover:bg-black text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 transition-colors duration-200"
            >
              Copy Details (JSON)
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
