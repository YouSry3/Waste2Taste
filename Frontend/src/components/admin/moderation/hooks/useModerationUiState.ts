import { useState } from "react";
import toast from "react-hot-toast";

export function useModerationUiState() {
  const [loadingStates, setLoadingStates] = useState<{
    [key: string]: boolean;
  }>({});
  const [rejectionDialog, setRejectionDialog] = useState({
    open: false,
    id: 0,
    type: "listing" as "listing" | "vendor",
  });
  const [changeRequestDialog, setChangeRequestDialog] = useState({
    open: false,
    id: 0,
  });
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionNotes, setRejectionNotes] = useState("");
  const [changeRequest, setChangeRequest] = useState("");

  const setLoading = (key: string, value: boolean) => {
    setLoadingStates((prev) => ({ ...prev, [key]: value }));
  };

  return {
    loadingStates,
    rejectionDialog,
    changeRequestDialog,
    rejectionReason,
    rejectionNotes,
    changeRequest,
    setRejectionDialog,
    setChangeRequestDialog,
    setRejectionReason,
    setRejectionNotes,
    setChangeRequest,
    setLoading,
    handleContactCustomer: (report: any) => {
      const subject = `Regarding your report for order ${report.orderId}`;
      const body = `Dear ${report.reporter},\n\nWe are following up on your report regarding ${report.listing} from ${report.vendor}.\n\nPlease provide any additional details if needed.\n\nBest regards,\nModeration Team`;
      const mailtoLink = `mailto:customer@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(mailtoLink, "_blank");
      toast.success(`Opening email client to contact ${report.reporter}`);
    },
    handleContactVendor: (report: any) => {
      const subject = `Customer Report: Order ${report.orderId}`;
      const body = `Dear ${report.vendor},\n\nWe have received a report regarding order ${report.orderId} for ${report.listing}.\n\nIssue: ${report.issue}\nDescription: ${report.description}\n\nPlease review and respond within 24 hours.\n\nBest regards,\nModeration Team`;
      const mailtoLink = `mailto:vendor@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(mailtoLink, "_blank");
      toast.success(`Opening email client to contact ${report.vendor}`);
    },
  };
}
