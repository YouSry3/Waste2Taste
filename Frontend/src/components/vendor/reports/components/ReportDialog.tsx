// src/components/vendor/reports/components/ReportDialog.tsx
import { CheckCircle2, MessageSquare } from "lucide-react";
import { Badge } from "../../../ui/badge";
import { Button } from "../../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../ui/dialog";
import { Label } from "../../../ui/label";
import { ReportItem } from "../types";
import { getPriorityColor, getStatusColor } from "../utils/reportsUtils";

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  report: ReportItem;
}

export function ReportDialog({ open, onOpenChange, report }: ReportDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Report Details - {report.id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Badge className={`${getStatusColor(report.status)} border text-sm py-1`}>
              {report.status}
            </Badge>
            <Badge className={`${getPriorityColor(report.priority)} border text-sm py-1`}>
              {report.priority.charAt(0).toUpperCase() + report.priority.slice(1)} Priority
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
            <div>
              <Label className="text-gray-500 text-xs font-medium">Customer</Label>
              <p className="text-gray-900 font-medium mt-1">{report.customer}</p>
            </div>
            <div>
              <Label className="text-gray-500 text-xs font-medium">Order ID</Label>
              <p className="text-gray-900 font-medium mt-1">{report.orderId}</p>
            </div>
            <div>
              <Label className="text-gray-500 text-xs font-medium">Listing</Label>
              <p className="text-gray-900 font-medium mt-1">{report.listing}</p>
            </div>
            {/* <div>
              <Label className="text-gray-500 text-xs font-medium">Refund Amount</Label>
              <p className="text-gray-900 font-medium mt-1">EGP {report.refund}</p>
            </div> */}
            <div className="col-span-2">
              <Label className="text-gray-500 text-xs font-medium">Report Date</Label>
              <p className="text-gray-900 font-medium mt-1">{report.date}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-gray-700 font-semibold">Issue Type</Label>
              <p className="text-gray-900 mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                {report.reason}
              </p>
            </div>

            {report.description && (
              <div>
                <Label className="text-gray-700 font-semibold">Customer Description</Label>
                <p className="text-gray-700 mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  {report.description}
                </p>
              </div>
            )}
          </div>

          {report.resolution && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <Label className="text-green-800 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Resolution
              </Label>
              <p className="text-green-900 mt-2">{report.resolution}</p>
            </div>
          )}

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
            <MessageSquare className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-800">
              This report is being reviewed by our admin team.
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}