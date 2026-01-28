import { useState } from "react";
import toast from "react-hot-toast";
import { useModerationData } from "./useModerationData";
import { ModerationAction, ModerationActionType } from "../types";

export function useModerationActions() {
  const {
    listings,
    setListings,
    vendorRequests,
    setVendorRequests,
    customerReports,
    setCustomerReports,
    addToActivityLog,
  } = useModerationData();

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

  // Helper function to create consistent activity log entries
  const createActivityLog = (
    type: ModerationActionType,
    targetType: "listing" | "vendor" | "report",
    targetId: number | string,
    targetName: string,
    details: string,
    beforeStatus: string,
    afterStatus: string,
    notes?: string,
    documents?: string[],
  ): ModerationAction => {
    return {
      id: Date.now(),
      type,
      targetType,
      targetId,
      targetName,
      moderator: "Admin",
      details,
      beforeStatus,
      afterStatus,
      timestamp: new Date().toISOString(),
      notes,
      documents,
      // Keep old fields for compatibility
      moderatorName: "Admin",
      action:
        type === "approval" ||
        type === "vendor_approval" ||
        type === "resolution"
          ? "approved"
          : type === "rejection" ||
              type === "vendor_rejection" ||
              type === "dismissal"
            ? "rejected"
            : type === "changes_requested"
              ? "requested_changes"
              : "issued_warning",
      itemType: targetType,
      itemTitle: targetName,
      detailsObj: {
        itemId: typeof targetId === "number" ? targetId : 0,
        vendorEmail: targetType === "vendor" ? "vendor@example.com" : undefined,
      },
    };
  };

  // Vendor Actions (with removal from list)
  const handleApproveVendor = async (id: number) => {
    const vendor = vendorRequests.find((v) => v.id === id);
    if (!vendor) return;

    setLoading(`vendor-${id}`, true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Remove vendor from list
      setVendorRequests((prev) => prev.filter((v) => v.id !== id));

      // Add to activity log with new format
      const activityLog = createActivityLog(
        "vendor_approval",
        "vendor",
        id,
        vendor.businessName,
        `Approved vendor "${vendor.businessName}" owned by ${vendor.ownerName}`,
        vendor.status,
        "approved",
        "Vendor application approved",
        vendor.documents,
      );
      addToActivityLog(activityLog);

      toast.success(
        `Vendor Approved: ${vendor.businessName} has been approved and can now create listings.`,
      );
    } catch (error) {
      toast.error("Failed to approve vendor");
    } finally {
      setLoading(`vendor-${id}`, false);
    }
  };

  const handleRejectVendor = async (
    id: number,
    reason: string,
    notes: string,
  ) => {
    const vendor = vendorRequests.find((v) => v.id === id);
    if (!vendor) return;

    setLoading(`vendor-${id}`, true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Remove vendor from list
      setVendorRequests((prev) => prev.filter((v) => v.id !== id));

      // Add to activity log with new format
      const activityLog = createActivityLog(
        "vendor_rejection",
        "vendor",
        id,
        vendor.businessName,
        `Rejected vendor "${vendor.businessName}" owned by ${vendor.ownerName}`,
        vendor.status,
        "rejected",
        `Reason: ${reason}. ${notes}`,
        vendor.documents,
      );
      addToActivityLog(activityLog);

      toast.error(
        `Vendor Rejected: ${vendor.businessName} application has been rejected.`,
      );
    } catch (error) {
      toast.error("Failed to reject vendor");
    } finally {
      setLoading(`vendor-${id}`, false);
    }
  };

  // Bulk vendor actions
  const handleBulkApproveVendors = async (selectedVendors: number[]) => {
    setLoading("bulk-approve-vendors", true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Get vendor details before removing
      const vendorsToApprove = vendorRequests.filter((v) =>
        selectedVendors.includes(v.id),
      );

      // Remove all selected vendors from list
      setVendorRequests((prev) =>
        prev.filter((v) => !selectedVendors.includes(v.id)),
      );

      // Add to activity log for each vendor
      vendorsToApprove.forEach((vendor) => {
        const activityLog = createActivityLog(
          "vendor_approval",
          "vendor",
          vendor.id,
          vendor.businessName,
          `Approved vendor "${vendor.businessName}" in bulk operation`,
          vendor.status,
          "approved",
          "Bulk vendor approval",
          vendor.documents,
        );
        addToActivityLog(activityLog);
      });

      // Also add a summary bulk action log
      const bulkActivityLog = createActivityLog(
        "bulk_approval",
        "vendor",
        selectedVendors.join(","),
        `${selectedVendors.length} vendors`,
        `Approved ${selectedVendors.length} vendor applications in bulk`,
        "pending",
        "approved",
        `Vendor IDs: ${selectedVendors.join(", ")}`,
      );
      addToActivityLog(bulkActivityLog);

      toast.success(
        `Bulk Approval Complete: ${selectedVendors.length} vendors have been approved.`,
      );

      return selectedVendors;
    } catch (error) {
      toast.error("Failed to bulk approve vendors");
      return [];
    } finally {
      setLoading("bulk-approve-vendors", false);
    }
  };

  const handleBulkRejectVendors = async (selectedVendors: number[]) => {
    setLoading("bulk-reject-vendors", true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Get vendor details before removing
      const vendorsToReject = vendorRequests.filter((v) =>
        selectedVendors.includes(v.id),
      );

      // Remove all selected vendors from list
      setVendorRequests((prev) =>
        prev.filter((v) => !selectedVendors.includes(v.id)),
      );

      // Add to activity log for each vendor
      vendorsToReject.forEach((vendor) => {
        const activityLog = createActivityLog(
          "vendor_rejection",
          "vendor",
          vendor.id,
          vendor.businessName,
          `Rejected vendor "${vendor.businessName}" in bulk operation`,
          vendor.status,
          "rejected",
          "Bulk vendor rejection",
          vendor.documents,
        );
        addToActivityLog(activityLog);
      });

      // Also add a summary bulk action log
      const bulkActivityLog = createActivityLog(
        "bulk_rejection",
        "vendor",
        selectedVendors.join(","),
        `${selectedVendors.length} vendors`,
        `Rejected ${selectedVendors.length} vendor applications in bulk`,
        "pending",
        "rejected",
        `Vendor IDs: ${selectedVendors.join(", ")}`,
      );
      addToActivityLog(bulkActivityLog);

      toast.error(
        `Bulk Rejection Complete: ${selectedVendors.length} vendors have been rejected.`,
      );

      return selectedVendors;
    } catch (error) {
      toast.error("Failed to bulk reject vendors");
      return [];
    } finally {
      setLoading("bulk-reject-vendors", false);
    }
  };

  // Listing Actions
  const handleApproveListing = async (id: number) => {
    const listing = listings.find((l) => l.id === id);
    if (!listing) return;

    setLoading(`listing-${id}`, true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setListings((prev) =>
        prev.map((l) =>
          l.id === id ? { ...l, status: "approved" as const } : l,
        ),
      );

      // Add to activity log with new format
      const activityLog = createActivityLog(
        "approval",
        "listing",
        id,
        listing.title,
        `Approved listing "${listing.title}" by ${listing.vendor}`,
        listing.status,
        "approved",
        "Listing approved for publication",
      );
      addToActivityLog(activityLog);

      toast.success(
        `Listing Approved: "${listing.title}" has been published successfully.`,
      );
    } catch (error) {
      toast.error("Failed to approve listing");
    } finally {
      setLoading(`listing-${id}`, false);
    }
  };

  const handleRejectListing = async (
    id: number,
    reason: string,
    notes: string,
  ) => {
    const listing = listings.find((l) => l.id === id);
    if (!listing) return;

    setLoading(`listing-${id}`, true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setListings((prev) =>
        prev.map((l) =>
          l.id === id ? { ...l, status: "rejected" as const } : l,
        ),
      );

      // Add to activity log with new format
      const activityLog = createActivityLog(
        "rejection",
        "listing",
        id,
        listing.title,
        `Rejected listing "${listing.title}" by ${listing.vendor}`,
        listing.status,
        "rejected",
        `Reason: ${reason}. ${notes}`,
      );
      addToActivityLog(activityLog);

      toast.error(
        `Listing Rejected: "${listing.title}" has been rejected. Vendor will be notified.`,
      );
    } catch (error) {
      toast.error("Failed to reject listing");
    } finally {
      setLoading(`listing-${id}`, false);
    }
  };

  // Report Actions
  const handleResolveReport = async (id: number) => {
    const report = customerReports.find((r) => r.id === id);
    if (!report) return;

    setLoading(`report-${id}`, true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setCustomerReports((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status: "resolved" as const } : r,
        ),
      );

      // Add to activity log with new format
      const activityLog = createActivityLog(
        "resolution",
        "report",
        id,
        report.vendor,
        `Resolved report against "${report.vendor}" regarding order ${report.orderId}`,
        report.status,
        "resolved",
        report.issue,
      );
      addToActivityLog(activityLog);

      toast.success(
        `Report Resolved: Report ${report.orderId} has been marked as resolved.`,
      );
    } catch (error) {
      toast.error("Failed to resolve report");
    } finally {
      setLoading(`report-${id}`, false);
    }
  };

  const handleDismissReport = async (id: number) => {
    const report = customerReports.find((r) => r.id === id);
    if (!report) return;

    setLoading(`dismiss-report-${id}`, true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setCustomerReports((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status: "dismissed" as const } : r,
        ),
      );

      // Add to activity log with new format
      const activityLog = createActivityLog(
        "dismissal",
        "report",
        id,
        report.vendor,
        `Dismissed report against "${report.vendor}" regarding order ${report.orderId}`,
        report.status,
        "dismissed",
        "Report dismissed as invalid",
      );
      addToActivityLog(activityLog);

      toast.success(`Report ${report.orderId} has been dismissed`);
    } catch (error) {
      toast.error("Failed to dismiss report");
    } finally {
      setLoading(`dismiss-report-${id}`, false);
    }
  };

  // Change Request Handler
  const handleRequestChanges = async (id: number, changes: string) => {
    const listing = listings.find((l) => l.id === id);
    if (!listing) return;

    setLoading(`listing-${id}`, true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setListings((prev) =>
        prev.map((l) =>
          l.id === id ? { ...l, status: "changes_requested" as const } : l,
        ),
      );

      // Add to activity log with new format
      const activityLog = createActivityLog(
        "changes_requested",
        "listing",
        id,
        listing.title,
        `Requested changes for listing "${listing.title}" by ${listing.vendor}`,
        listing.status,
        "changes_requested",
        changes,
      );
      addToActivityLog(activityLog);

      toast.success(
        `Changes Requested: Vendor has been notified about required changes for "${listing.title}".`,
      );
    } catch (error) {
      toast.error("Failed to request changes");
    } finally {
      setLoading(`listing-${id}`, false);
    }
  };

  return {
    // State
    loadingStates,
    rejectionDialog,
    changeRequestDialog,
    rejectionReason,
    rejectionNotes,
    changeRequest,

    // Setters
    setRejectionDialog,
    setChangeRequestDialog,
    setRejectionReason,
    setRejectionNotes,
    setChangeRequest,
    setLoading,

    // Actions
    handleApproveVendor,
    handleRejectVendor,
    handleBulkApproveVendors,
    handleBulkRejectVendors,
    handleApproveListing,
    handleRejectListing,
    handleResolveReport,
    handleDismissReport,
    handleRequestChanges,

    // Helper functions
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
