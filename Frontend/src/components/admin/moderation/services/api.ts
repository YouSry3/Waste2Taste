import axios from "axios";
import {
  Listing,
  VendorRequest,
  CustomerReport,
  ModerationAction,
  RejectRequest,
  ChangeRequest,
  WarningRequest,
  ApiResponse,
  PaginatedResponse,
} from "../types";

// Configure axios instance
const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request interceptor for adding auth token
API.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error("Unauthorized access - please login again");
    }
    return Promise.reject(error);
  },
);

// Listings API
export const listingsAPI = {
  // Get all listings with filters
  getListings: (params?: {
    status?: string;
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
  }) =>
    API.get<PaginatedResponse<Listing>>("/moderation/listings", {
      params,
    }).then((res) => res.data),

  // Get single listing
  getListing: (id: number) =>
    API.get<ApiResponse<Listing>>(`/moderation/listings/${id}`).then(
      (res) => res.data,
    ),

  // Approve listing
  approveListing: (id: number) =>
    API.post<ApiResponse<Listing>>(`/moderation/listings/${id}/approve`).then(
      (res) => res.data,
    ),

  // Reject listing
  rejectListing: (id: number, data: RejectRequest) =>
    API.post<ApiResponse<Listing>>(
      `/moderation/listings/${id}/reject`,
      data,
    ).then((res) => res.data),

  // Request changes for listing
  requestChanges: (id: number, data: ChangeRequest) =>
    API.post<ApiResponse<Listing>>(
      `/moderation/listings/${id}/request-changes`,
      data,
    ).then((res) => res.data),

  // Bulk approve listings
  bulkApproveListings: (ids: number[]) =>
    API.post<ApiResponse<{ approved: number }>>(
      "/moderation/listings/bulk-approve",
      { ids },
    ).then((res) => res.data),

  // Bulk reject listings
  bulkRejectListings: (ids: number[], data: RejectRequest) =>
    API.post<ApiResponse<{ rejected: number }>>(
      "/moderation/listings/bulk-reject",
      { ids, ...data },
    ).then((res) => res.data),

  // AI feedback for flagged listings
  submitAIFeedback: (
    listingId: number,
    feedback: { correct: boolean; comment?: string },
  ) =>
    API.post<ApiResponse<void>>(
      `/moderation/listings/${listingId}/ai-feedback`,
      feedback,
    ).then((res) => res.data),
};

// Vendors API
export const vendorsAPI = {
  // Get all vendor requests with filters
  getVendorRequests: (params?: {
    status?: string;
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) =>
    API.get<PaginatedResponse<VendorRequest>>("/moderation/vendors", {
      params,
    }).then((res) => res.data),

  // Get single vendor request
  getVendorRequest: (id: number) =>
    API.get<ApiResponse<VendorRequest>>(`/moderation/vendors/${id}`).then(
      (res) => res.data,
    ),

  // Approve vendor
  approveVendor: (id: number) =>
    API.post<ApiResponse<VendorRequest>>(
      `/moderation/vendors/${id}/approve`,
    ).then((res) => res.data),

  // Reject vendor
  rejectVendor: (id: number, data: RejectRequest) =>
    API.post<ApiResponse<VendorRequest>>(
      `/moderation/vendors/${id}/reject`,
      data,
    ).then((res) => res.data),

  // Bulk approve vendors
  bulkApproveVendors: (ids: number[]) =>
    API.post<ApiResponse<{ approved: number }>>(
      "/moderation/vendors/bulk-approve",
      { ids },
    ).then((res) => res.data),

  // Bulk reject vendors
  bulkRejectVendors: (ids: number[], data: RejectRequest) =>
    API.post<ApiResponse<{ rejected: number }>>(
      "/moderation/vendors/bulk-reject",
      { ids, ...data },
    ).then((res) => res.data),

  // View vendor documents
  getVendorDocuments: (id: number) =>
    API.get<ApiResponse<string[]>>(`/moderation/vendors/${id}/documents`).then(
      (res) => res.data,
    ),

  // Contact vendor applicant
  contactVendor: (id: number, message: string) =>
    API.post<ApiResponse<void>>(`/moderation/vendors/${id}/contact`, {
      message,
    }).then((res) => res.data),
};

// Reports API
export const reportsAPI = {
  // Get all reports with filters
  getReports: (params?: {
    status?: string;
    priority?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) =>
    API.get<PaginatedResponse<CustomerReport>>("/moderation/reports", {
      params,
    }).then((res) => res.data),

  // Get single report
  getReport: (id: number) =>
    API.get<ApiResponse<CustomerReport>>(`/moderation/reports/${id}`).then(
      (res) => res.data,
    ),

  // Resolve report
  resolveReport: (id: number) =>
    API.post<ApiResponse<CustomerReport>>(
      `/moderation/reports/${id}/resolve`,
    ).then((res) => res.data),

  // Dismiss report
  dismissReport: (id: number) =>
    API.post<ApiResponse<CustomerReport>>(
      `/moderation/reports/${id}/dismiss`,
    ).then((res) => res.data),

  // Issue warning for report
  issueWarning: (id: number, data: WarningRequest) =>
    API.post<ApiResponse<CustomerReport>>(
      `/moderation/reports/${id}/warn`,
      data,
    ).then((res) => res.data),

  // Bulk resolve reports
  bulkResolveReports: (ids: number[]) =>
    API.post<ApiResponse<{ resolved: number }>>(
      "/moderation/reports/bulk-resolve",
      { ids },
    ).then((res) => res.data),

  // Bulk dismiss reports
  bulkDismissReports: (ids: number[]) =>
    API.post<ApiResponse<{ dismissed: number }>>(
      "/moderation/reports/bulk-dismiss",
      { ids },
    ).then((res) => res.data),

  // Contact customer regarding report
  contactCustomer: (id: number, message: string) =>
    API.post<ApiResponse<void>>(`/moderation/reports/${id}/contact-customer`, {
      message,
    }).then((res) => res.data),

  // Contact vendor regarding report
  contactReportVendor: (id: number, message: string) =>
    API.post<ApiResponse<void>>(`/moderation/reports/${id}/contact-vendor`, {
      message,
    }).then((res) => res.data),
};

// Activity Log API
export const activityAPI = {
  // Get activity log
  getActivityLog: (params?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    actionType?: string;
    itemType?: string;
  }) =>
    API.get<PaginatedResponse<ModerationAction>>("/moderation/activity", {
      params,
    }).then((res) => res.data),

  // Add activity log entry (usually done automatically by backend)
  addActivity: (data: Omit<ModerationAction, "id">) =>
    API.post<ApiResponse<ModerationAction>>("/moderation/activity", data).then(
      (res) => res.data,
    ),

  // Clear activity log
  clearActivityLog: () =>
    API.delete<ApiResponse<void>>("/moderation/activity").then(
      (res) => res.data,
    ),

  // Get activity details
  getActivityDetails: (id: number) =>
    API.get<ApiResponse<ModerationAction>>(`/moderation/activity/${id}`).then(
      (res) => res.data,
    ),
};

// Stats API
export const statsAPI = {
  // Get moderation dashboard stats
  getDashboardStats: () =>
    API.get<
      ApiResponse<{
        pendingVendors: number;
        openReports: number;
        pendingListings: number;
        flaggedListings: number;
        recentActivity: number;
      }>
    >("/moderation/stats").then((res) => res.data),

  // Get moderation activity stats
  getActivityStats: (period: "day" | "week" | "month" | "year") =>
    API.get<
      ApiResponse<{
        approvals: number;
        rejections: number;
        warnings: number;
        changeRequests: number;
      }>
    >(`/moderation/stats/activity?period=${period}`).then((res) => res.data),
};

// Export all APIs
export const moderationAPI = {
  listings: listingsAPI,
  vendors: vendorsAPI,
  reports: reportsAPI,
  activity: activityAPI,
  stats: statsAPI,
};
