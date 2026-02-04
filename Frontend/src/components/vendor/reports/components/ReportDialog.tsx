import { CheckCircle2, Upload } from "lucide-react";
import { Badge } from "../../../ui/badge";
import { Button } from "../../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../ui/dialog";
import { Input } from "../../../ui/input";
import { Label } from "../../../ui/label";
import { Textarea } from "../../../ui/textarea";
import { ReportItem } from "../types";
import { getPriorityColor, getStatusColor } from "../utils/reportsUtils";

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  report: ReportItem;
  response: string;
  onResponseChange: (value: string) => void;
}

export function ReportDialog({
  open,
  onOpenChange,
  report,
  response,
  onResponseChange,
}: ReportDialogProps) {
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
              {report.priority.charAt(0).toUpperCase() +
                report.priority.slice(1)}{" "}
              Priority
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
            <div>
              <Label className="text-gray-500 text-xs font-medium">
                Customer
              </Label>
              <p className="text-gray-900 font-medium mt-1">
                {report.customer}
              </p>
            </div>
            <div>
              <Label className="text-gray-500 text-xs font-medium">Order ID</Label>
              <p className="text-gray-900 font-medium mt-1">
                {report.orderId}
              </p>
            </div>
            <div>
              <Label className="text-gray-500 text-xs font-medium">Listing</Label>
              <p className="text-gray-900 font-medium mt-1">
                {report.listing}
              </p>
            </div>
            <div>
              <Label className="text-gray-500 text-xs font-medium">
                Refund Amount
              </Label>
              <p className="text-gray-900 font-medium mt-1">
                EGP {report.refund}
              </p>
            </div>
            <div className="col-span-2">
              <Label className="text-gray-500 text-xs font-medium">
                Report Date
              </Label>
              <p className="text-gray-900 font-medium mt-1">{report.date}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-gray-700 font-semibold">Reason</Label>
              <p className="text-gray-900 mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                {report.reason}
              </p>
            </div>

            <div>
              <Label className="text-gray-700 font-semibold">
                Customer Description
              </Label>
              <p className="text-gray-700 mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                {report.description}
              </p>
            </div>
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

          {report.status !== "Resolved" && (
            <>
              <div className="space-y-4 pt-4 border-t">
                <div>
                  <Label htmlFor="response" className="text-gray-700 font-semibold">
                    Your Response
                  </Label>
                  <Textarea
                    id="response"
                    placeholder="Provide your response and any explanation to the customer..."
                    rows={5}
                    className="mt-2"
                    value={response}
                    onChange={(event) => onResponseChange(event.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Be professional and clear in your response. This will be sent
                    to the customer.
                  </p>
                </div>

                <div>
                  <Label htmlFor="proof" className="text-gray-700 font-semibold">
                    Upload Evidence (Optional)
                  </Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      Upload photos or documents to support your response (PNG,
                      JPG, PDF)
                    </p>
                    <Input
                      id="proof"
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      multiple
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t">
                <Button variant="outline" className="border-gray-300">
                  Save Draft
                </Button>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  Submit Response
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
