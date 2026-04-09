export type VendorApprovalStatus = "pending" | "approved" | "rejected";

export type VendorDocumentKind =
  | "business_license"
  | "health_certificate";

export interface VendorDocument {
  id: string;
  kind: VendorDocumentKind;
  label: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
}

export interface VendorApprovalRequest {
  id: number;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  category: string;
  submitted: string;
  documents: VendorDocument[];
  status: VendorApprovalStatus;
  notes?: string;
}
