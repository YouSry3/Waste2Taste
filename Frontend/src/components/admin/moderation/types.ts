import { VendorDocument } from "../../../types/vendorApproval";

// Status Types
export type ListingStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "changes_requested";
export type VendorStatus = "pending" | "approved" | "rejected";
export type ReportStatus =
  | "under_review"
  | "resolved"
  | "dismissed"
  | "warning_issued";

// Moderation Action Types
export type ModerationActionType =
  | "approval"
  | "rejection"
  | "changes_requested"
  | "bulk_approval"
  | "bulk_rejection"
  | "warning"
  | "resolution"
  | "dismissal"
  | "bulk_resolution"
  | "bulk_dismissal"
  | "vendor_approval"
  | "vendor_rejection"
  | "issued_warning"; // Keep existing for compatibility

export type ModerationTargetType = "listing" | "vendor" | "report";

// Main Entity Types
export interface Listing {
  id: number;
  vendor: string;
  vendorName: string; // Add this for activity logging
  title: string;
  category: string;
  price: string;
  originalPrice: string;
  quantity: number;
  pickupTime: string;
  submitted: string;
  image: string;
  flagged: boolean;
  aiFlag: {
    type: string;
    confidence: number;
    reason: string;
  } | null;
  status: ListingStatus;
}

export interface VendorRequest {
  id: number;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  category: string;
  submitted: string;
  documents: VendorDocument[];
  status: VendorStatus;
  notes?: string;
}

export interface CustomerReport {
  id: number;
  reporter: string;
  vendor: string;
  listing: string;
  orderId: string;
  issue: string;
  description: string;
  submitted: string;
  priority: "High" | "Medium" | "Low";
  status: ReportStatus;
}

// New comprehensive ModerationAction interface
export interface ModerationAction {
  id: number;
  type: ModerationActionType;
  targetType: ModerationTargetType;
  targetId: number | string;
  targetName: string;
  moderator: string; // Changed from moderatorName for consistency
  details: string;
  beforeStatus: string;
  afterStatus: string;
  timestamp: string;
  notes?: string;
  documents?: string[];
  // Keep old fields for compatibility
  moderatorName?: string;
  action?: string;
  itemType?: string;
  itemTitle?: string;
  detailsObj?: {
    itemId: number;
    vendorEmail?: string;
    customerEmail?: string;
    warningLevel?: string;
    followUpRequired?: boolean;
  };
}

// API Request/Response Types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Request Types
export interface RejectRequest {
  id: number;
  reason: string;
  notes?: string;
}

export interface ChangeRequest {
  id: number;
  changes: string;
}

export interface WarningRequest {
  reportId: number;
  warningType: "informal" | "formal" | "final";
  details: string;
}

// Filter Types
export interface ListingsFilters {
  status?: ListingStatus | "all";
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: "date" | "flagged" | "vendor";
}

export interface VendorsFilters {
  status?: VendorStatus | "all";
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ReportsFilters {
  status?: ReportStatus | "all";
  priority?: "High" | "Medium" | "Low" | "all";
  search?: string;
  page?: number;
  limit?: number;
}

export interface ActivityFilters {
  page?: number;
  limit?: number;
  sortBy?: "date" | "action";
  actionType?: string;
  itemType?: string;
}

// Activity log helper function
export function createModerationAction(
  action: Omit<ModerationAction, "id" | "timestamp">,
): ModerationAction {
  return {
    id: Date.now(),
    ...action,
    timestamp: new Date().toISOString(),
  };
}

// Type guard functions
export function isListingModerationAction(action: ModerationAction): boolean {
  return action.targetType === "listing";
}

export function isVendorModerationAction(action: ModerationAction): boolean {
  return action.targetType === "vendor";
}

export function isReportModerationAction(action: ModerationAction): boolean {
  return action.targetType === "report";
}

// Status helper functions
export function getStatusText(status: string): string {
  switch (status) {
    case "pending":
      return "Pending";
    case "approved":
      return "Approved";
    case "rejected":
      return "Rejected";
    case "changes_requested":
      return "Changes Requested";
    case "under_review":
      return "Under Review";
    case "resolved":
      return "Resolved";
    case "dismissed":
      return "Dismissed";
    case "warning_issued":
      return "Warning Issued";
    default:
      return status;
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "pending":
    case "under_review":
      return "bg-yellow-100 text-yellow-800";
    case "approved":
    case "resolved":
      return "bg-green-100 text-green-800";
    case "rejected":
    case "dismissed":
      return "bg-red-100 text-red-800";
    case "changes_requested":
      return "bg-blue-100 text-blue-800";
    case "warning_issued":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

// Action helper functions
export function getActionText(type: ModerationActionType): string {
  switch (type) {
    case "approval":
    case "vendor_approval":
      return "Approved";
    case "rejection":
    case "vendor_rejection":
      return "Rejected";
    case "changes_requested":
      return "Changes Requested";
    case "bulk_approval":
      return "Bulk Approved";
    case "bulk_rejection":
      return "Bulk Rejected";
    case "warning":
    case "issued_warning":
      return "Warning Issued";
    case "resolution":
      return "Resolved";
    case "dismissal":
      return "Dismissed";
    case "bulk_resolution":
      return "Bulk Resolved";
    case "bulk_dismissal":
      return "Bulk Dismissed";
    default:
      return type.replace(/_/g, " ");
  }
}

export function getActionColor(type: ModerationActionType): string {
  switch (type) {
    case "approval":
    case "vendor_approval":
    case "resolution":
    case "bulk_approval":
    case "bulk_resolution":
      return "bg-green-100 text-green-800";
    case "rejection":
    case "vendor_rejection":
    case "dismissal":
    case "bulk_rejection":
    case "bulk_dismissal":
      return "bg-red-100 text-red-800";
    case "changes_requested":
      return "bg-blue-100 text-blue-800";
    case "warning":
    case "issued_warning":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

// Initial Data (for mock/development)
// Add vendorName to initial listings
export const initialPendingListings: Listing[] = [
  {
    id: 1,
    vendor: "Green Valley Bakery",
    vendorName: "Green Valley Bakery", // Added
    title: "Bakery Surprise Bag",
    category: "Bakery",
    price: "$4.99",
    originalPrice: "$15.00",
    quantity: 5,
    pickupTime: "6:00 PM - 7:00 PM",
    submitted: "2025-10-30 10:30 AM",
    image:
      "https://images.unsplash.com/photo-1696721497670-d57754966c1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWtlcnklMjBmb29kJTIwcGFzdHJpZXN8ZW58MXx8fHwxNzYxODI3NTk4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    flagged: false,
    aiFlag: null,
    status: "pending",
  },
  {
    id: 2,
    vendor: "Fresh Market",
    vendorName: "Fresh Market", // Added
    title: "Produce Box",
    category: "Grocery",
    price: "$7.99",
    originalPrice: "$25.00",
    quantity: 8,
    pickupTime: "7:00 PM - 8:00 PM",
    submitted: "2025-10-30 09:15 AM",
    image:
      "https://images.unsplash.com/photo-1677653805080-59c57727c84e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHNhbGFkJTIwdmVnZXRhYmxlc3xlbnwxfHx8fDE3NjE3MzgwODN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    flagged: true,
    aiFlag: {
      type: "Spoiled Food",
      confidence: 0.87,
      reason: "AI detected visual signs of spoilage",
    },
    status: "pending",
  },
  {
    id: 3,
    vendor: "Downtown Deli",
    vendorName: "Downtown Deli", // Added
    title: "Sandwich Pack",
    category: "Restaurant",
    price: "$6.50",
    originalPrice: "$20.00",
    quantity: 4,
    pickupTime: "5:00 PM - 6:00 PM",
    submitted: "2025-10-30 08:45 AM",
    image:
      "https://images.unsplash.com/photo-1705647405231-c481e117e609?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW5kd2ljaCUyMGRlbGklMjBtZWF0fGVufDF8fHx8MTc2MTgyNzU5OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    flagged: false,
    aiFlag: null,
    status: "pending",
  },
  {
    id: 4,
    vendor: "Organic Bistro",
    vendorName: "Organic Bistro", // Added
    title: "Meal Box",
    category: "Restaurant",
    price: "$9.99",
    originalPrice: "$30.00",
    quantity: 4,
    pickupTime: "9:00 PM - 10:00 PM",
    submitted: "2025-10-30 11:00 AM",
    image:
      "https://images.unsplash.com/photo-1625944527261-06c90f1901e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVwYXJlZCUyMG1lYWxzJTIwcmVzdGF1cmFudHxlbnwxfHx8fDE3NjE4Mjc1OTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    flagged: false,
    aiFlag: null,
    status: "pending",
  },
  {
    id: 5,
    vendor: "Sweet Treats",
    vendorName: "Sweet Treats", // Added
    title: "Dessert Box",
    category: "Bakery",
    price: "$6.99",
    originalPrice: "$22.00",
    quantity: 6,
    pickupTime: "7:30 PM - 8:30 PM",
    submitted: "2025-10-30 10:00 AM",
    image:
      "https://images.unsplash.com/photo-1706463996554-6c6318946b3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNzZXJ0JTIwY2FrZSUyMGJha2VyeXxlbnwxfHx8fDE3NjE4Mjc2MDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    flagged: true,
    aiFlag: {
      type: "Spoiled Food",
      confidence: 0.92,
      reason: "AI detected mold or discoloration",
    },
    status: "pending",
  },
  {
    id: 6,
    vendor: "City Cafe",
    vendorName: "City Cafe", // Added
    title: "Coffee & Pastries",
    category: "Cafe",
    price: "$5.99",
    originalPrice: "$18.00",
    quantity: 3,
    pickupTime: "8:00 PM - 9:00 PM",
    submitted: "2025-10-30 09:30 AM",
    image:
      "https://images.unsplash.com/photo-1730660501229-145c09eb9b7a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBwYXN0cnklMjBjYWZlfGVufDF8fHx8MTc2MTgyNzYwMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    flagged: false,
    aiFlag: null,
    status: "pending",
  },
];

export const initialVendorRequests: VendorRequest[] = [
  {
    id: 1,
    businessName: "Nile Valley Restaurant",
    ownerName: "Ahmed Hassan",
    email: "ahmed@nilevalley.com",
    phone: "(+20) 2-111-2222",
    address: "Mohandessin, Giza",
    category: "Restaurant",
    submitted: "2025-10-28",
    documents: [
      {
        id: "mock-license-1",
        kind: "business_license",
        label: "Business License",
        name: "nile-valley-license.pdf",
        type: "application/pdf",
        size: 0,
        url: "",
        uploadedAt: "2025-10-28T09:00:00Z",
      },
      {
        id: "mock-health-1",
        kind: "health_certificate",
        label: "Health Certificate",
        name: "nile-valley-health-certificate.pdf",
        type: "application/pdf",
        size: 0,
        url: "",
        uploadedAt: "2025-10-28T09:00:00Z",
      },
    ],
    status: "pending",
  },
  {
    id: 2,
    businessName: "Cairo Fresh Bakery",
    ownerName: "Fatima Ali",
    email: "fatima@cairofresh.com",
    phone: "(+20) 2-222-3333",
    address: "New Cairo",
    category: "Bakery",
    submitted: "2025-10-29",
    documents: [
      {
        id: "mock-license-2",
        kind: "business_license",
        label: "Business License",
        name: "cairo-fresh-license.pdf",
        type: "application/pdf",
        size: 0,
        url: "",
        uploadedAt: "2025-10-29T10:00:00Z",
      },
      {
        id: "mock-health-2",
        kind: "health_certificate",
        label: "Health Certificate",
        name: "cairo-fresh-health-certificate.pdf",
        type: "application/pdf",
        size: 0,
        url: "",
        uploadedAt: "2025-10-29T10:00:00Z",
      },
    ],
    status: "pending",
  },
  {
    id: 3,
    businessName: "Mediterranean Cafe",
    ownerName: "Omar Saeed",
    email: "omar@medcafe.com",
    phone: "(+20) 2-333-4444",
    address: "Zamalek, Cairo",
    category: "Cafe",
    submitted: "2025-10-27",
    documents: [
      {
        id: "mock-license-3",
        kind: "business_license",
        label: "Business License",
        name: "mediterranean-cafe-license.pdf",
        type: "application/pdf",
        size: 0,
        url: "",
        uploadedAt: "2025-10-27T08:00:00Z",
      },
    ],
    status: "pending",
  },
];

export const initialCustomerReports: CustomerReport[] = [
  {
    id: 1,
    reporter: "Sarah Johnson",
    vendor: "Green Valley Bakery",
    listing: "Bakery Surprise Bag",
    orderId: "#ORD-1234",
    issue: "Food Quality",
    description: "Items were past expiration date",
    submitted: "2025-10-29",
    priority: "High",
    status: "under_review",
  },
  {
    id: 2,
    reporter: "Mike Chen",
    vendor: "City Cafe",
    listing: "Coffee & Pastries",
    orderId: "#ORD-1235",
    issue: "Vendor No-Show",
    description: "Vendor was closed during pickup window",
    submitted: "2025-10-29",
    priority: "Medium",
    status: "under_review",
  },
  {
    id: 3,
    reporter: "Emma Wilson",
    vendor: "Downtown Deli",
    listing: "Sandwich Pack",
    orderId: "#ORD-1236",
    issue: "Misleading Description",
    description: "Received different items than described",
    submitted: "2025-10-28",
    priority: "Low",
    status: "resolved",
  },
];

// Initial activity log for demonstration
export const initialActivityLog: ModerationAction[] = [
  {
    id: 1,
    type: "approval",
    targetType: "listing",
    targetId: 3,
    targetName: "Sandwich Pack",
    moderator: "Admin",
    details: "Approved listing for publication",
    beforeStatus: "pending",
    afterStatus: "approved",
    timestamp: "2025-10-30T09:30:00Z",
    notes: "Listing meets all quality standards",
  },
  {
    id: 2,
    type: "rejection",
    targetType: "vendor",
    targetId: 2,
    targetName: "Cairo Fresh Bakery",
    moderator: "Admin",
    details: "Rejected vendor application",
    beforeStatus: "pending",
    afterStatus: "rejected",
    timestamp: "2025-10-29T14:45:00Z",
    notes: "Missing required health certifications",
    documents: ["Business License", "Health Certificate"],
  },
  {
    id: 3,
    type: "resolution",
    targetType: "report",
    targetId: 1,
    targetName: "Green Valley Bakery",
    moderator: "Admin",
    details: "Resolved customer complaint",
    beforeStatus: "under_review",
    afterStatus: "resolved",
    timestamp: "2025-10-29T11:20:00Z",
    notes: "Issued refund and warning to vendor",
  },
];
