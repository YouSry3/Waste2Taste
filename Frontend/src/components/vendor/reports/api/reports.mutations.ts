// src/components/vendor/reports/api/reports.mutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reportsApi } from "./reports.api";
import { reportQueryKeys } from "./reports.queries";

export const useAddResponse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      message,
      attachmentUrl,
    }: {
      id: string;
      message: string;
      attachmentUrl?: string;
    }) => reportsApi.addResponse(id, message, attachmentUrl),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: reportQueryKeys.vendor });
      qc.invalidateQueries({ queryKey: reportQueryKeys.admin });
    },
  });
};

export const useUpdateReportStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
      refundAmount,
      adminNotes,
    }: {
      id: string;
      status: string;
      refundAmount?: number;
      adminNotes?: string;
    }) => reportsApi.updateReportStatus(id, { status, refundAmount, adminNotes }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: reportQueryKeys.admin });
      qc.invalidateQueries({ queryKey: reportQueryKeys.stats });
    },
  });
};