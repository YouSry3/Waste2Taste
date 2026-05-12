// src/components/admin/moderation/components/reports/ReportModeration.tsx
import React, { useMemo, useState } from "react";
import { Card, CardContent } from "../../../../ui/card";
import { AlertTriangle, Filter } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../ui/select";
import { ReportCard } from "./ReportCard";
import { ReportBulkActions } from "./ReportBulkActions";
import {
  useAllReports,
  useUpdateReportStatus,
} from "../../services/adminReportsService";
import toast from "react-hot-toast";

const ITEMS_PER_PAGE = 5;

export function ReportModeration() {
  const { data: reports = [], isLoading, refetch } = useAllReports();
  const { mutateAsync: updateStatus } = useUpdateReportStatus();

  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [page, setPage] = useState(1);

  const setLoading = (key: string, val: boolean) =>
    setLoadingStates((prev) => ({ ...prev, [key]: val }));

  const mapStatus = (s: string) => {
  const lower = (s ?? "").toLowerCase();
  if (lower === "resolved") return "resolved";
  if (lower === "dismissed") return "dismissed";
  if (lower === "pending" || lower === "underreview" || lower === "under_review" || lower === "inreview") return "under_review";
  return "under_review";
};

  // Normalize API reports into the shape ReportCard expects
  const adminReports = useMemo(
  () =>
    reports.map((r) => ({
      id: r.rawId,
      rawId: r.rawId,
      reporter: r.customer,
      orderId: r.orderId,
      vendor: r.vendor,
      listing: r.listing,
      issue: r.reason,
      description: r.description,
      status: mapStatus(r.status) as "under_review" | "resolved" | "dismissed",
      priority: r.priority
        ? (r.priority.charAt(0).toUpperCase() + r.priority.slice(1)) as
            | "High"
            | "Medium"
            | "Low"
        : "Low",
      submitted: r.date,
      refundAmount: r.refund,
    })),
  [reports]
);

  const filtered = useMemo(() => {
    if (statusFilter === "all") return adminReports;
    return adminReports.filter((r) => r.status === statusFilter);
  }, [adminReports, statusFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handleResolve = async (id: number | string) => {
    const sid = String(id);
    setLoading(`report-${sid}`, true);
    try {
      await updateStatus({ id: sid, status: "Resolved" });
      toast.success("Report marked as resolved");
      refetch();
    } catch {
      toast.error("Failed to resolve report");
    } finally {
      setLoading(`report-${sid}`, false);
    }
  };

  const handleDismiss = async (id: number | string) => {
    const sid = String(id);
    setLoading(`report-${sid}`, true);
    try {
      await updateStatus({ id: sid, status: "Dismissed" });
      toast.success("Report dismissed");
      refetch();
    } catch {
      toast.error("Failed to dismiss report");
    } finally {
      setLoading(`report-${sid}`, false);
    }
  };

  const handleBulkResolve = async () => {
    setLoading("bulk-resolve-reports", true);
    try {
      await Promise.all(
        selectedReports.map((id) => updateStatus({ id, status: "Resolved" }))
      );
      toast.success(`${selectedReports.length} reports resolved`);
      setSelectedReports([]);
      refetch();
    } catch {
      toast.error("Failed to resolve some reports");
    } finally {
      setLoading("bulk-resolve-reports", false);
    }
  };

  const handleBulkDismiss = async () => {
    setLoading("bulk-resolve-reports", true);
    try {
      await Promise.all(
        selectedReports.map((id) => updateStatus({ id, status: "Dismissed" }))
      );
      toast.success(`${selectedReports.length} reports dismissed`);
      setSelectedReports([]);
      refetch();
    } catch {
      toast.error("Failed to dismiss some reports");
    } finally {
      setLoading("bulk-resolve-reports", false);
    }
  };

  const handleSelect = (id: number | string, checked: boolean) => {
    const sid = String(id);
    setSelectedReports((prev) =>
      checked ? [...prev, sid] : prev.filter((r) => r !== sid)
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Header with Status Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 bg-white p-4 sm:p-6 rounded-lg">
        <div className="flex items-center gap-2 sm:gap-3">
          <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
          <span className="text-sm sm:text-base font-medium text-gray-700">Filter:</span>
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => {
            setStatusFilter(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-40 text-sm sm:text-base">
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

      {/* Bulk Actions */}
      {selectedReports.length > 0 && (
        <ReportBulkActions
          selectedCount={selectedReports.length}
          loading={!!loadingStates["bulk-resolve-reports"]}
          onResolveAll={handleBulkResolve}
          onDismissAll={handleBulkDismiss}
          onClearSelection={() => setSelectedReports([])}
        />
      )}

      {/* Reports List */}
      {paginated.length === 0 ? (
        <Card>
          <CardContent className="p-8 sm:p-12 text-center">
            <AlertTriangle className="h-10 sm:h-12 w-10 sm:w-12 text-gray-300 mx-auto mb-3 sm:mb-4" />
            <p className="text-sm sm:text-base text-gray-500">No customer reports found</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-3 sm:space-y-4">
            {paginated.map((report) => (
              <ReportCard
                key={report.id}
                report={report as any}
                isSelected={selectedReports.includes(String(report.id))}
                loadingStates={loadingStates}
                onSelect={handleSelect}
                onResolve={handleResolve}
                onDismiss={handleDismiss}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mt-6 sm:mt-8 p-4 sm:p-6 bg-white rounded-lg">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="w-full sm:w-auto px-3 sm:px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg flex items-center justify-center gap-1 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden xs:inline">Previous</span>
                <span className="inline xs:hidden">Back</span>
              </button>
              <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                Page <span className="font-semibold">{page}</span> of <span className="font-semibold">{totalPages}</span>
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages}
                className="w-full sm:w-auto px-3 sm:px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg flex items-center justify-center gap-1 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="hidden xs:inline">Next</span>
                <span className="inline xs:hidden">More</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}