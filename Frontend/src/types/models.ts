/**
 * Type definitions for data models
 * These should match your ASP.NET Core backend models/DTOs
 */

/**
 * Common enums
 */
export enum UserRole {
  Admin = 'Admin',
  Vendor = 'Vendor',
  Charity = 'Charity',
  Customer = 'Customer',
}

export enum ListingStatus {
  Pending = 'Pending',
  Active = 'Active',
  Expired = 'Expired',
  Rejected = 'Rejected',
  Completed = 'Completed',
}

export enum OrderStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  ReadyForPickup = 'ReadyForPickup',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
  Refunded = 'Refunded',
}

export enum ReportStatus {
  PendingResponse = 'PendingResponse',
  UnderReview = 'UnderReview',
  Resolved = 'Resolved',
  Rejected = 'Rejected',
}

export enum VendorRequestStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
}

export enum VerificationStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
}

/**
 * Authentication Response Models
 * These match the actual backend API responses
 */

/**
 * Backend LoginResponse - raw from backend
 */
export interface BackendLoginResponse {
  name: string;
  email: string;
  type: 'admin' | 'vendor' | 'charity';
  token: string;
  expireAt: number; // Unix timestamp in seconds
}

/**
 * Backend RegisterResponse - raw from backend
 */
export interface BackendRegisterResponse {
  email: string;
  name: string;
  type: 'admin' | 'vendor' | 'charity';
}

/**
 * Backend Error Response
 */
export interface BackendErrorResponse {
  code: string;
  description: string;
}

/**
 * Frontend-normalized LoginResponse for internal use
 */
export interface LoginResponse {
  token: string;
  expiration: string; // ISO date string
  user: {
    id: string;
    email: string;
    name: string;
    panelType: 'admin' | 'vendor' | 'charity';
    roles: string[];
  };
}

/**
 * Frontend-normalized RegisterResponse for internal use
 */
export interface RegisterResponse {
  email: string;
  name: string;
  panelType: 'admin' | 'vendor' | 'charity';
}

/**
 * User model
 */
export interface User {
  id: string;
  email: string;
  name: string;
  phoneNumber?: string;
  role: UserRole;
  createdAt: string;
  isActive: boolean;
  profileImage?: string;
}

/**
 * Vendor model
 */
export interface Vendor {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phoneNumber: string;
  type: string; // 'Bakery' | 'Restaurant' | 'GroceryStore' | 'NGO'
  status: VendorRequestStatus;
  createdAt: string;
  isActive: boolean;
  locations: VendorLocation[];
  totalListings?: number;
  totalOrders?: number;
  rating?: number;
}

/**
 * Vendor location model
 */
export interface VendorLocation {
  id: string;
  vendorId: string;
  name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  phoneNumber?: string;
  isActive: boolean;
}

/**
 * Listing model
 */
export interface Listing {
  id: string;
  vendorId: string;
  vendorName: string;
  vendorLocationId?: string;
  title: string;
  description: string;
  category: string;
  originalPrice: number;
  discountedPrice: number;
  quantity: number;
  availableQuantity: number;
  pickupTimeStart: string;
  pickupTimeEnd: string;
  expiryDate: string;
  status: ListingStatus;
  images: string[];
  isFree: boolean;
  isNGODonation: boolean;
  aiDetectionFlag?: {
    isFlagged: boolean;
    reason?: string;
    confidence?: number;
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * Order model
 */
export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  vendorId: string;
  vendorName: string;
  listingId: string;
  listingTitle: string;
  quantity: number;
  totalAmount: number;
  status: OrderStatus;
  pickupTime: string;
  createdAt: string;
  updatedAt: string;
  refundAmount?: number;
}

/**
 * Customer report model
 */
export interface CustomerReport {
  id: string;
  reportNumber: string;
  customerId: string;
  customerName: string;
  orderId: string;
  orderNumber: string;
  vendorId: string;
  vendorName: string;
  listingId: string;
  listingTitle: string;
  reason: string;
  description: string;
  status: ReportStatus;
  refundAmount?: number;
  vendorResponse?: string;
  proofImages?: string[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

/**
 * Vendor request model
 */
export interface VendorRequest {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phoneNumber: string;
  businessType: string;
  address: string;
  city: string;
  documents: string[];
  status: VendorRequestStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewNotes?: string;
}

/**
 * Charity verification request model
 */
export interface VerificationRequest {
  id: string;
  userId: string;
  userName: string;
  email: string;
  phoneNumber: string;
  documentType: string;
  documentNumber: string;
  documentImages: string[];
  status: VerificationStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewNotes?: string;
}

/**
 * Approved charity user model
 */
export interface ApprovedUser {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  approvedAt: string;
  totalFreebiesCollected: number;
  lastPickupDate?: string;
  isActive: boolean;
}

/**
 * Sub-account model
 */
export interface SubAccount {
  id: string;
  vendorId: string;
  name: string;
  email: string;
  role: string;
  assignedLocations: VendorLocation[];
  isActive: boolean;
  createdAt: string;
}

/**
 * Dashboard statistics models
 */
export interface AdminDashboardStats {
  totalRevenue: number;
  totalOrders: number;
  activeVendors: number;
  activeUsers: number;
  pendingVendorRequests: number;
  pendingReports: number;
  pendingListings: number;
  revenueChange: number; // percentage
  ordersChange: number; // percentage
}

export interface VendorDashboardStats {
  totalRevenue: number;
  totalOrders: number;
  activeListings: number;
  completedOrders: number;
  pendingOrders: number;
  revenueChange: number; // percentage
  ordersChange: number; // percentage
}

export interface CharityDashboardStats {
  pendingVerifications: number;
  approvedUsers: number;
  activeListings: number;
  totalFreebiesDistributed: number;
  peopleHelpedToday: number;
  peopleHelpedThisMonth: number;
}

/**
 * Analytics data models
 */
export interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
}

export interface ListingAnalytics {
  listingId: string;
  listingTitle: string;
  totalOrders: number;
  totalRevenue: number;
  averageRating: number;
}
