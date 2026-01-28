import React, { useState, useEffect } from "react";
import { useModerationData } from "./hooks/useModerationData";
import { useModerationActions } from "./hooks/useModerationActions";
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
import { VendorRequest, ModerationAction } from "./types";
import toast from "react-hot-toast";

export function ModerationView() {
  // State Management
  const [activeTab, setActiveTab] = useState<string>("listings");
  const [selectedListings, setSelectedListings] = useState<number[]>([]);
  const [selectedVendors, setSelectedVendors] = useState<number[]>([]);
  const [selectedReports, setSelectedReports] = useState<number[]>([]);

  // Dialog States
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [documentViewerOpen, setDocumentViewerOpen] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [warningDialogOpen, setWarningDialogOpen] = useState(false);
  const [selectedReportForWarning, setSelectedReportForWarning] =
    useState<any>(null);
  const [warningType, setWarningType] = useState<string>("formal");
  const [warningDetails, setWarningDetails] = useState("");
  const [activityDetailsDialogOpen, setActivityDetailsDialogOpen] =
    useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);

  // Hooks
  const data = useModerationData();
  const actions = useModerationActions();
  const filters = useModerationFilters();

  // Activity Log Helper Function
  const addToActivityLog = (
    action: Omit<ModerationAction, "id" | "timestamp">,
  ) => {
    const newActivity: ModerationAction = {
      id: Date.now(),
      ...action,
      timestamp: new Date().toISOString(),
    };

    data.addToActivityLog(newActivity);
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key === "/") {
        e.preventDefault();
        document.getElementById("search-input")?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  // Filtering and Pagination
  const filteredListings = filters.getFilteredListings(data.listings);
  const filteredVendors = filters.getFilteredVendors(data.vendorRequests);
  const filteredReports = filters.getFilteredReports(data.customerReports);

  const paginatedListings = filters.getPaginatedItems(
    filteredListings,
    filters.listingsPage,
  );
  const paginatedVendors = filters.getPaginatedItems(
    filteredVendors,
    filters.vendorsPage,
  );
  const paginatedReports = filters.getPaginatedItems(
    filteredReports,
    filters.reportsPage,
  );

  const totalListingsPages = Math.ceil(
    filteredListings.length / filters.ITEMS_PER_PAGE,
  );
  const totalVendorsPages = Math.ceil(
    filteredVendors.length / filters.ITEMS_PER_PAGE,
  );
  const totalReportsPages = Math.ceil(
    filteredReports.length / filters.ITEMS_PER_PAGE,
  );

  // Event Handlers with Activity Logging
  const handleSelectListing = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedListings([...selectedListings, id]);
    } else {
      setSelectedListings(selectedListings.filter((itemId) => itemId !== id));
    }
  };

  const handleSelectVendor = (id: number, checked: boolean) => {
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

  // Listing Actions - Updated to be async and use the hook functions
  const handleApproveListing = async (id: number) => {
    try {
      // Use the hook function which will remove the listing
      await data.handleApproveListing(id);

      const listing = data.listings.find((l) => l.id === id);
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

  const handleRejectListing = async (
    id: number,
    reason: string,
    notes: string,
  ) => {
    try {
      // Use the hook function which will remove the listing
      await data.handleRejectListing(id, { reason, notes });

      const listing = data.listings.find((l) => l.id === id);
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

  // Vendor Actions - Updated to be async
  const handleApproveVendor = async (id: number) => {
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
        documents: vendor?.documents,
      });
    } catch (error) {
      console.error("Failed to approve vendor:", error);
    }
  };

  const handleRejectVendor = async (
    id: number,
    reason: string,
    notes: string,
  ) => {
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
        documents: vendor?.documents,
      });
    } catch (error) {
      console.error("Failed to reject vendor:", error);
    }
  };

  // Report Actions - Updated to be async
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

  // Bulk Actions - Updated to use hook functions that remove listings
  const handleBulkApproveListings = async () => {
    try {
      actions.setLoading("bulk-approve-listings", true);

      // Use the hook function which will remove the listings
      await data.handleBulkApproveListings(selectedListings);

      // Add activity log entry for bulk action
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

      toast.success(
        `Bulk Approval Complete: ${selectedListings.length} listings have been approved.`,
      );

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

      // Use the hook function which will remove the listings
      // Note: You might need to provide a reason for rejection
      await data.handleBulkRejectListings(selectedListings, {
        reason: "Bulk rejection",
        notes: "Multiple listings rejected in bulk action",
      });

      // Add activity log entry for bulk action
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

      toast.error(
        `Bulk Rejection Complete: ${selectedListings.length} listings have been rejected.`,
      );

      setSelectedListings([]);
    } catch (error) {
      console.error("Bulk reject failed:", error);
      toast.error("Failed to bulk reject listings");
    } finally {
      actions.setLoading("bulk-reject-listings", false);
    }
  };

  const handleBulkApproveVendors = async (selectedVendorIds: number[]) => {
    try {
      await data.handleBulkApproveVendors(selectedVendorIds);

      // Add activity log entry for bulk action
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

      toast.success(
        `${selectedVendorIds.length} vendors approved successfully!`,
      );
      return selectedVendorIds;
    } catch (error) {
      console.error("Failed to bulk approve vendors:", error);
      toast.error("Failed to bulk approve vendors");
      return [];
    }
  };

  const handleBulkRejectVendors = async (selectedVendorIds: number[]) => {
    try {
      await data.handleBulkRejectVendors(selectedVendorIds, {
        reason: "Bulk rejection",
        notes: "Multiple vendor applications rejected in bulk action",
      });

      // Add activity log entry for bulk action
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
      return selectedVendorIds;
    } catch (error) {
      console.error("Failed to bulk reject vendors:", error);
      toast.error("Failed to bulk reject vendors");
      return [];
    }
  };

  const handleBulkResolveReports = async () => {
    try {
      actions.setLoading("bulk-resolve-reports", true);

      await data.handleBulkResolveReports(selectedReports);

      // Add activity log entry for bulk action
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

      toast.success(
        `Bulk Resolution Complete: ${selectedReports.length} reports have been resolved.`,
      );

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

      // Add activity log entry for bulk action
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

      toast.success(
        `Bulk Dismissal Complete: ${selectedReports.length} reports have been dismissed.`,
      );

      setSelectedReports([]);
    } catch (error) {
      console.error("Bulk dismiss failed:", error);
      toast.error("Failed to bulk dismiss reports");
    } finally {
      actions.setLoading("bulk-dismiss-reports", false);
    }
  };

  // Other Handlers
  const handleViewDocuments = (documents: string[]) => {
    setSelectedDocuments(documents);
    setDocumentViewerOpen(true);
  };

  const handleContactApplicant = (vendor: VendorRequest) => {
    const subject = `Regarding your application for ${vendor.businessName}`;
    const body = `Dear ${vendor.ownerName},\n\nThank you for your application to become a vendor on our platform.\n\nWe are reviewing your submission and will get back to you shortly.\n\nBest regards,\nModeration Team`;
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
        notes:
          warningDetails ||
          `Related to order ${selectedReportForWarning.orderId} - ${selectedReportForWarning.issue}`,
      });

      toast.error(
        `${warningType.charAt(0).toUpperCase() + warningType.slice(1)} Warning Issued: ${selectedReportForWarning.vendor} has been warned.`,
      );
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

      await data.handleRequestChanges(id, {
        changes: actions.changeRequest,
      });

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

      toast.success(
        `Changes Requested: Vendor has been notified about required changes for "${listing.title}".`,
      );
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <ModerationHeader />

        {/* Stats Cards */}
        <StatsCards
          listings={data.listings}
          vendorRequests={data.vendorRequests}
          customerReports={data.customerReports}
        />

        {/* Search & Filters */}
        <SearchFilters
          activeTab={activeTab}
          searchQuery={filters.searchQuery}
          categoryFilter={filters.categoryFilter}
          sortBy={filters.sortBy}
          priorityFilter={filters.priorityFilter}
          statusFilter={filters.statusFilter}
          onSearchChange={filters.setSearchQuery}
          onCategoryFilterChange={filters.setCategoryFilter}
          onSortByChange={filters.setSortBy}
          onPriorityFilterChange={filters.setPriorityFilter}
          onStatusFilterChange={filters.setStatusFilter}
          getSearchPlaceholder={filters.getSearchPlaceholder}
        />

        {/* Tabs Navigation */}
        <TabNavigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          listings={data.listings}
          vendorRequests={data.vendorRequests}
          customerReports={data.customerReports}
        />

        {/* Listing Moderation Tab */}
        {activeTab === "listings" && (
          // In ModerationView.tsx, update the ListingModeration component call:
          <ListingModeration
            listings={data.listings}
            filteredListings={filteredListings}
            paginatedListings={paginatedListings}
            selectedListings={selectedListings}
            loadingStates={actions.loadingStates}
            statusFilter={filters.statusFilter}
            totalListingsPages={totalListingsPages}
            listingsPage={filters.listingsPage}
            onSelectListing={handleSelectListing}
            onApproveListing={handleApproveListing}
            // In ModerationView.tsx, update the ListingModeration props:
            onRejectListing={(
              id, // id is passed from ListingCard
            ) =>
              actions.setRejectionDialog({
                open: true,
                id, // Use the actual ID
                type: "listing",
              })
            }
            onRequestChanges={(
              id, // id is passed from ListingCard
            ) =>
              actions.setChangeRequestDialog({
                open: true,
                id, // Use the actual ID
              })
            }
            onBulkApproveListings={handleBulkApproveListings}
            onBulkRejectListings={handleBulkRejectListings}
            onClearSelection={() => setSelectedListings([])}
            onStatusFilterChange={filters.setStatusFilter}
            onPageChange={filters.setListingsPage}
            onZoomImage={setZoomedImage}
            // REMOVED: onRemoveListing prop
          />
        )}

        {/* Vendor Requests Tab */}
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
            onRejectVendor={(id) =>
              actions.setRejectionDialog({
                open: true,
                id,
                type: "vendor",
              })
            }
            onBulkApproveVendors={handleBulkApproveVendors}
            onBulkRejectVendors={handleBulkRejectVendors}
            onClearSelection={() => setSelectedVendors([])}
            onStatusFilterChange={filters.setStatusFilter}
            onPageChange={filters.setVendorsPage}
            onViewDocuments={handleViewDocuments}
            onContactApplicant={handleContactApplicant}
          />
        )}

        {/* Customer Reports Tab */}
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

        {/* Activity Log Tab */}
        {activeTab === "activity" && (
          <ActivityLog
            activityLog={data.activityLog}
            sortBy={filters.sortBy}
            onSortByChange={filters.setSortBy}
            onClearActivityLog={handleClearActivityLog}
            onViewActivityDetails={handleViewActivityDetails}
          />
        )}
      </div>

      {/* Dialogs */}
      <ImageZoomDialog
        open={!!zoomedImage}
        imageUrl={zoomedImage}
        onOpenChange={() => setZoomedImage(null)}
      />

      <RejectionDialog
        open={actions.rejectionDialog.open}
        type={actions.rejectionDialog.type}
        rejectionReason={actions.rejectionReason}
        rejectionNotes={actions.rejectionNotes}
        loading={
          actions.loadingStates[
            `${actions.rejectionDialog.type}-${actions.rejectionDialog.id}`
          ]
        }
        onOpenChange={(open) => {
          if (!open) {
            // When dialog closes, reset the rejection state
            actions.setRejectionReason("");
            actions.setRejectionNotes("");
          }
          actions.setRejectionDialog({ ...actions.rejectionDialog, open });
        }}
        onRejectionReasonChange={actions.setRejectionReason}
        onRejectionNotesChange={actions.setRejectionNotes}
        onConfirm={(reason, notes) => {
          if (actions.rejectionDialog.type === "listing") {
            handleRejectListing(actions.rejectionDialog.id, reason, notes);
          } else if (actions.rejectionDialog.type === "vendor") {
            handleRejectVendor(actions.rejectionDialog.id, reason, notes);
          }

          // Reset rejection state after confirming
          actions.setRejectionReason("");
          actions.setRejectionNotes("");

          actions.setRejectionDialog({
            ...actions.rejectionDialog,
            open: false,
          });
        }}
      />

      <ChangeRequestDialog
        open={actions.changeRequestDialog.open}
        changeRequest={actions.changeRequest}
        loading={
          actions.loadingStates[`listing-${actions.changeRequestDialog.id}`]
        }
        onOpenChange={(open) =>
          actions.setChangeRequestDialog({
            ...actions.changeRequestDialog,
            open,
          })
        }
        onChangeRequestChange={actions.setChangeRequest}
        onConfirm={handleRequestChanges}
      />

      <DocumentViewer
        open={documentViewerOpen}
        documents={selectedDocuments}
        onOpenChange={setDocumentViewerOpen}
      />

      <WarningDialog
        open={warningDialogOpen}
        selectedReport={selectedReportForWarning}
        warningType={warningType}
        warningDetails={warningDetails}
        loading={
          actions.loadingStates[`issue-warning-${selectedReportForWarning?.id}`]
        }
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

      <ActivityDetailsDialog
        open={activityDetailsDialogOpen}
        selectedActivity={selectedActivity}
        onOpenChange={setActivityDetailsDialogOpen}
      />
    </div>
  );
}
