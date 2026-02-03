import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../../ui/dialog";
import { Badge } from "../../../../ui/badge";
import { Button } from "../../../../ui/button";
import toast from "react-hot-toast";
import { ModerationAction } from "../../types";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  User,
  Calendar,
  FileText,
  Mail,
  Hash,
  ArrowRight,
  Copy,
  X as CloseIcon,
} from "lucide-react";

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

  const getActionConfig = () => {
    if (!selectedActivity)
      return { variant: "outline", color: "gray", icon: Clock };

    const action = selectedActivity.action || selectedActivity.type || "";

    if (
      action.includes("approval") ||
      action.includes("approved") ||
      action.includes("resolution")
    ) {
      return {
        variant: "default",
        color: "green",
        bgClass: "bg-green-50",
        borderClass: "border-green-200",
        textClass: "text-green-700",
        icon: CheckCircle,
      };
    }

    if (
      action.includes("rejection") ||
      action.includes("rejected") ||
      action.includes("dismissal")
    ) {
      return {
        variant: "destructive",
        color: "red",
        bgClass: "bg-red-50",
        borderClass: "border-red-200",
        textClass: "text-red-700",
        icon: XCircle,
      };
    }

    if (action.includes("warning")) {
      return {
        variant: "secondary",
        color: "orange",
        bgClass: "bg-orange-50",
        borderClass: "border-orange-200",
        textClass: "text-orange-700",
        icon: AlertTriangle,
      };
    }

    return {
      variant: "outline",
      color: "blue",
      bgClass: "bg-blue-50",
      borderClass: "border-blue-200",
      textClass: "text-blue-700",
      icon: Clock,
    };
  };

  const getStatusBadgeConfig = (status: string) => {
    const statusLower = status.toLowerCase();

    if (
      statusLower.includes("approved") ||
      statusLower.includes("resolved") ||
      statusLower.includes("active")
    ) {
      return {
        variant: "default" as const,
        className: "bg-green-100 text-green-800 border-green-300",
      };
    }

    if (
      statusLower.includes("rejected") ||
      statusLower.includes("dismissed") ||
      statusLower.includes("banned")
    ) {
      return {
        variant: "destructive" as const,
        className: "bg-red-100 text-red-800 border-red-300",
      };
    }

    if (statusLower.includes("pending") || statusLower.includes("review")) {
      return {
        variant: "secondary" as const,
        className: "bg-yellow-100 text-yellow-800 border-yellow-300",
      };
    }

    return {
      variant: "outline" as const,
      className: "bg-gray-100 text-gray-800 border-gray-300",
    };
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
            <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>Select an activity to view details</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const details = getDetails();
  const actionConfig = getActionConfig();
  const ActionIcon = actionConfig.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b  z-10">
          <DialogTitle className="text-2xl">Activity Details</DialogTitle>
          <DialogDescription className="mt-1">
            Complete information about this moderation action
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Action Type Banner */}
          <div
            className={`${actionConfig.bgClass} ${actionConfig.borderClass} border-2 rounded-xl p-4`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-3 rounded-full bg-white ${actionConfig.borderClass} border-2`}
              >
                <ActionIcon className={`h-6 w-6 ${actionConfig.textClass}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Action Type</p>
                <p
                  className={`text-xl font-bold ${actionConfig.textClass} capitalize`}
                >
                  {getActionText()}
                </p>
              </div>
            </div>
          </div>

          {/* Key Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Moderator */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-purple-600" />
                <p className="text-sm font-medium text-purple-900">Moderator</p>
              </div>
              <p className="text-lg font-semibold text-purple-700">
                {getModeratorName()}
              </p>
            </div>

            {/* Timestamp */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <p className="text-sm font-medium text-blue-900">Date & Time</p>
              </div>
              <p className="text-lg font-semibold text-blue-700">
                {getTimestamp()}
              </p>
            </div>

            {/* Item Type */}
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-2 border-indigo-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-indigo-600" />
                <p className="text-sm font-medium text-indigo-900">Item Type</p>
              </div>
              <p className="text-lg font-semibold text-indigo-700 capitalize">
                {getItemType()}
              </p>
            </div>

            {/* Item Title */}
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 border-2 border-teal-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Hash className="h-4 w-4 text-teal-600" />
                <p className="text-sm font-medium text-teal-900">Item</p>
              </div>
              <p className="text-lg font-semibold text-teal-700 truncate">
                {getItemTitle()}
              </p>
            </div>
          </div>

          {/* Status Change */}
          {selectedActivity.beforeStatus && selectedActivity.afterStatus && (
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <ArrowRight className="h-5 w-5 text-gray-600" />
                <p className="text-sm font-semibold text-gray-700">
                  Status Change
                </p>
              </div>
              <div className="flex items-center justify-center gap-4">
                <Badge
                  {...getStatusBadgeConfig(selectedActivity.beforeStatus)}
                  className="text-base px-4 py-2 font-semibold"
                >
                  {selectedActivity.beforeStatus}
                </Badge>
                <ArrowRight className="h-6 w-6 text-gray-400" />
                <Badge
                  {...getStatusBadgeConfig(selectedActivity.afterStatus)}
                  className="text-base px-4 py-2 font-semibold"
                >
                  {selectedActivity.afterStatus}
                </Badge>
              </div>
            </div>
          )}

          {/* Main Details */}
          {selectedActivity.details && (
            <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-amber-900 mb-2">
                Details
              </p>
              <p className="text-sm text-amber-800 leading-relaxed">
                {selectedActivity.details}
              </p>
            </div>
          )}

          {/* Notes */}
          {getNotes() && (
           <></>
          )}

          {/* Additional Details */}
          {details && (
            <div className="border-2 border-gray-200 rounded-xl p-5 bg-white">
              <p className="text-base font-bold text-gray-900 mb-4">
                Additional Information
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Warning Level */}
                {details.warningLevel && (
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border-2 border-orange-300">
                    <span className="text-sm font-medium text-orange-900 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Warning Level
                    </span>
                    <Badge
                      variant="secondary"
                      className="capitalize font-semibold bg-orange-200 text-orange-900 border-orange-400"
                    >
                      {details.warningLevel}
                    </Badge>
                  </div>
                )}

                {/* Follow-up Required */}
                {details.followUpRequired !== undefined && (
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border-2 border-blue-300">
                    <span className="text-sm font-medium text-blue-900 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Follow-up Required
                    </span>
                    <Badge
                      className={`font-semibold ${
                        details.followUpRequired
                          ? "bg-red-200 text-red-900 border-red-400"
                          : "bg-green-200 text-green-900 border-green-400"
                      }`}
                    >
                      {details.followUpRequired ? "Yes" : "No"}
                    </Badge>
                  </div>
                )}

                {/* Vendor Email */}
                {details.vendorEmail && (
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-violet-50 to-violet-100 rounded-lg border-2 border-violet-300">
                    <span className="text-sm font-medium text-violet-900 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Vendor Email
                    </span>
                    <span className="text-sm text-violet-700 font-medium truncate max-w-[200px]">
                      {details.vendorEmail}
                    </span>
                  </div>
                )}

                {/* Customer Email */}
                {details.customerEmail && (
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-cyan-50 to-cyan-100 rounded-lg border-2 border-cyan-300">
                    <span className="text-sm font-medium text-cyan-900 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Customer Email
                    </span>
                    <span className="text-sm text-cyan-700 font-medium truncate max-w-[200px]">
                      {details.customerEmail}
                    </span>
                  </div>
                )}

                {/* Item ID */}
                {details.itemId && (
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg border-2 border-emerald-300">
                    <span className="text-sm font-medium text-emerald-900 flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      Item ID
                    </span>
                    <span className="text-sm text-emerald-700 font-semibold">
                      #{details.itemId}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Documents */}
          {selectedActivity.documents &&
            selectedActivity.documents.length > 0 && (
              <div className="border-2 border-gray-200 rounded-xl p-5 bg-white">
                <p className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Attached Documents
                </p>
                <div className="space-y-2">
                  {selectedActivity.documents.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 text-sm bg-gradient-to-r from-gray-50 to-slate-50 p-3 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-colors"
                    >
                      <FileText className="h-4 w-4 text-gray-600 flex-shrink-0" />
                      <span className="text-gray-800 font-medium">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t-2 border-gray-200">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="px-6 py-2.5 font-semibold hover:bg-gray-100"
          >
            Close
          </Button>
          <Button
            onClick={handleCopyDetails}
            className="px-6 py-2.5 bg-gradient-to-r from-gray-900 to-black hover:from-black hover:to-gray-900 text-white font-semibold shadow-lg"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Details
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
