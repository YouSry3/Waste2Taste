import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../../ui/dialog";
import { Textarea } from "../../../../ui/textarea";
import { MessageSquare, Loader2 } from "lucide-react";

interface ChangeRequestDialogProps {
  open: boolean;
  changeRequest: string;
  loading: boolean;
  onOpenChange: (open: boolean) => void;
  onChangeRequestChange: (value: string) => void;
  onConfirm: () => void;
}

export function ChangeRequestDialog({
  open,
  changeRequest,
  loading,
  onOpenChange,
  onChangeRequestChange,
  onConfirm,
}: ChangeRequestDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Changes</DialogTitle>
          <DialogDescription>
            Specify what needs to be changed for approval
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Textarea
            placeholder="Describe what needs to be changed (e.g., 'Please update the pickup time to be after 5 PM' or 'Add more details about the food items included')..."
            rows={4}
            value={changeRequest}
            onChange={(e) => onChangeRequestChange(e.target.value)}
          />
          <button
            onClick={onConfirm}
            disabled={!changeRequest || loading}
            className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors duration-200"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <MessageSquare className="h-4 w-4" />
                Send to Vendor
              </>
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
