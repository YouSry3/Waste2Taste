// src/components/vendor/reports/index.tsx
import { useMemo, useState } from "react";
import { ReportsFilters } from "./components/ReportsFilters";
import { ReportsHeader } from "./components/ReportsHeader";
import { ReportsList } from "./components/ReportsList";
import { ReportsStats } from "./components/ReportStats";
import { ReportStatus, ReportItem } from "./types";
import { useVendorReports } from "./api/reports.queries";

export function Reports() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<ReportStatus | "all">("all");
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);

  const { data: reports = [], isLoading, error, refetch } = useVendorReports();

  const pendingCount = reports.filter((r) => r.status === "Pending Response").length;
  const reviewCount = reports.filter((r) => r.status === "Under Review").length;
  const resolvedCount = reports.filter((r) => r.status === "Resolved").length;

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        report.id.toLowerCase().includes(q) ||
        report.customer.toLowerCase().includes(q) ||
        report.orderId.toLowerCase().includes(q) ||
        report.listing.toLowerCase().includes(q);
      const matchesFilter =
        filterStatus === "all" || report.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [reports, searchQuery, filterStatus]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 mb-2">Failed to load reports</p>
        <button onClick={() => refetch()} className="text-sm text-green-600 underline">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <ReportsHeader />
      <ReportsStats
        pendingCount={pendingCount}
        reviewCount={reviewCount}
        resolvedCount={resolvedCount}
        totalReports={reports.length}
      />
      <ReportsFilters
        searchQuery={searchQuery}
        filterStatus={filterStatus}
        onSearchChange={setSearchQuery}
        onFilterChange={setFilterStatus}
      />
      <ReportsList
        reports={filteredReports}
        onSelectReport={setSelectedReport}
      />
    </div>
  );
}