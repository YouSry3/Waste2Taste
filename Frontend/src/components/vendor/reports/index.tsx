import { useMemo, useState } from "react";
import { reports } from "./constants/reportsData";
import { ReportsFilters } from "./components/ReportsFilters";
import { ReportsHeader } from "./components/ReportsHeader";
import { ReportsList } from "./components/ReportsList";
import { ReportsStats } from "./components/ReportsStats";
import { ReportStatus } from "./types";

export function Reports() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<ReportStatus | "all">("all");
  const [response, setResponse] = useState("");

  const pendingCount = reports.filter(
    (item) => item.status === "Pending Response",
  ).length;
  const reviewCount = reports.filter(
    (item) => item.status === "Under Review",
  ).length;
  const resolvedCount = reports.filter(
    (item) => item.status === "Resolved",
  ).length;
  const totalReports = reports.length;

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesSearch =
        report.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.listing.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter =
        filterStatus === "all" || report.status === filterStatus;

      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, filterStatus]);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <ReportsHeader />

      <ReportsStats
        pendingCount={pendingCount}
        reviewCount={reviewCount}
        resolvedCount={resolvedCount}
        totalReports={totalReports}
      />

      <ReportsFilters
        searchQuery={searchQuery}
        filterStatus={filterStatus}
        onSearchChange={setSearchQuery}
        onFilterChange={setFilterStatus}
      />

      <ReportsList
        reports={filteredReports}
        response={response}
        onResponseChange={setResponse}
        onSelectReport={() => undefined}
      />
    </div>
  );
}
