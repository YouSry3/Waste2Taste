import React from "react";
import { CustomerReport } from "../../types";
import { ReportCard } from "./ReportCard";
import { ReportBulkActions } from "./ReportBulkActions";
import { Card, CardContent } from "../../../../ui/card";
import { AlertTriangle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../ui/select";
import { Filter } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ReportModerationProps {
  reports: CustomerReport[];
  filteredReports: CustomerReport[];
  paginatedReports: CustomerReport[];
  selectedReports: number[];
  loadingStates: { [key: string]: boolean };
  statusFilter: string;
  priorityFilter: string;
  totalReportsPages: number;
  reportsPage: number;
  onSelectReport: (id: number, checked: boolean) => void;
  onResolveReport: (id: number) => void;
  onDismissReport: (id: number) => void;
  onBulkResolveReports: () => void;
  onBulkDismissReports: () => void;
  onClearSelection: () => void;
  onStatusFilterChange: (value: string) => void;
  onPriorityFilterChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onContactCustomer: (report: CustomerReport) => void;
  onContactVendor: (report: CustomerReport) => void;
  onIssueWarning: (report: CustomerReport) => void;
}

export function ReportModeration({
  reports,
  filteredReports,
  paginatedReports,
  selectedReports,
  loadingStates,
  statusFilter,
  priorityFilter,
  totalReportsPages,
  reportsPage,
  onSelectReport,
  onResolveReport,
  onDismissReport,
  onBulkResolveReports,
  onBulkDismissReports,
  onClearSelection,
  onStatusFilterChange,
  onPriorityFilterChange,
  onPageChange,
  onContactCustomer,
  onContactVendor,
  onIssueWarning,
}: ReportModerationProps) {
  return (
    <div className="space-y-4">
      {/* Status Filter */}
      <div className="flex items-center gap-3">
        <Filter className="h-4 w-4 text-gray-500" />
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Report Status" />
          </SelectTrigger>
          <SelectContent className="bg-background border border-border rounded-md shadow-lg z-50">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="under_review">Under Review</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="dismissed">Dismissed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bulk Actions Bar for Reports */}
      {selectedReports.length > 0 && (
        <ReportBulkActions
          selectedCount={selectedReports.length}
          loading={loadingStates["bulk-resolve-reports"]}
          onResolveAll={onBulkResolveReports}
          onDismissAll={onBulkDismissReports}
          onClearSelection={onClearSelection}
        />
      )}

      {paginatedReports.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <AlertTriangle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No customer reports found</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {paginatedReports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              isSelected={selectedReports.includes(report.id)}
              loadingStates={loadingStates}
              onSelect={onSelectReport}
              onResolve={onResolveReport}
              onDismiss={onDismissReport}
              onContactCustomer={onContactCustomer}
              onContactVendor={onContactVendor}
              onIssueWarning={onIssueWarning}
            />
          ))}

          {/* Pagination */}
          {totalReportsPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => onPageChange(Math.max(1, reportsPage - 1))}
                disabled={reportsPage === 1}
                className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              <span className="text-sm text-gray-600 px-4">
                Page {reportsPage} of {totalReportsPages}
              </span>
              <button
                onClick={() => onPageChange(reportsPage + 1)}
                disabled={reportsPage >= totalReportsPages}
                className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
