import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
  updateVendorApprovalStatusByEmail,
} from "../../../../services/vendorApproval/vendorApprovalStore";
import {
  approveVendorRequest,
  getPendingVendorRequestsForAdmin,
  rejectVendorRequest,
} from "../../../../services/vendorApproval/vendorRequestService";
import {
  VendorApprovalRequest,
  VendorDocument,
} from "../../../../types/vendorApproval";
import { API_CONFIG } from "../../../../services/api/apiConfig";

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
  const storedRequests = getStoredVendorRequests()
    .filter((request) => request.status === "pending")
    .map(mapStoredVendorRequest);
  return dedupeVendorRequestsById([...storedRequests, ...initialVendorRequests]);
}

const isDemoModeEnabled = () => {
  const mockFlag = import.meta.env.VITE_ENABLE_MOCK_DATA;
  if (typeof mockFlag === "string" && mockFlag.toLowerCase() === "true") {
    return true;
  }

  const token = localStorage.getItem("authToken");
  return !!token && token.startsWith("demo-token-");
};

const createDocumentFromUrl = (
  url: string,
  kind: VendorDocument["kind"],
  label: string,
): VendorDocument => {
  const normalizedUrl = normalizeDocumentUrl(url);
  const fileName = normalizedUrl.split("/").pop() || `${kind}.pdf`;
  const readableLabel =
    kind === "health_certificate" ? "Health Certificate" : label;

  return {
    id: `${kind}-${fileName}`,
    kind,
    label: readableLabel,
    name: fileName,
    type: "application/octet-stream",
    size: 0,
    url: normalizedUrl,
    uploadedAt: new Date().toISOString(),
  };
};

const normalizeDocumentUrl = (rawValue: unknown): string => {
  if (typeof rawValue !== "string") {
    return "";
  }

  const value = rawValue.trim();
  if (!value) {
    return "";
  }

  if (/^https?:\/\//i.test(value) || value.startsWith("data:")) {
    return value;
  }

  if (value.startsWith("/")) {
    return `${API_CONFIG.BASE_URL}${value}`;
  }

  return `${API_CONFIG.BASE_URL}/${value}`;
};

const detectDocumentKind = (document: any): VendorDocument["kind"] => {
  const rawKind = String(
    document?.kind ??
      document?.type ??
      document?.documentType ??
      document?.name ??
      "",
  ).toLowerCase();

  if (
    rawKind.includes("health") ||
    rawKind.includes("certificate") ||
    rawKind.includes("cert")
  ) {
    return "health_certificate";
  }

  return "business_license";
};

const getDocumentLabel = (kind: VendorDocument["kind"], value: any): string => {
  if (typeof value?.label === "string" && value.label.trim()) {
    return value.label;
  }

  return kind === "health_certificate"
    ? "Health Certificate"
    : "Business License";
};

const getDocumentName = (document: any, index: number): string => {
  const candidates = [
    document?.name,
    document?.fileName,
    document?.originalFileName,
    document?.documentName,
  ];

  const fromCandidate = candidates.find(
    (item) => typeof item === "string" && item.trim(),
  );
  if (fromCandidate) {
    return String(fromCandidate);
  }

  return `document-${index + 1}`;
};

const getDocumentUrl = (document: any): string => {
  const candidates = [
    document?.url,
    document?.fileUrl,
    document?.documentUrl,
    document?.path,
    document?.filePath,
  ];

  const first = candidates.find(
    (item) => typeof item === "string" && item.trim(),
  );
  return normalizeDocumentUrl(first);
};

const mapApiDocument = (
  document: any,
  index: number,
  fallbackSubmittedAt: string,
): VendorDocument => {
  const kind = detectDocumentKind(document);
  return {
    id: String(document?.id ?? `${fallbackSubmittedAt}-doc-${index}`),
    kind,
    label: getDocumentLabel(kind, document),
    name: getDocumentName(document, index),
    type: String(
      document?.type ?? document?.contentType ?? "application/octet-stream",
    ),
    size:
      typeof document?.size === "number" && Number.isFinite(document.size)
        ? document.size
        : 0,
    url: getDocumentUrl(document),
    uploadedAt: String(
      document?.uploadedAt ??
        document?.createdAt ??
        fallbackSubmittedAt ??
        new Date().toISOString(),
    ),
  };
};

const getRequestFallbackId = (request: any, index: number): number => {
  const idValue =
    request?.id ??
    request?.requestId ??
    request?.vendorRequestId ??
    request?.vendorId ??
    request?.applicantId;
  const parsedId =
    typeof idValue === "number" && Number.isFinite(idValue)
      ? idValue
      : Number(idValue);

  if (Number.isFinite(parsedId)) {
    return Number(parsedId);
  }

  return index + 1;
};

const extractLegacyDocumentUrls = (request: any) => {
  const businessLicenseUrl =
    request?.businessLicenseUrl ??
    request?.businessLicenseFileUrl ??
    request?.businessLicenseDocumentUrl ??
    request?.businessLicensePath ??
    request?.licenseUrl ??
    request?.licensePath;
  const healthCertificateUrl =
    request?.healthCertificateUrl ??
    request?.healthCertificateFileUrl ??
    request?.healthCertificateDocumentUrl ??
    request?.healthCertificatePath ??
    request?.certificateUrl ??
    request?.certificatePath;

  return {
    businessLicenseUrl,
    healthCertificateUrl,
  };
};

const isPendingVendorRequest = (request: VendorRequest) =>
  request.status === "pending";

const dedupeVendorRequestsById = (requests: VendorRequest[]) => {
  const seen = new Set<number>();
  return requests.filter((request) => {
    if (seen.has(request.id)) {
      return false;
    }
    seen.add(request.id);
    return true;
  });
};

function mapApiVendorRequest(request: any, index: number): VendorRequest {
  const parsedId = getRequestFallbackId(request, index);
  const submittedAt = String(
    request?.submitted ??
      request?.createdAt ??
      request?.submittedAt ??
      new Date().toISOString(),
  );

  const rawStatus = String(
    request?.status ?? request?.approvalStatus ?? "pending",
  ).toLowerCase();
  const status: VendorRequest["status"] =
    rawStatus === "approved" || rawStatus === "rejected"
      ? rawStatus
      : "pending";

  let documents: VendorDocument[] = Array.isArray(request?.documents)
    ? request.documents
        .map((document: any, docIndex: number) =>
          mapApiDocument(document, docIndex, submittedAt),
        )
        .filter((document: VendorDocument) => !!document.url)
    : [];

  if (documents.length === 0) {
    const { businessLicenseUrl, healthCertificateUrl } =
      extractLegacyDocumentUrls(request);

    if (typeof businessLicenseUrl === "string" && businessLicenseUrl.trim()) {
      documents.push(
        createDocumentFromUrl(
          businessLicenseUrl,
          "business_license",
          "Business License",
        ),
      );
    }

    if (typeof healthCertificateUrl === "string" && healthCertificateUrl.trim()) {
      documents.push(
        createDocumentFromUrl(
          healthCertificateUrl,
          "health_certificate",
          "Health Certificate",
        ),
      );
    }
  }

  return {
    id: parsedId,
    businessName: String(
      request?.businessName ?? request?.name ?? request?.vendorName ?? "Vendor",
    ),
    ownerName: String(
      request?.ownerName ??
        request?.ownerFullName ??
        request?.applicantName ??
        request?.fullName ??
        "",
    ),
    email: String(request?.email ?? ""),
    phone: String(request?.phone ?? request?.phoneNumber ?? ""),
    address: String(request?.address ?? request?.businessAddress ?? ""),
    category: String(request?.category ?? ""),
    submitted: submittedAt,
    documents,
    status,
    notes:
      typeof request?.notes === "string" && request.notes.trim()
        ? request.notes
        : undefined,
  };
}

// Keep local state for now (will be replaced with queries when backend is ready)
export function useModerationData() {
  const isDemoMode = isDemoModeEnabled();

  const [listings, setListings] = useState<Listing[]>(initialPendingListings);
  const [vendorRequests, setVendorRequests] = useState<VendorRequest[]>(() =>
    isDemoMode ? getInitialVendorRequestState() : [],
  );
  const [customerReports, setCustomerReports] = useState<CustomerReport[]>(
    initialCustomerReports,
  );
  const [activityLog, setActivityLog] = useState<ModerationAction[]>([]);

  const {
    data: pendingVendorRequestsFromApi,
    refetch: refetchPendingVendorRequests,
  } = useQuery({
    queryKey: ["moderation", "vendors", "pending", "all"],
    queryFn: async () => {
      const vendorRequestsFromApi = await getPendingVendorRequestsForAdmin();
      return vendorRequestsFromApi
        .map((request, index) => mapApiVendorRequest(request, index))
        .filter(isPendingVendorRequest);
    },
    enabled: !isDemoMode,
    refetchInterval: 15000,
    refetchOnWindowFocus: true,
    retry: 1,
  });

  useEffect(() => {
    if (!isDemoMode) {
      return;
    }

    const syncVendorRequests = () => {
      setVendorRequests(getInitialVendorRequestState());
    };

    syncVendorRequests();
    return subscribeToVendorApprovalStore(syncVendorRequests);
  }, [isDemoMode]);

  useEffect(() => {
    if (isDemoMode || !pendingVendorRequestsFromApi) {
      return;
    }

    setVendorRequests(
      dedupeVendorRequestsById(
        pendingVendorRequestsFromApi.filter(isPendingVendorRequest),
      ),
    );
  }, [isDemoMode, pendingVendorRequestsFromApi]);

  const addToActivityLog = (action: Omit<ModerationAction, "id">) => {
    setActivityLog((prev) => [
      {
        ...action,
        id: prev.length + 1,
      },
      ...prev,
    ]);
  };

  const getErrorStatusCode = (error: any): number | undefined =>
    error?.statusCode ?? error?.response?.status;

  const syncLocalVendorStatus = (
    vendor: VendorRequest | undefined,
    status: "approved" | "rejected",
    notes?: string,
  ) => {
    if (!vendor) {
      return;
    }

    const updatedById = updateVendorApprovalStatus(vendor.id, status, notes);
    if (!updatedById && vendor.email) {
      updateVendorApprovalStatusByEmail(vendor.email, status, notes);
    }
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
    const vendor = vendorRequests.find((item) => item.id === id);

    try {
      try {
        await approveVendorRequest(id);
      } catch (error: any) {
        const statusCode = getErrorStatusCode(error);
        if (statusCode !== 404) {
          throw error;
        }
      }

      syncLocalVendorStatus(vendor, "approved", "Vendor application approved");
      setVendorRequests((prev) => prev.filter((v) => v.id !== id));
      if (!isDemoMode) {
        await refetchPendingVendorRequests();
      }

      toast.success(`Vendor approved successfully!`);
      return { success: true };
    } catch (error) {
      console.error("Failed to approve vendor:", error);
      toast.error("Failed to approve vendor");
      return { success: false, error };
    }
  };

  const handleRejectVendor = async (id: number, data: RejectRequest) => {
    const vendor = vendorRequests.find((item) => item.id === id);
    const rejectionNotes = `${data.reason}: ${data.notes || ""}`.trim();

    try {
      try {
        await rejectVendorRequest(id, {
          reason: data.reason,
          notes: data.notes,
        });
      } catch (error: any) {
        const statusCode = getErrorStatusCode(error);
        if (statusCode !== 404) {
          throw error;
        }
      }

      syncLocalVendorStatus(vendor, "rejected", rejectionNotes);
      setVendorRequests((prev) => prev.filter((v) => v.id !== id));
      if (!isDemoMode) {
        await refetchPendingVendorRequests();
      }

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
    const vendorsById = new Map(
      vendorRequests.map((vendor) => [vendor.id, vendor] as const),
    );

    try {
      await Promise.all(
        ids.map(async (id) => {
          try {
            await approveVendorRequest(id);
          } catch (error: any) {
            const statusCode = getErrorStatusCode(error);
            if (statusCode !== 404) {
              throw error;
            }
          }
        }),
      );

      ids.forEach((id) =>
        syncLocalVendorStatus(
          vendorsById.get(id),
          "approved",
          "Vendor application approved",
        ),
      );
      setVendorRequests((prev) => prev.filter((v) => !ids.includes(v.id)));
      if (!isDemoMode) {
        await refetchPendingVendorRequests();
      }

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
    const vendorsById = new Map(
      vendorRequests.map((vendor) => [vendor.id, vendor] as const),
    );
    const rejectionNotes = `${data.reason}: ${data.notes || ""}`.trim();

    try {
      await Promise.all(
        ids.map(async (id) => {
          try {
            await rejectVendorRequest(id, {
              reason: data.reason,
              notes: data.notes,
            });
          } catch (error: any) {
            const statusCode = getErrorStatusCode(error);
            if (statusCode !== 404) {
              throw error;
            }
          }
        }),
      );

      ids.forEach((id) =>
        syncLocalVendorStatus(vendorsById.get(id), "rejected", rejectionNotes),
      );
      setVendorRequests((prev) => prev.filter((v) => !ids.includes(v.id)));
      if (!isDemoMode) {
        await refetchPendingVendorRequests();
      }

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
