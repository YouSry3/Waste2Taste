import React from "react";
import { ModerationAction } from "../../types";
import { ActivityItem } from "./ActivityItem";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../ui/select";
import { Filter, Clock, Trash2 } from "lucide-react";

interface ActivityLogProps {
  activityLog: ModerationAction[];
  sortBy: string;
  onSortByChange: (value: string) => void;
  onClearActivityLog: () => void;
  onViewActivityDetails: (action: ModerationAction) => void;
}

export function ActivityLog({
  activityLog,
  sortBy,
  onSortByChange,
  onClearActivityLog,
  onViewActivityDetails,
}: ActivityLogProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select value={sortBy} onValueChange={onSortByChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-background border border-border rounded-md shadow-lg z-50">
              <SelectItem value="date">Newest First</SelectItem>
              <SelectItem value="action">Action Type</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Destructive Action - Clear Log (Red with outline for permanent destructive) */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="px-4 py-2 border border-red-300 bg-white text-red-600 hover:bg-red-50 font-medium rounded-lg flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200">
              <Trash2 className="h-4 w-4" />
              Clear Log
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear Activity Log?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete all activity logs. This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={onClearActivityLog}
              >
                Clear Log
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Moderation Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {activityLog.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                No activity yet. Start moderating to see logs here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {activityLog.map((action) => (
                <ActivityItem
                  key={action.id}
                  action={action}
                  onViewDetails={() => onViewActivityDetails(action)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
