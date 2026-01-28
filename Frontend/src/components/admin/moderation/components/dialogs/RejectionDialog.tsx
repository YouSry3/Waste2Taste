import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { XCircle, Loader2 } from "lucide-react";

interface RejectionDialogProps {
  open: boolean;
  type: "listing" | "vendor";
  rejectionReason: string;
  rejectionNotes: string;
  loading: boolean;
  onOpenChange: (open: boolean) => void;
  onRejectionReasonChange: (value: string) => void;
  onRejectionNotesChange: (value: string) => void;
  onConfirm: (reason: string, notes: string) => void; // Updated to accept parameters
}

export function RejectionDialog({
  open,
  type,
  rejectionReason,
  rejectionNotes,
  loading,
  onOpenChange,
  onRejectionReasonChange,
  onRejectionNotesChange,
  onConfirm,
}: RejectionDialogProps) {
  const handleConfirm = () => {
    if (!rejectionReason) return;
    onConfirm(rejectionReason, rejectionNotes || "");
  };

  const getReasonText = (reason: string): string => {
    switch (reason) {
      case "quality":
        return type === "listing" ? "Quality concerns" : "Quality concerns";
      case "spoiled":
        return "Food appears spoiled";
      case "misleading":
        return type === "listing"
          ? "Misleading description"
          : "Misleading information";
      case "pricing":
        return "Pricing violation";
      case "documents":
        return "Incomplete documents";
      case "verification":
        return "Failed verification";
      case "policy":
        return "Policy violation";
      case "other":
        return "Other";
      default:
        return reason;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <DialogTitle className="text-red-600">
              Reject {type === "listing" ? "Listing" : "Vendor"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-gray-600">
            Please provide a reason for rejection. The{" "}
            {type === "listing" ? "vendor" : "applicant"} will be notified.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Rejection Reason <span className="text-red-500">*</span>
            </label>
            <Select
              onValueChange={onRejectionReasonChange}
              value={rejectionReason}
            >
              <SelectTrigger className="w-full border-gray-300 focus:ring-red-500 focus:border-red-500">
                <SelectValue placeholder="Select rejection reason" />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border rounded-md shadow-lg z-50">
                {type === "listing" ? (
                  <>
                    <SelectItem value="quality">Quality concerns</SelectItem>
                    <SelectItem value="spoiled">
                      Food appears spoiled
                    </SelectItem>
                    <SelectItem value="misleading">
                      Misleading description
                    </SelectItem>
                    <SelectItem value="pricing">Pricing violation</SelectItem>
                    <SelectItem value="policy">Policy violation</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="documents">
                      Incomplete documents
                    </SelectItem>
                    <SelectItem value="verification">
                      Failed verification
                    </SelectItem>
                    <SelectItem value="business">
                      Business information issues
                    </SelectItem>
                    <SelectItem value="policy">Policy violation</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Additional Details
              <span className="text-gray-400 text-xs ml-1">(Optional)</span>
            </label>
            <Textarea
              placeholder={
                type === "listing"
                  ? "Provide specific details about the quality issues, misleading content, or other concerns..."
                  : "Provide specific details about document issues, verification problems, or other concerns..."
              }
              rows={4}
              value={rejectionNotes}
              onChange={(e) => onRejectionNotesChange(e.target.value)}
              className="border-gray-300 focus:ring-red-500 focus:border-red-500 resize-none"
            />
            <p className="text-xs text-gray-500">
              These notes will be included in the activity log.
            </p>
          </div>

          {rejectionReason && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm font-medium text-red-700 mb-1">Summary:</p>
              <p className="text-sm text-red-600">
                You are rejecting this {type} because:{" "}
                <span className="font-semibold">
                  {getReasonText(rejectionReason)}
                </span>
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="flex-1 px-4 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!rejectionReason || loading}
              className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Rejecting...
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4" />
                  Confirm Rejection
                </>
              )}
            </button>
          </div>

          <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
            <p>
              This action cannot be undone. The {type} will be marked as
              rejected and moved to the rejected section. An entry will be added
              to the activity log.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
