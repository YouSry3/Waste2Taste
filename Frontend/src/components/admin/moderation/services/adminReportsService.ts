// src/components/admin/moderation/services/adminReportsService.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../../../services/api/apiClient";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ApiReport {
  id: string;
  rawId: string;
  customer: string;
  orderId: string;
  vendor: string;
  listing: string;
  reason: string;
  description: string;
  status: string;
  priority: string;
  date: string;
  refund: number;
}

// ─── Mapper ───────────────────────────────────────────────────────────────────

const mapReport = (r: any): ApiReport => ({
  id: r.reportCode ?? r.id ?? "",
  rawId: r.id ?? "",
  customer: r.customerName ?? "Unknown",
  orderId: r.reportCode ?? r.id ?? "—",
  vendor: r.vendorName ?? "—",
description: r.description ?? "—",                         // not returned by API
  listing: r.listingName ?? "—",
  reason: r.issueType ?? "—",
  status: r.status ?? "Pending",
  priority: r.priority ?? "Low",
  date: r.createdAt
    ? new Date(r.createdAt).toLocaleDateString()
    : "—",
  refund: Number(r.refundAmount ?? 0),
});

// ─── Hooks ────────────────────────────────────────────────────────────────────

/** GET /Reports — admin only */
export const useAllReports = () =>
  useQuery<ApiReport[]>({
    queryKey: ["adminReports"],
    queryFn: async () => {
      const res = await apiClient.get("/Reports");
      const payload = res.data;
      let raw: any[] = [];

      if (Array.isArray(payload)) raw = payload;
      else if (Array.isArray(payload?.value)) raw = payload.value;
      else if (Array.isArray(payload?.data)) raw = payload.data;
      else if (Array.isArray(payload?.items)) raw = payload.items;
      else {
        console.warn("Unexpected /Reports response shape:", payload);
      }
console.log("🔍 Raw report sample:", raw[0]);
      return raw.map(mapReport);
    },
  });

/** GET /Reports/stats/overview */
export const useReportStats = () =>
  useQuery({
    queryKey: ["adminReportStats"],
    queryFn: async () => {
      const res = await apiClient.get("/Reports/stats/overview");
      return res.data?.value ?? res.data ?? {};
    },
  });

/** PUT /Reports/{id}/status — resolve or dismiss */
export const useUpdateReportStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
      notes,
      refundAmount,
    }: {
      id: string;
      status: string;
      notes?: string;
      refundAmount?: number;
    }) => {
      const res = await apiClient.put(`/Reports/${id}/status`, {
        status,
        notes: notes ?? "",
        refundAmount: refundAmount ?? 0,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminReports"] });
      queryClient.invalidateQueries({ queryKey: ["adminReportStats"] });
    },
  });
};

/** POST /Reports/{id}/response — admin responds to a report */
export const useAddResponse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      message,
      attachmentUrl,
    }: {
      id: string;
      message: string;
      attachmentUrl?: string;
    }) => {
      console.log("🔍 Sending response to report:", id);
      const res = await apiClient.post(`/Reports/${id}/response`, {
        reportId: id,
        message,
        attachmentUrl: attachmentUrl ?? "",
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminReports"] });
    },
  });
};