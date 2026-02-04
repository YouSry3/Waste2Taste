import { useState } from "react";
import { AlertCircle, CheckCircle2, Clock, Eye } from "lucide-react";
import { Badge } from "../../../ui/badge";
import { Button } from "../../../ui/button";
import { Card, CardContent } from "../../../ui/card";
import { ReportItem } from "../types";
import { getPriorityColor, getStatusColor } from "../utils/reportsUtils";
import { ReportDialog } from "./ReportDialog";

interface ReportCardProps {
  report: ReportItem;
  response: string;
  onResponseChange: (value: string) => void;
  onSelectReport: (report: ReportItem) => void;
}

export function ReportCard({
  report,
  response,
  onResponseChange,
  onSelectReport,
}: ReportCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="shadow-sm border-gray-200 hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {report.id}
              </h3>
              <Badge className={`${getStatusColor(report.status)} border`}>
                {report.status}
              </Badge>
              <Badge className={`${getPriorityColor(report.priority)} border`}>
                {report.priority.charAt(0).toUpperCase() +
                  report.priority.slice(1)}{" "}
                Priority
              </Badge>
            </div>
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {report.date}
            </p>
          </div>

          <Button
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={() => {
              onSelectReport(report);
              setIsOpen(true);
            }}
          >
            <Eye className="w-4 h-4 mr-2" />
            View & Respond
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Customer</p>
            <p className="text-sm font-medium text-gray-900">
              {report.customer}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Order</p>
            <p className="text-sm font-medium text-gray-900">
              {report.orderId}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Listing</p>
            <p className="text-sm font-medium text-gray-900">
              {report.listing}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Refund</p>
            <p className="text-sm font-medium text-gray-900">
              EGP {report.refund}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {report.reason}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {report.description}
              </p>
            </div>
          </div>
        </div>

        {report.resolution && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-green-800">{report.resolution}</p>
            </div>
          </div>
        )}

        <ReportDialog
          open={isOpen}
          onOpenChange={setIsOpen}
          report={report}
          response={response}
          onResponseChange={onResponseChange}
        />
      </CardContent>
    </Card>
  );
}
