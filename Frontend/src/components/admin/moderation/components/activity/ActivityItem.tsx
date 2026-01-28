import React from "react";
import { ModerationAction } from "../../types";
import { Badge } from "../../../../ui/badge";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Flag,
  Eye,
  MessageSquare,
  Package,
  Store,
} from "lucide-react";

interface ActivityItemProps {
  action: ModerationAction;
  onViewDetails: () => void;
}

export function ActivityItem({ action, onViewDetails }: ActivityItemProps) {
  // Safe access to properties with fallbacks
  const moderatorName = action.moderatorName || action.moderator || "Moderator";
  const actionType = action.type || action.action || "action";
  const itemType = action.itemType || action.targetType || "item";
  const itemTitle = action.itemTitle || action.targetName || "Item";
  const notes = action.notes || "";
  const timestamp = action.timestamp || new Date().toISOString();

  const getActionIcon = () => {
    const type = actionType.toLowerCase();

    if (
      type.includes("approve") ||
      type.includes("resolution") ||
      type === "approved"
    ) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    }

    if (
      type.includes("reject") ||
      type.includes("dismissal") ||
      type === "rejected"
    ) {
      return <XCircle className="h-4 w-4 text-red-600" />;
    }

    if (type.includes("warning") || type.includes("alert")) {
      return <AlertTriangle className="h-4 w-4 text-orange-600" />;
    }

    if (type.includes("change") || type.includes("request")) {
      return <MessageSquare className="h-4 w-4 text-blue-600" />;
    }

    // Item type specific icons
    if (itemType === "listing") {
      return <Package className="h-4 w-4 text-purple-600" />;
    }

    if (itemType === "vendor") {
      return <Store className="h-4 w-4 text-indigo-600" />;
    }

    return <Flag className="h-4 w-4 text-blue-600" />;
  };

  const getActionColor = () => {
    const type = actionType.toLowerCase();

    if (
      type.includes("approve") ||
      type.includes("resolution") ||
      type === "approved"
    ) {
      return "bg-green-100 text-green-800 border-green-200";
    }

    if (
      type.includes("reject") ||
      type.includes("dismissal") ||
      type === "rejected"
    ) {
      return "bg-red-100 text-red-800 border-red-200";
    }

    if (type.includes("warning") || type.includes("alert")) {
      return "bg-orange-100 text-orange-800 border-orange-200";
    }

    if (type.includes("change") || type.includes("request")) {
      return "bg-blue-100 text-blue-800 border-blue-200";
    }

    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getActionText = () => {
    const type = actionType;

    // Handle old format
    if (typeof type === "string") {
      return type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    }

    return "Action";
  };

  const getItemTypeText = () => {
    if (typeof itemType === "string") {
      return itemType.charAt(0).toUpperCase() + itemType.slice(1);
    }

    return "Item";
  };

  return (
    <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
      <div className="flex items-start gap-4 flex-1">
        <div className={`p-2 rounded-full ${getActionColor().split(" ")[0]}`}>
          {getActionIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-medium text-gray-900 text-sm">
              {moderatorName}
            </span>
            <Badge variant="outline" className={`text-xs ${getActionColor()}`}>
              {getActionText()}
            </Badge>
            <Badge
              variant="outline"
              className="text-xs bg-gray-100 text-gray-700 border-gray-300"
            >
              {getItemTypeText()}
            </Badge>
          </div>
          <p className="text-sm text-gray-800 mb-1 font-medium truncate">
            {itemTitle}
          </p>

          {/* Show details if available */}
          {action.details && (
            <p className="text-sm text-gray-600 mb-1 line-clamp-2">
              {action.details}
            </p>
          )}

          {/* Show status change if available */}
          {action.beforeStatus && action.afterStatus && (
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              <span className="font-medium">Status:</span>
              <span className="px-2 py-0.5 bg-gray-100 rounded">
                {action.beforeStatus}
              </span>
              <span className="text-gray-400">→</span>
              <span
                className={`px-2 py-0.5 rounded ${
                  action.afterStatus === "approved" ||
                  action.afterStatus === "resolved"
                    ? "bg-green-100 text-green-800"
                    : action.afterStatus === "rejected" ||
                        action.afterStatus === "dismissed"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                }`}
              >
                {action.afterStatus}
              </span>
            </div>
          )}

          {notes && (
            <div className="mt-2">
              <p className="text-xs text-gray-500 font-medium mb-1">Notes:</p>
              <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded border border-gray-200">
                {notes}
              </p>
            </div>
          )}

          <p className="text-xs text-gray-400 mt-2">
            {new Date(timestamp).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
      <button
        onClick={onViewDetails}
        className="px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg flex items-center gap-2 ml-4 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 border border-gray-300 shadow-sm hover:shadow"
      >
        <Eye className="h-4 w-4" />
        <span className="hidden sm:inline">View</span>
      </button>
    </div>
  );
}
