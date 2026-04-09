import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Listing,
  VendorRequest,
  CustomerReport,
  ModerationAction,
  RejectRequest,
  ChangeRequest,
  WarningRequest,
  initialPendingListings,
  initialVendorRequests,
  initialCustomerReports,
} from "../types";
import toast from "react-hot-toast";
import {
  getStoredVendorRequests,
  subscribeToVendorApprovalStore,
  updateVendorApprovalStatus,
} from "../../../../services/vendorApproval/vendorApprovalStore";
import { VendorApprovalRequest } from "../../../../types/vendorApproval";

function mapStoredVendorRequest(request: VendorApprovalRequest): VendorRequest {
  return {
    id: request.id,
    businessName: request.businessName,
    ownerName: request.ownerName,
    email: request.email,
    phone: request.phone,
    address: request.address,
    category: request.category,
    submitted: request.submitted,
    documents: request.documents,
    status: request.status,
    notes: request.notes,
  };
}

function getInitialVendorRequestState() {
  const storedRequests = getStoredVendorRequests().map(mapStoredVendorRequest);
  return [...storedRequests, ...initialVendorRequests];
}

// Keep local state for now (will be replaced with queries when backend is ready)
export function useModerationData() {
  const [listings, setListings] = useState<Listing[]>(initialPendingListings);
  const [vendorRequests, setVendorRequests] = useState<VendorRequest[]>(() =>
    getInitialVendorRequestState(),
  );
  const [customerReports, setCustomerReports] = useState<CustomerReport[]>(
    initialCustomerReports,
  );
  const [activityLog, setActivityLog] = useState<ModerationAction[]>([]);

  // For future API integration - initialize but don't use yet
  const queryClient = useQueryClient();

  useEffect(() => {
    const syncVendorRequests = () => {
      setVendorRequests(getInitialVendorRequestState());
    };

    syncVendorRequests();
    return subscribeToVendorApprovalStore(syncVendorRequests);
  }, []);

  const addToActivityLog = (action: Omit<ModerationAction, "id">) => {
    const newAction: ModerationAction = {
      ...action,
      id: activityLog.length + 1,
    };
    setActivityLog([newAction, ...activityLog]);
  };

  // Mock mutations for now (will be replaced with actual mutations when backend is ready)
  const mockMutation = async (action: string, id: number, data?: any) => {
    console.log(`Mock mutation: ${action} for ID ${id}`, data);
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay
    return { success: true };
  };

  // Listing actions with mock implementations
  const handleApproveListing = async (id: number) => {
    try {
      // TODO: Replace with actual API call when backend is ready
      await mockMutation("approveListing", id);

      // REMOVE listing from list (not just update status)
      setListings((prev) => prev.filter((l) => l.id !== id));

      addToActivityLog({
        moderatorName: "Admin",
        action: "approved",
        itemType: "listing",
        itemTitle: listings.find((l) => l.id === id)?.title || `Listing #${id}`,
        timestamp: new Date().toISOString(),
      });

      toast.success(`Listing approved successfully!`);
      return { success: true };
    } catch (error) {
      console.error("Failed to approve listing:", error);
      toast.error("Failed to approve listing");
      return { success: false, error };
    }
  };

  const handleRejectListing = async (id: number, data: RejectRequest) => {
    try {
      // TODO: Replace with actual API call when backend is ready
      await mockMutation("rejectListing", id, data);

      // REMOVE listing from list (not just update status)
      setListings((prev) => prev.filter((l) => l.id !== id));

      addToActivityLog({
        moderatorName: "Admin",
        action: "rejected",
        itemType: "listing",
        itemTitle: listings.find((l) => l.id === id)?.title || `Listing #${id}`,
        timestamp: new Date().toISOString(),
        notes: `${data.reason}: ${data.notes || ""}`,
      });

      toast.error(`Listing rejected`);
      return { success: true };
    } catch (error) {
      console.error("Failed to reject listing:", error);
      toast.error("Failed to reject listing");
      return { success: false, error };
    }
  };

  const handleRequestChanges = async (id: number, data: ChangeRequest) => {
    try {
      // TODO: Replace with actual API call when backend is ready
      await mockMutation("requestChanges", id, data);

      // For request changes, we just update the status (don't remove)
      setListings((prev) =>
        prev.map((l) =>
          l.id === id ? { ...l, status: "changes_requested" as const } : l,
        ),
      );

      addToActivityLog({
        moderatorName: "Admin",
        action: "requested_changes",
        itemType: "listing",
        itemTitle: listings.find((l) => l.id === id)?.title || `Listing #${id}`,
        timestamp: new Date().toISOString(),
        notes: data.changes,
      });

      toast.success(`Change request sent to vendor`);
      return { success: true };
    } catch (error) {
      console.error("Failed to request changes:", error);
      toast.error("Failed to send change request");
      return { success: false, error };
    }
  };

  // Vendor actions with mock implementations
  const handleApproveVendor = async (id: number) => {
    try {
      // TODO: Replace with actual API call when backend is ready
      await mockMutation("approveVendor", id);

      updateVendorApprovalStatus(id, "approved", "Vendor application approved");
      setVendorRequests((prev) =>
        prev.map((v) =>
          v.id === id ? { ...v, status: "approved" as const } : v,
        ),
      );

      addToActivityLog({
        moderatorName: "Admin",
        action: "approved",
        itemType: "vendor",
        itemTitle:
          vendorRequests.find((v) => v.id === id)?.businessName ||
          `Vendor #${id}`,
        timestamp: new Date().toISOString(),
      });

      toast.success(`Vendor approved successfully!`);
      return { success: true };
    } catch (error) {
      console.error("Failed to approve vendor:", error);
      toast.error("Failed to approve vendor");
      return { success: false, error };
    }
  };

  const handleRejectVendor = async (id: number, data: RejectRequest) => {
    try {
      // TODO: Replace with actual API call when backend is ready
      await mockMutation("rejectVendor", id, data);

      updateVendorApprovalStatus(
        id,
        "rejected",
        `${data.reason}: ${data.notes || ""}`.trim(),
      );
      setVendorRequests((prev) =>
        prev.map((v) =>
          v.id === id
            ? {
                ...v,
                status: "rejected" as const,
                notes: `${data.reason}: ${data.notes || ""}`.trim(),
              }
            : v,
        ),
      );

      addToActivityLog({
        moderatorName: "Admin",
        action: "rejected",
        itemType: "vendor",
        itemTitle:
          vendorRequests.find((v) => v.id === id)?.businessName ||
          `Vendor #${id}`,
        timestamp: new Date().toISOString(),
        notes: `${data.reason}: ${data.notes || ""}`,
      });

      toast.error(`Vendor application rejected`);
      return { success: true };
    } catch (error) {
      console.error("Failed to reject vendor:", error);
      toast.error("Failed to reject vendor");
      return { success: false, error };
    }
  };

  // Report actions with mock implementations
  const handleResolveReport = async (id: number) => {
    try {
      // TODO: Replace with actual API call when backend is ready
      await mockMutation("resolveReport", id);

      setCustomerReports((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status: "resolved" as const } : r,
        ),
      );

      addToActivityLog({
        moderatorName: "Admin",
        action: "approved",
        itemType: "report",
        itemTitle: `Report #${customerReports.find((r) => r.id === id)?.orderId || id}`,
        timestamp: new Date().toISOString(),
      });

      toast.success(`Report marked as resolved`);
      return { success: true };
    } catch (error) {
      console.error("Failed to resolve report:", error);
      toast.error("Failed to resolve report");
      return { success: false, error };
    }
  };

  // In useModerationData.ts, the handleDismissReport function should look like:
  const handleDismissReport = async (id: number) => {
    try {
      await mockMutation("dismissReport", id);

      setCustomerReports((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status: "dismissed" as const } : r,
        ),
      );

      addToActivityLog({
        moderatorName: "Admin",
        action: "rejected",
        itemType: "report",
        itemTitle: `Report #${customerReports.find((r) => r.id === id)?.orderId || id}`,
        timestamp: new Date().toISOString(),
        notes: "Report dismissed as invalid",
      });

      toast.success(`Report dismissed`);
      return { success: true };
    } catch (error) {
      console.error("Failed to dismiss report:", error);
      toast.error("Failed to dismiss report");
      return { success: false, error };
    }
  };

  const handleIssueWarning = async (id: number, data: WarningRequest) => {
    try {
      // TODO: Replace with actual API call when backend is ready
      await mockMutation("issueWarning", id, data);

      const report = customerReports.find((r) => r.id === id);
      addToActivityLog({
        moderatorName: "Admin",
        action: "issued_warning",
        itemType: "report",
        itemTitle: `${data.warningType.charAt(0).toUpperCase() + data.warningType.slice(1)} Warning to ${report?.vendor || "Vendor"}`,
        timestamp: new Date().toISOString(),
        notes: data.details,
        details: {
          itemId: id,
          warningLevel: data.warningType,
          followUpRequired: data.warningType === "final",
        },
      });

      toast.error(
        `${data.warningType.charAt(0).toUpperCase() + data.warningType.slice(1)} warning issued to vendor`,
      );
      return { success: true };
    } catch (error) {
      console.error("Failed to issue warning:", error);
      toast.error("Failed to issue warning");
      return { success: false, error };
    }
  };

  // Bulk actions - UPDATED TO REMOVE LISTINGS
  const handleBulkApproveListings = async (ids: number[]) => {
    try {
      // TODO: Replace with actual API call when backend is ready
      await mockMutation("bulkApproveListings", 0, { ids });

      // REMOVE listings from list (not just update status)
      setListings((prev) => prev.filter((l) => !ids.includes(l.id)));

      toast.success(`${ids.length} listings approved successfully!`);
      return { success: true };
    } catch (error) {
      console.error("Failed to bulk approve listings:", error);
      toast.error("Failed to bulk approve listings");
      return { success: false, error };
    }
  };

  const handleBulkRejectListings = async (
    ids: number[],
    data: RejectRequest,
  ) => {
    try {
      // TODO: Replace with actual API call when backend is ready
      await mockMutation("bulkRejectListings", 0, { ids, data });

      // REMOVE listings from list (not just update status)
      setListings((prev) => prev.filter((l) => !ids.includes(l.id)));

      toast.error(`${ids.length} listings rejected`);
      return { success: true };
    } catch (error) {
      console.error("Failed to bulk reject listings:", error);
      toast.error("Failed to bulk reject listings");
      return { success: false, error };
    }
  };

  const handleBulkApproveVendors = async (ids: number[]) => {
    try {
      // TODO: Replace with actual API call when backend is ready
      await mockMutation("bulkApproveVendors", 0, { ids });

      ids.forEach((id) =>
        updateVendorApprovalStatus(id, "approved", "Vendor application approved"),
      );
      setVendorRequests((prev) =>
        prev.map((v) =>
          ids.includes(v.id) ? { ...v, status: "approved" as const } : v,
        ),
      );

      toast.success(`${ids.length} vendors approved successfully!`);
      return { success: true };
    } catch (error) {
      console.error("Failed to bulk approve vendors:", error);
      toast.error("Failed to bulk approve vendors");
      return { success: false, error };
    }
  };

  const handleBulkRejectVendors = async (
    ids: number[],
    data: RejectRequest,
  ) => {
    try {
      // TODO: Replace with actual API call when backend is ready
      await mockMutation("bulkRejectVendors", 0, { ids, data });

      ids.forEach((id) =>
        updateVendorApprovalStatus(
          id,
          "rejected",
          `${data.reason}: ${data.notes || ""}`.trim(),
        ),
      );
      setVendorRequests((prev) =>
        prev.map((v) =>
          ids.includes(v.id)
            ? {
                ...v,
                status: "rejected" as const,
                notes: `${data.reason}: ${data.notes || ""}`.trim(),
              }
            : v,
        ),
      );

      toast.error(`${ids.length} vendor applications rejected`);
      return { success: true };
    } catch (error) {
      console.error("Failed to bulk reject vendors:", error);
      toast.error("Failed to bulk reject vendors");
      return { success: false, error };
    }
  };

  const handleBulkResolveReports = async (ids: number[]) => {
    try {
      // TODO: Replace with actual API call when backend is ready
      await mockMutation("bulkResolveReports", 0, { ids });

      setCustomerReports((prev) =>
        prev.map((r) =>
          ids.includes(r.id) ? { ...r, status: "resolved" as const } : r,
        ),
      );

      toast.success(`${ids.length} reports marked as resolved`);
      return { success: true };
    } catch (error) {
      console.error("Failed to bulk resolve reports:", error);
      toast.error("Failed to bulk resolve reports");
      return { success: false, error };
    }
  };

  const handleBulkDismissReports = async (ids: number[]) => {
    try {
      // TODO: Replace with actual API call when backend is ready
      await mockMutation("bulkDismissReports", 0, { ids });

      setCustomerReports((prev) =>
        prev.map((r) =>
          ids.includes(r.id) ? { ...r, status: "dismissed" as const } : r,
        ),
      );

      toast.success(`${ids.length} reports dismissed`);
      return { success: true };
    } catch (error) {
      console.error("Failed to bulk dismiss reports:", error);
      toast.error("Failed to bulk dismiss reports");
      return { success: false, error };
    }
  };

  const handleClearActivityLog = async () => {
    try {
      // TODO: Replace with actual API call when backend is ready
      await mockMutation("clearActivityLog", 0);

      setActivityLog([]);
      toast.success(`Activity log cleared`);
      return { success: true };
    } catch (error) {
      console.error("Failed to clear activity log:", error);
      toast.error("Failed to clear activity log");
      return { success: false, error };
    }
  };

  return {
    // Current state (using local state for now)
    listings,
    setListings,
    vendorRequests,
    setVendorRequests,
    customerReports,
    setCustomerReports,
    activityLog,
    setActivityLog,

    // Activity log helper
    addToActivityLog,

    // Action handlers (mock implementations for now)
    handleApproveListing,
    handleRejectListing,
    handleRequestChanges,
    handleApproveVendor,
    handleRejectVendor,
    handleResolveReport,
    handleDismissReport,
    handleIssueWarning,
    handleBulkApproveListings,
    handleBulkRejectListings,
    handleBulkApproveVendors,
    handleBulkRejectVendors,
    handleBulkResolveReports,
    handleBulkDismissReports,
    handleClearActivityLog,

    // Helper functions for your existing code
    handleContactCustomer: (report: CustomerReport) => {
      const subject = `Regarding your report for order ${report.orderId}`;
      const body = `Dear ${report.reporter},\n\nWe are following up on your report regarding ${report.listing} from ${report.vendor}.\n\nPlease provide any additional details if needed.\n\nBest regards,\nModeration Team`;
      const mailtoLink = `mailto:customer@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(mailtoLink, "_blank");
      toast.success(`Opening email client to contact ${report.reporter}`);
    },

    handleContactVendor: (report: CustomerReport) => {
      const subject = `Customer Report: Order ${report.orderId}`;
      const body = `Dear ${report.vendor},\n\nWe have received a report regarding order ${report.orderId} for ${report.listing}.\n\nIssue: ${report.issue}\nDescription: ${report.description}\n\nPlease review and respond within 24 hours.\n\nBest regards,\nModeration Team`;
      const mailtoLink = `mailto:vendor@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(mailtoLink, "_blank");
      toast.success(`Opening email client to contact ${report.vendor}`);
    },

    handleContactApplicant: (vendor: VendorRequest) => {
      const subject = `Regarding your application for ${vendor.businessName}`;
      const body = `Dear ${vendor.ownerName},\n\nThank you for your application to become a vendor on our platform.\n\nWe are reviewing your submission and will get back to you shortly.\n\nBest regards,\nModeration Team`;
      const mailtoLink = `mailto:${vendor.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(mailtoLink, "_blank");
      toast.success(`Opening email client to contact ${vendor.ownerName}`);
    },

    // Helper functions for your existing code (to maintain compatibility)
    handleViewDocuments: (documents: string[]) => {
      toast.success(`Viewing ${documents.length} document(s)`);
      // This would normally open a dialog
    },
  };
}
