import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../ui/select";
import { Textarea } from "../../../../ui/textarea";
import { AlertTriangle, Loader2 } from "lucide-react";

interface WarningDialogProps {
  open: boolean;
  selectedReport: any;
  warningType: string;
  warningDetails: string;
  loading: boolean;
  onOpenChange: (open: boolean) => void;
  onWarningTypeChange: (value: string) => void;
  onWarningDetailsChange: (value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export function WarningDialog({
  open,
  selectedReport,
  warningType,
  warningDetails,
  loading,
  onOpenChange,
  onWarningTypeChange,
  onWarningDetailsChange,
  onConfirm,
  onCancel,
}: WarningDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Issue Vendor Warning</DialogTitle>
          <DialogDescription>
            Issue a formal warning to {selectedReport?.vendor} regarding report
            #{selectedReport?.orderId}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Warning Type</p>
            <Select value={warningType} onValueChange={onWarningTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select warning type" />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border rounded-md shadow-lg z-50">
                <SelectItem value="informal">Informal Warning</SelectItem>
                <SelectItem value="formal">Formal Warning</SelectItem>
                <SelectItem value="final">Final Warning</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              {warningType === "informal" &&
                "A reminder about platform policies. No penalties applied."}
              {warningType === "formal" &&
                "Official warning. May affect vendor rating. Recorded in vendor history."}
              {warningType === "final" &&
                "Final warning before potential account suspension. Requires follow-up."}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Warning Details</p>
            <Textarea
              placeholder="Describe the issue and required corrective actions..."
              rows={4}
              value={warningDetails}
              onChange={(e) => onWarningDetailsChange(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              This message will be sent to the vendor and recorded in the
              activity log.
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800 mb-1">
                  Warning Implications
                </p>
                <ul className="text-xs text-yellow-700 space-y-1">
                  <li>• Vendor will receive notification of this warning</li>
                  <li>
                    • Warning will be recorded in vendor's account history
                  </li>
                  <li>• Multiple warnings may lead to account suspension</li>
                  <li>• Vendor rating may be affected</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
            style={{ backgroundColor: "#dc2626" }}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Issuing Warning...
              </>
            ) : (
              <>
                <AlertTriangle className="h-4 w-4" />
                Issue{" "}
                {warningType.charAt(0).toUpperCase() +
                  warningType.slice(1)}{" "}
                Warning
              </>
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
