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

interface ReportBulkActionsProps {
  selectedCount: number;
  loading: boolean;
  onResolveAll: () => void;
  onDismissAll: () => void;
  onClearSelection: () => void;
}

export function ReportBulkActions({
  selectedCount,
  loading,
  onResolveAll,
  onDismissAll,
  onClearSelection,
}: ReportBulkActionsProps) {
  return (
    <Card className="border-2 border-orange-300 bg-orange-50">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:gap-6">
          <span className="text-sm sm:text-base font-medium text-gray-700">
            {selectedCount} report{selectedCount !== 1 ? 's' : ''} selected
          </span>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 flex-wrap">
            <button
              onClick={onResolveAll}
              disabled={loading}
              className="px-3 sm:px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm font-medium rounded-lg flex items-center justify-center sm:justify-start gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="hidden xs:inline">Resolving...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  <span className="hidden xs:inline">Resolve All</span>
                  <span className="inline xs:hidden">Resolve</span>
                </>
              )}
            </button>

          

            <button
              onClick={onClearSelection}
              className="px-3 sm:px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs sm:text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
            >
              <span className="hidden xs:inline">Clear Selection</span>
              <span className="inline xs:hidden">Clear</span>
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
