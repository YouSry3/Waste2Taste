import React, { useState, useEffect } from "react";
import { useModerationData } from "./hooks/useModerationData";
import { useModerationUiState } from "./hooks/useModerationUiState";
import { useModerationFilters } from "./hooks/useModerationFilters";
import { ModerationHeader } from "./components/ModerationHeader";
import { StatsCards } from "./components/StatsCards";
import { SearchFilters } from "./components/SearchFilters";
import { TabNavigation } from "./components/TabNavigation";
import { ListingModeration } from "./components/listings/ListingModeration";
import { VendorModeration } from "./components/vendors/VendorModeration";
import { ReportModeration } from "./components/reports/ReportModeration";
import { ActivityLog } from "./components/activity/ActivityLog";
import { RejectionDialog } from "./components/dialogs/RejectionDialog";
import { ChangeRequestDialog } from "./components/dialogs/ChangeRequestDialog";
import { WarningDialog } from "./components/dialogs/WarningDialog";
import { DocumentViewer } from "./components/dialogs/DocumentViewer";
import { ActivityDetailsDialog } from "./components/dialogs/ActivityDetailsDialog";
import { ImageZoomDialog } from "./components/dialogs/ImageZoomDialog";
import { ModerationAction, ModerationId, VendorRequest } from "./types";
import toast from "react-hot-toast";
import { VendorDocument } from "../../../types/vendorApproval";

export function ModerationView() {
  const [activeTab, setActiveTab] = useState<string>("listings");
  
  // üî¥ CHANGED: number[] ‚Üí string[]
  const [selectedListings, setSelectedListings] = useState<string[]>([]);
  
  const [selectedVendors, setSelectedVendors] = useState<ModerationId[]>([]);
  const [selectedReports, setSelectedReports] = useState<number[]>([]);
  const [activityStatusFilter, setActivityStatusFilter] = useState<string>("all");
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [documentViewerOpen, setDocumentViewerOpen] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState<VendorDocument[]>([]);
  const [warningDialogOpen, setWarningDialogOpen] = useState(false);
  const [selectedReportForWarning, setSelectedReportForWarning] = useState<any>(null);
  const [warningType, setWarningType] = useState<string>("formal");
  const [warningDetails, setWarningDetails] = useState("");
  const [activityDetailsDialogOpen, setActivityDetailsDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);

  const data = useModerationData();
  const actions = useModerationUiState();
  const filters = useModerationFilters();

  const addToActivityLog = (action: Omit<ModerationAction, "id" | "timestamp">) => {
    const newActivity: ModerationAction = {
      id: Date.now(),
      ...action,
      timestamp: new Date().toISOString(),
    };
    data.addToActivityLog(newActivity);
  };

  const getFilteredActivityLog = () => {
    if (activityStatusFilter === "all") return data.activityLog;
    return data.activityLog.filter((activity) => {
      switch (activityStatusFilter) {
        case "approved":
          return (
            activity.type === "approval" ||
            activity.type === "vendor_approval" ||
            activity.type === "bulk_approval"
          );
        case "rejected":
          return (
            activity.type === "rejection" ||
            activity.type === "vendor_rejection" ||
            activity.type === "bulk_rejection"
          );
        case "changes_requested":
          return activity.type === "changes_requested";
        default:
          return true;
      }
    });
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "/") {
        e.preventDefault();
        document.getElementById("search-input")?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  const filteredListings = filters.getFilteredListings(data.listings);
  const filteredVendors = filters.getFilteredVendors(data.vendorRequests);
  const filteredReports = filters.getFilteredReports(data.customerReports);
  const filteredActivityLog = getFilteredActivityLog();

  const paginatedListings = filters.getPaginatedItems(filteredListings, filters.listingsPage);
  const paginatedVendors = filters.getPaginatedItems(filteredVendors, filters.vendorsPage);
  const paginatedReports = filters.getPaginatedItems(filteredReports, filters.reportsPage);

  const totalListingsPages = Math.ceil(filteredListings.length / filters.ITEMS_PER_PAGE);
  const totalVendorsPages = Math.ceil(filteredVendors.length / filters.ITEMS_PER_PAGE);
  const totalReportsPages = Math.ceil(filteredReports.length / filters.ITEMS_PER_PAGE);

  // üî¥ CHANGED: id is now string
  const handleSelectListing = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedListings([...selectedListings, id]);
    } else {
      setSelectedListings(selectedListings.filter((itemId) => itemId !== id));
    }
  };

  const handleSelectVendor = (id: ModerationId, checked: boolean) => {
    if (checked) {
      setSelectedVendors([...selectedVendors, id]);
    } else {
      setSelectedVendors(selectedVendors.filter((itemId) => itemId !== id));
    }
  };

  const handleSelectReport = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedReports([...selectedReports, id]);
    } else {
      setSelectedReports(selectedReports.filter((itemId) => itemId !== id));
    }
  };

  // üî¥ CHANGED: id is string
  const handleApproveListing = async (id: string) => {
    try {
      await data.handleApproveListing(id);
      const listing = data.listings.find((l) => String(l.id) === String(id));
      addToActivityLog({
        type: "approval",
        targetType: "listing",
        targetId: id,
        targetName: listing?.title || "Listing",
        moderator: "Admin",
        details: listing
          ? `Approved listing "${listing.title}" by ${listing.vendorName}`
          : `Approved listing #${id}`,
        beforeStatus: listing?.status || "pending",
        afterStatus: "approved",
        notes: "Listing approved for publication",
      });
    } catch (error) {
      console.error("Failed to approve listing:", error);
    }
  };

  // üî¥ CHANGED: id is string
  const handleRejectListing = async (id: string, reason: string, notes: string) => {
    try {
      await data.handleRejectListing(id, { reason, notes });
      const listing = data.listings.find((l) => String(l.id) === String(id));
      addToActivityLog({
        type: "rejection",
        targetType: "listing",
        targetId: id,
        targetName: listing?.title || "Listing",
        moderator: "Admin",
        details: listing
          ? `Rejected listing "${listing.title}" by ${listing.vendorName}`
          : `Rejected listing #${id}`,
        beforeStatus: listing?.status || "pending",
        afterStatus: "rejected",
        notes: `Reason: ${reason}. ${notes}`,
      });
    } catch (error) {
      console.error("Failed to reject listing:", error);
    }
  };

  const handleApproveVendor = async (id: ModerationId) => {
    actions.setLoading(`vendor-${id}`, true);
    try {
      await data.handleApproveVendor(id);
      const vendor = data.vendorRequests.find((v) => v.id === id);
      addToActivityLog({
        type: "vendor_approval",
        targetType: "vendor",
        targetId: id,
        targetName: vendor?.businessName || "Vendor",
        moderator: "Admin",
        details: vendor
          ? `Approved vendor "${vendor.businessName}" owned by ${vendor.ownerName}`
          : `Approved vendor #${id}`,
        beforeStatus: vendor?.status || "pending",
        afterStatus: "approved",
        notes: "Vendor application approved",
        documents: vendor?.documents?.map((document) => document.label),
      });
    } catch (error) {
      console.error("Failed to approve vendor:", error);
    } finally {
      actions.setLoading(`vendor-${id}`, false);
    }
  };

  const handleRejectVendor = async (id: ModerationId, reason: string, notes: string) => {
    actions.setLoading(`vendor-${id}`, true);
    try {
      await data.handleRejectVendor(id, { reason, notes });
      const vendor = data.vendorRequests.find((v) => v.id === id);
      addToActivityLog({
        type: "vendor_rejection",
        targetType: "vendor",
        targetId: id,
        targetName: vendor?.businessName || "Vendor",
        moderator: "Admin",
        details: vendor
          ? `Rejected vendor "${vendor.businessName}" owned by ${vendor.ownerName}`
          : `Rejected vendor #${id}`,
        beforeStatus: vendor?.status || "pending",
        afterStatus: "rejected",
        notes: `Reason: ${reason}. ${notes}`,
        documents: vendor?.documents?.map((document) => document.label),
      });
    } catch (error) {
      console.error("Failed to reject vendor:", error);
    } finally {
      actions.setLoading(`vendor-${id}`, false);
    }
  };

  const handleResolveReport = async (id: number) => {
    try {
      await data.handleResolveReport(id);
      const report = data.customerReports.find((r) => r.id === id);
      addToActivityLog({
        type: "resolution",
        targetType: "report",
        targetId: id,
        targetName: report?.vendor || "Report",
        moderator: "Admin",
        details: report
          ? `Resolved report against "${report.vendor}" regarding order ${report.orderId}`
          : `Resolved report #${id}`,
        beforeStatus: report?.status || "pending",
        afterStatus: "resolved",
        notes: report?.issue,
      });
    } catch (error) {
      console.error("Failed to resolve report:", error);
    }
  };

  const handleDismissReport = async (id: number) => {
    try {
      await data.handleDismissReport(id);
      const report = data.customerReports.find((r) => r.id === id);
      addToActivityLog({
        type: "dismissal",
        targetType: "report",
        targetId: id,
        targetName: report?.vendor || "Report",
        moderator: "Admin",
        details: report
          ? `Dismissed report against "${report.vendor}" regarding order ${report.orderId}`
          : `Dismissed report #${id}`,
        beforeStatus: report?.status || "pending",
        afterStatus: "dismissed",
        notes: report?.issue,
      });
    } catch (error) {
      console.error("Failed to dismiss report:", error);
    }
  };

  const handleBulkApproveListings = async () => {
    try {
      actions.setLoading("bulk-approve-listings", true);
      await data.handleBulkApproveListings(selectedListings);
      addToActivityLog({
        type: "bulk_approval",
        targetType: "listing",
        targetId: selectedListings.join(","),
        targetName: `${selectedListings.length} listings`,
        moderator: "Admin",
        details: `Approved ${selectedListings.length} listings in bulk`,
        beforeStatus: "pending",
        afterStatus: "approved",
        notes: `Listing IDs: ${selectedListings.join(", ")}`,
      });
      toast.success(`Bulk Approval Complete: ${selectedListings.length} listings approved.`);
      setSelectedListings([]);
    } catch (error) {
      console.error("Bulk approve failed:", error);
      toast.error("Failed to bulk approve listings");
    } finally {
      actions.setLoading("bulk-approve-listings", false);
    }
  };

  const handleBulkRejectListings = async () => {
    try {
      actions.setLoading("bulk-reject-listings", true);
      await data.handleBulkRejectListings(selectedListings, {
        reason: "Bulk rejection",
        notes: "Multiple listings rejected in bulk action",
      });
      addToActivityLog({
        type: "bulk_rejection",
        targetType: "listing",
        targetId: selectedListings.join(","),
        targetName: `${selectedListings.length} listings`,
        moderator: "Admin",
        details: `Rejected ${selectedListings.length} listings in bulk`,
        beforeStatus: "pending",
        afterStatus: "rejected",
        notes: `Listing IDs: ${selectedListings.join(", ")}`,
      });
      toast.error(`Bulk Rejection Complete: ${selectedListings.length} listings rejected.`);
      setSelectedListings([]);
    } catch (error) {
      console.error("Bulk reject failed:", error);
      toast.error("Failed to bulk reject listings");
    } finally {
      actions.setLoading("bulk-reject-listings", false);
    }
  };

  const handleBulkApproveVendors = async (selectedVendorIds: ModerationId[]) => {
    actions.setLoading("bulk-approve-vendors", true);
    try {
      await data.handleBulkApproveVendors(selectedVendorIds);
      addToActivityLog({
        type: "bulk_approval",
        targetType: "vendor",
        targetId: selectedVendorIds.join(","),
        targetName: `${selectedVendorIds.length} vendors`,
        moderator: "Admin",
        details: `Approved ${selectedVendorIds.length} vendor applications in bulk`,
        beforeStatus: "pending",
        afterStatus: "approved",
        notes: `Vendor IDs: ${selectedVendorIds.join(", ")}`,
      });
      toast.success(`${selectedVendorIds.length} vendors approved successfully!`);
      setSelectedVendors((prev) => prev.filter((id) => !selectedVendorIds.includes(id)));
      return selectedVendorIds;
    } catch (error) {
      console.error("Failed to bulk approve vendors:", error);
      toast.error("Failed to bulk approve vendors");
      return [];
    } finally {
      actions.setLoading("bulk-approve-vendors", false);
    }
  };

  const handleBulkRejectVendors = async (selectedVendorIds: ModerationId[]) => {
    actions.setLoading("bulk-reject-vendors", true);
    try {
      await data.handleBulkRejectVendors(selectedVendorIds, {
        reason: "Bulk rejection",
        notes: "Multiple vendor applications rejected in bulk action",
      });
      addToActivityLog({
        type: "bulk_rejection",
        targetType: "vendor",
        targetId: selectedVendorIds.join(","),
        targetName: `${selectedVendorIds.length} vendors`,
        moderator: "Admin",
        details: `Rejected ${selectedVendorIds.length} vendor applications in bulk`,
        beforeStatus: "pending",
        afterStatus: "rejected",
        notes: `Vendor IDs: ${selectedVendorIds.join(", ")}`,
      });
      toast.error(`${selectedVendorIds.length} vendor applications rejected`);
      setSelectedVendors((prev) => prev.filter((id) => !selectedVendorIds.includes(id)));
      return selectedVendorIds;
    } catch (error) {
      console.error("Failed to bulk reject vendors:", error);
      toast.error("Failed to bulk reject vendors");
      return [];
    } finally {
      actions.setLoading("bulk-reject-vendors", false);
    }
  };

  const handleBulkResolveReports = async () => {
    try {
      actions.setLoading("bulk-resolve-reports", true);
      await data.handleBulkResolveReports(selectedReports);
      addToActivityLog({
        type: "bulk_resolution",
        targetType: "report",
        targetId: selectedReports.join(","),
        targetName: `${selectedReports.length} reports`,
        moderator: "Admin",
        details: `Resolved ${selectedReports.length} customer reports in bulk`,
        beforeStatus: "pending",
        afterStatus: "resolved",
        notes: `Report IDs: ${selectedReports.join(", ")}`,
      });
      toast.success(`Bulk Resolution Complete: ${selectedReports.length} reports resolved.`);
      setSelectedReports([]);
    } catch (error) {
      console.error("Bulk resolve failed:", error);
      toast.error("Failed to bulk resolve reports");
    } finally {
      actions.setLoading("bulk-resolve-reports", false);
    }
  };

  const handleBulkDismissReports = async () => {
    try {
      actions.setLoading("bulk-dismiss-reports", true);
      await data.handleBulkDismissReports(selectedReports);
      addToActivityLog({
        type: "bulk_dismissal",
        targetType: "report",
        targetId: selectedReports.join(","),
        targetName: `${selectedReports.length} reports`,
        moderator: "Admin",
        details: `Dismissed ${selectedReports.length} customer reports in bulk`,
        beforeStatus: "pending",
        afterStatus: "dismissed",
        notes: `Report IDs: ${selectedReports.join(", ")}`,
      });
      toast.success(`Bulk Dismissal Complete: ${selectedReports.length} reports dismissed.`);
      setSelectedReports([]);
    } catch (error) {
      console.error("Bulk dismiss failed:", error);
      toast.error("Failed to bulk dismiss reports");
    } finally {
      actions.setLoading("bulk-dismiss-reports", false);
    }
  };

  const handleViewDocuments = (documents: VendorDocument[]) => {
    setSelectedDocuments(documents);
    setDocumentViewerOpen(true);
  };

  const handleContactApplicant = (vendor: VendorRequest) => {
    const subject = `Regarding your application for ${vendor.businessName}`;
    const body = `Dear ${vendor.ownerName},\n\nThank you for your application...\n\nBest regards,\nModeration Team`;
    const mailtoLink = `mailto:${vendor.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink, "_blank");
    toast.success(`Opening email client to contact ${vendor.ownerName}`);
  };

  const handleIssueWarning = (report: any) => {
    setSelectedReportForWarning(report);
    setWarningDialogOpen(true);
  };

  const handleConfirmIssueWarning = async () => {
    if (!selectedReportForWarning) return;
    try {
      actions.setLoading(`issue-warning-${selectedReportForWarning.id}`, true);
      await data.handleIssueWarning(selectedReportForWarning.id, {
        warningType,
        details: warningDetails,
      });
      addToActivityLog({
        type: "warning",
        targetType: "report",
        targetId: selectedReportForWarning.id,
        targetName: selectedReportForWarning.vendor || "Vendor",
        moderator: "Admin",
        details: `Issued ${warningType} warning to ${selectedReportForWarning.vendor}`,
        beforeStatus: selectedReportForWarning.status || "pending",
        afterStatus: "warning_issued",
        notes: warningDetails || `Related to order ${selectedReportForWarning.orderId}`,
      });
      toast.error(`${warningType.charAt(0).toUpperCase() + warningType.slice(1)} Warning Issued.`);
    } catch (error) {
      console.error("Failed to issue warning:", error);
      toast.error("Failed to issue warning");
    } finally {
      actions.setLoading(`issue-warning-${selectedReportForWarning.id}`, false);
      setWarningDialogOpen(false);
      setWarningType("formal");
      setWarningDetails("");
      setSelectedReportForWarning(null);
    }
  };

  const handleViewActivityDetails = (action: any) => {
    setSelectedActivity(action);
    setActivityDetailsDialogOpen(true);
  };

  const handleClearActivityLog = async () => {
    try {
      await data.handleClearActivityLog();
      toast.success("Activity log cleared successfully");
    } catch (error) {
      console.error("Failed to clear activity log:", error);
      toast.error("Failed to clear activity log");
    }
  };

  const handleRequestChanges = async () => {
    const id = actions.changeRequestDialog.id;
    const listing = data.listings.find((l) => l.id === id);
    if (!listing) return;
    try {
      actions.setLoading(`listing-${id}`, true);
      await data.handleRequestChanges(id, { changes: actions.changeRequest });
      addToActivityLog({
        type: "changes_requested",
        targetType: "listing",
        targetId: id,
        targetName: listing.title,
        moderator: "Admin",
        details: `Requested changes for listing "${listing.title}"`,
        beforeStatus: listing.status,
        afterStatus: "changes_requested",
        notes: actions.changeRequest,
      });
      toast.success(`Changes Requested: Vendor notified about required changes.`);
    } catch (error) {
      console.error("Failed to request changes:", error);
      toast.error("Failed to send change request");
    } finally {
      actions.setLoading(`listing-${id}`, false);
      actions.setChangeRequestDialog({ open: false, id: 0 });
      actions.setChangeRequest("");
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <ModerationHeader />
        <StatsCards
          summary={data.moderationSummary}
          listings={data.listings}
          vendorRequests={data.vendorRequests}
          customerReports={data.customerReports}
        />
        
        <TabNavigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          summary={data.moderationSummary}
          listings={data.listings}
          vendorRequests={data.vendorRequests}
          customerReports={data.customerReports}
        />
        {activeTab === "listings" && (
          <ListingModeration
            listings={data.listings}
            filteredListings={filteredListings}
            paginatedListings={paginatedListings}
            selectedListings={selectedListings}
            loadingStates={actions.loadingStates}
            totalListingsPages={totalListingsPages}
            listingsPage={filters.listingsPage}
            onSelectListing={handleSelectListing}
            onApproveListing={handleApproveListing}
            onRejectListing={(id) => handleRejectListing(id, "Rejected by admin", "")}
            onRequestChanges={(id) => actions.setChangeRequestDialog({ open: true, id })}
            onBulkApproveListings={handleBulkApproveListings}
            onBulkRejectListings={handleBulkRejectListings}
            onClearSelection={() => setSelectedListings([])}
            onPageChange={filters.setListingsPage}
            onZoomImage={setZoomedImage}
          />
        )}
        {activeTab === "vendors" && (
          <VendorModeration
            vendors={data.vendorRequests}
            filteredVendors={filteredVendors}
            paginatedVendors={paginatedVendors}
            selectedVendors={selectedVendors}
            loadingStates={actions.loadingStates}
            statusFilter={filters.statusFilter}
            totalVendorsPages={totalVendorsPages}
            vendorsPage={filters.vendorsPage}
            onSelectVendor={handleSelectVendor}
            onApproveVendor={handleApproveVendor}
            onRejectVendor={(id) => handleRejectVendor(id, "Rejected by admin", "")}
            onBulkApproveVendors={handleBulkApproveVendors}
            onBulkRejectVendors={handleBulkRejectVendors}
            onClearSelection={() => setSelectedVendors([])}
            onStatusFilterChange={filters.setStatusFilter}
            onPageChange={filters.setVendorsPage}
            onViewDocuments={handleViewDocuments}
            onContactApplicant={handleContactApplicant}
          />
        )}
        {activeTab === "reports" && (
          <ReportModeration
            reports={data.customerReports}
            filteredReports={filteredReports}
            paginatedReports={paginatedReports}
            selectedReports={selectedReports}
            loadingStates={actions.loadingStates}
            statusFilter={filters.statusFilter}
            priorityFilter={filters.priorityFilter}
            totalReportsPages={totalReportsPages}
            reportsPage={filters.reportsPage}
            onSelectReport={handleSelectReport}
            onResolveReport={handleResolveReport}
            onDismissReport={handleDismissReport}
            onBulkResolveReports={handleBulkResolveReports}
            onBulkDismissReports={handleBulkDismissReports}
            onClearSelection={() => setSelectedReports([])}
            onStatusFilterChange={filters.setStatusFilter}
            onPriorityFilterChange={filters.setPriorityFilter}
            onPageChange={filters.setReportsPage}
            onContactCustomer={actions.handleContactCustomer}
            onContactVendor={actions.handleContactVendor}
            onIssueWarning={handleIssueWarning}
          />
        )}
        {activeTab === "activity" && (
          <ActivityLog
            activityLog={filteredActivityLog}
            sortBy={filters.sortBy}
            statusFilter={activityStatusFilter}
            onSortByChange={filters.setSortBy}
            onStatusFilterChange={setActivityStatusFilter}
            onClearActivityLog={handleClearActivityLog}
            onViewActivityDetails={handleViewActivityDetails}
          />
        )}
      </div>
      <ImageZoomDialog open={!!zoomedImage} imageUrl={zoomedImage} onOpenChange={() => setZoomedImage(null)} />
      <RejectionDialog
        open={actions.rejectionDialog.open}
        type={actions.rejectionDialog.type}
        rejectionReason={actions.rejectionReason}
        rejectionNotes={actions.rejectionNotes}
        loading={actions.loadingStates[`${actions.rejectionDialog.type}-${actions.rejectionDialog.id}`]}
        onOpenChange={(open) => {
          if (!open) {
            actions.setRejectionReason("");
            actions.setRejectionNotes("");
          }
          actions.setRejectionDialog({ ...actions.rejectionDialog, open });
        }}
        onRejectionReasonChange={actions.setRejectionReason}
        onRejectionNotesChange={actions.setRejectionNotes}
        onConfirm={(reason, notes) => {
          if (actions.rejectionDialog.type === "listing") {
            handleRejectListing(String(actions.rejectionDialog.id), reason, notes);
          } else if (actions.rejectionDialog.type === "vendor") {
            handleRejectVendor(actions.rejectionDialog.id, reason, notes);
          }
          actions.setRejectionReason("");
          actions.setRejectionNotes("");
          actions.setRejectionDialog({ ...actions.rejectionDialog, open: false });
        }}
      />
      <ChangeRequestDialog
        open={actions.changeRequestDialog.open}
        changeRequest={actions.changeRequest}
        loading={actions.loadingStates[`listing-${actions.changeRequestDialog.id}`]}
        onOpenChange={(open) => actions.setChangeRequestDialog({ ...actions.changeRequestDialog, open })}
        onChangeRequestChange={actions.setChangeRequest}
        onConfirm={handleRequestChanges}
      />
      <DocumentViewer open={documentViewerOpen} documents={selectedDocuments} onOpenChange={setDocumentViewerOpen} />
      <WarningDialog
        open={warningDialogOpen}
        selectedReport={selectedReportForWarning}
        warningType={warningType}
        warningDetails={warningDetails}
        loading={actions.loadingStates[`issue-warning-${selectedReportForWarning?.id}`]}
        onOpenChange={setWarningDialogOpen}
        onWarningTypeChange={setWarningType}
        onWarningDetailsChange={setWarningDetails}
        onConfirm={handleConfirmIssueWarning}
        onCancel={() => {
          setWarningDialogOpen(false);
          setWarningType("formal");
          setWarningDetails("");
          setSelectedReportForWarning(null);
        }}
      />
      <ActivityDetailsDialog open={activityDetailsDialogOpen} selectedActivity={selectedActivity} onOpenChange={setActivityDetailsDialogOpen} />
    </div>
  );
}
