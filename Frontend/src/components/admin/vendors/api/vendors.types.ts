export interface Vendor {
  id: number;
  name: string;
  type: "Vendor" | "NGO Partner";
  category: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  listings: number;
  revenue: string;
  rating: number;
  status: "Active" | "Inactive";
}

export type VendorFormData = Omit<
  Vendor,
  "id" | "listings" | "revenue" | "rating" | "status"
>;

export interface FormErrors {
  [key: string]: string;
}

export interface FilterState {
  searchTerm: string;
  filterType: string;
  filterCategory: string;
  filterStatus: string;
  sortBy: "name" | "revenue" | "rating" | "listings";
  sortOrder: "asc" | "desc";
}

// ADD THESE MISSING TYPES:
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  meta?: Record<string, any>;
  error?: {
    code: string;
    details?: any;
  };
}

export interface VendorQueryParams {
  search?: string;
  type?: string;
  category?: string;
  status?: string;
  sortBy?: "name" | "revenue" | "rating" | "listings" | "createdAt";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export type ExportFormat = "csv" | "excel" | "pdf" | "json";

export interface VendorStats {
  totalVendors: number;
  ngoPartners: number;
  activeListings: number;
  totalRevenue: number;
  averageRating: number;
  activeVendors: number;
  inactiveVendors: number;
}
