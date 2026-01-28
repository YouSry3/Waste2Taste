import React from "react";
import { Card, CardContent } from "../../../../ui/card";
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
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

interface ListingBulkActionsProps {
  selectedCount: number;
  loading: boolean;
  onApproveAll: () => void;
  onRejectAll: () => void;
  onClearSelection: () => void;
}

export function ListingBulkActions({
  selectedCount,
  loading,
  onApproveAll,
  onRejectAll,
  onClearSelection,
}: ListingBulkActionsProps) {
  return (
    <Card className="border-2 border-orange-300 bg-orange-50">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <span className="text-sm font-medium text-gray-700">
            {selectedCount} listing(s) selected
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={onApproveAll}
              disabled={loading}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Approving...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Approve All
                </>
              )}
            </button>

            {/* Destructive Action - Reject All */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  <XCircle className="h-4 w-4" />
                  Reject All
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Reject {selectedCount} listings?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This will reject all selected listings. Vendors will be
                    notified. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={onRejectAll}
                  >
                    Reject All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <button
              onClick={onClearSelection}
              className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
            >
              Clear Selection
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
