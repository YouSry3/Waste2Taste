import { FileText } from "lucide-react";
import { Card, CardContent } from "../../../ui/card";
import { ReportItem } from "../types";
import { ReportCard } from "./ReportCard";

interface ReportsListProps {
  reports: ReportItem[];
  response: string;
  onResponseChange: (value: string) => void;
  onSelectReport: (report: ReportItem) => void;
}

export function ReportsList({
  reports,
  response,
  onResponseChange,
  onSelectReport,
}: ReportsListProps) {
  return (
    <div className="space-y-4">
      {reports.length === 0 ? (
        <Card className="shadow-sm border-gray-200">
          <CardContent className="p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              No reports found matching your criteria
            </p>
          </CardContent>
        </Card>
      ) : (
        reports.map((report) => (
          <ReportCard
            key={report.id}
            report={report}
            response={response}
            onResponseChange={onResponseChange}
            onSelectReport={onSelectReport}
          />
        ))
      )}
    </div>
  );
}
