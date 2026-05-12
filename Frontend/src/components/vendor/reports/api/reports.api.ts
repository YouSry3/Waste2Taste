// src/components/vendor/reports/api/reports.api.ts
import { vendorApiClient } from "../../../../services/vendor/vendorDashboardApi";

export interface ApiReport {
  id: string;
  reportCode: string;
  customerName: string;
  listingName: string;
  issueType: string;
  status: string;
  priority: string;
  refundAmount?: number;
  createdAt: string;
  responseCount: number;
}

export interface ReportStatsOverview {
  total: number;
  pending: number;
  underReview: number;
  resolved: number;
}

const normalizeStatus = (status: string): "Pending Response" | "Under Review" | "Resolved" => {
  const s = (status ?? "").toLowerCase().replace(/[_\s]/g, "");
  if (s === "resolved") return "Resolved";
  if (s === "underreview" || s === "inreview" || s === "review") return "Under Review";
  return "Pending Response";
};

const normalizePriority = (priority: string): "high" | "medium" | "low" => {
  const p = (priority ?? "").toLowerCase();
  if (p === "high") return "high";
  if (p === "medium") return "medium";
  return "low";
};

export const mapApiReport = (item: ApiReport) => ({
  id: item.reportCode ?? item.id ?? "",
  rawId: item.id,
  customer: item.customerName ?? "Unknown",
  orderId: `ORD-${item.id?.slice(0, 6).toUpperCase()}`,
  listing: item.listingName ?? "Unknown",
  reason: item.issueType ?? "Issue",
  description: "",
  status: normalizeStatus(item.status),
  date: item.createdAt
    ? new Date(item.createdAt).toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "",
  refund: item.refundAmount ?? 0,
  priority: normalizePriority(item.priority),
  responseCount: item.responseCount ?? 0,
});

export const reportsApi = {
  // Vendor: get their reports
  getVendorReports: async () => {
    const res = await vendorApiClient.get("/Reports/vendor");
    const raw = res.data;
    const items: ApiReport[] = Array.isArray(raw)
      ? raw
      : raw?.value ?? raw?.data ?? raw?.items ?? [];
    return items.map(mapApiReport);
  },

  // Admin: get all reports
  getAllReports: async () => {
    const res = await vendorApiClient.get("/Reports");
    const raw = res.data;
    const items: ApiReport[] = Array.isArray(raw)
      ? raw
      : raw?.value ?? raw?.data ?? raw?.items ?? [];
    return items.map(mapApiReport);
  },

  // Admin: get report stats
  getReportStats: async (): Promise<ReportStatsOverview> => {
    try {
      const res = await vendorApiClient.get("/Reports/stats/overview");
      const raw = res.data?.value ?? res.data?.data ?? res.data;
      return {
        total: Number(raw?.total ?? raw?.totalReports ?? 0),
        pending: Number(raw?.pending ?? raw?.pendingCount ?? 0),
        underReview: Number(raw?.underReview ?? raw?.inReview ?? raw?.reviewCount ?? 0),
        resolved: Number(raw?.resolved ?? raw?.resolvedCount ?? 0),
      };
    } catch {
      return { total: 0, pending: 0, underReview: 0, resolved: 0 };
    }
  },

  // Admin: search/filter reports
  searchReports: async (status?: string, search?: string) => {
    const params: Record<string, string> = {};
    if (status && status !== "all") params.status = status;
    if (search) params.search = search;
    const res = await vendorApiClient.get("/Reports/search/filtered", { params });
    const raw = res.data;
    const items: ApiReport[] = Array.isArray(raw)
      ? raw
      : raw?.value ?? raw?.data ?? raw?.items ?? [];
    return items.map(mapApiReport);
  },

  // Admin: update report status
  updateReportStatus: async (
    id: string,
    payload: { status: string; refundAmount?: number; adminNotes?: string }
  ) => {
    const res = await vendorApiClient.put(`/Reports/${id}/status`, payload);
    return res.data;
  },

  // Vendor + Admin: add response to report
  addResponse: async (id: string, message: string, attachmentUrl?: string) => {
  console.log("🔍 Submitting response to report ID:", id);  // ← ADD THIS
  const res = await vendorApiClient.post(`/Reports/${id}/response`, {
    reportId: id,
    message,
    attachmentUrl: attachmentUrl ?? "",
  });
  return res.data;
},
  
};