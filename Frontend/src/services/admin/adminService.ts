/**
 * Admin/Moderation Service
 * 
 * Service layer for admin panel operations
 * This demonstrates how to integrate with ASP.NET Core API endpoints
 */

import { apiClient } from '../api/apiClient';
import { API_CONFIG, PaginationParams, PaginatedResponse } from '../api/apiConfig';
import {
  AdminDashboardStats,
  Listing,
  Order,
  Vendor,
  User,
  CustomerReport,
  VendorRequest,
  VendorLocation,
} from '../../types/models';

/**
 * Admin Service Class
 */
class AdminService {
  /**
   * Get dashboard statistics
   */
  async getDashboardStats(): Promise<AdminDashboardStats> {
    const response = await apiClient.get<AdminDashboardStats>(
      API_CONFIG.ENDPOINTS.ADMIN.DASHBOARD
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Failed to fetch dashboard stats');
  }

  /**
   * Get all listings with pagination
   */
  async getListings(params?: PaginationParams): Promise<PaginatedResponse<Listing>> {
    const response = await apiClient.get<PaginatedResponse<Listing>>(
      API_CONFIG.ENDPOINTS.ADMIN.LISTINGS,
      params as Record<string, string | number | boolean>
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Failed to fetch listings');
  }

  /**
   * Get listing by ID
   */
  async getListingById(id: string): Promise<Listing> {
    const response = await apiClient.get<Listing>(
      `${API_CONFIG.ENDPOINTS.ADMIN.LISTINGS}/${id}`
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Failed to fetch listing');
  }

  /**
   * Update listing status
   */
  async updateListingStatus(id: string, status: string): Promise<Listing> {
    const response = await apiClient.patch<Listing>(
      `${API_CONFIG.ENDPOINTS.ADMIN.LISTINGS}/${id}/status`,
      { status }
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Failed to update listing status');
  }

  /**
   * Get all orders with pagination
   */
  async getOrders(params?: PaginationParams): Promise<PaginatedResponse<Order>> {
    const response = await apiClient.get<PaginatedResponse<Order>>(
      API_CONFIG.ENDPOINTS.ADMIN.ORDERS,
      params as Record<string, string | number | boolean>
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Failed to fetch orders');
  }

  /**
   * Get all vendors with pagination
   */
  async getVendors(params?: PaginationParams): Promise<PaginatedResponse<Vendor>> {
    const response = await apiClient.get<PaginatedResponse<Vendor>>(
      API_CONFIG.ENDPOINTS.ADMIN.VENDORS,
      params as Record<string, string | number | boolean>
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Failed to fetch vendors');
  }

  /**
   * Get all users with pagination
   */
  async getUsers(params?: PaginationParams): Promise<PaginatedResponse<User>> {
    const response = await apiClient.get<PaginatedResponse<User>>(
      API_CONFIG.ENDPOINTS.ADMIN.USERS,
      params as Record<string, string | number | boolean>
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Failed to fetch users');
  }

  /**
   * Get vendor locations for map view
   */
  async getVendorLocations(): Promise<VendorLocation[]> {
    const response = await apiClient.get<VendorLocation[]>(
      API_CONFIG.ENDPOINTS.ADMIN.MAP
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Failed to fetch vendor locations');
  }

  /**
   * Get pending listing moderation queue
   */
  async getPendingListings(params?: PaginationParams): Promise<PaginatedResponse<Listing>> {
    const response = await apiClient.get<PaginatedResponse<Listing>>(
      API_CONFIG.ENDPOINTS.ADMIN.MODERATION.LISTINGS,
      params as Record<string, string | number | boolean>
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Failed to fetch pending listings');
  }

  /**
   * Approve or reject a listing
   */
  async moderateListing(id: string, approved: boolean, notes?: string): Promise<Listing> {
    const response = await apiClient.post<Listing>(
      `${API_CONFIG.ENDPOINTS.ADMIN.MODERATION.LISTINGS}/${id}/moderate`,
      { approved, notes }
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Failed to moderate listing');
  }

  /**
   * Get customer reports
   */
  async getCustomerReports(params?: PaginationParams): Promise<PaginatedResponse<CustomerReport>> {
    const response = await apiClient.get<PaginatedResponse<CustomerReport>>(
      API_CONFIG.ENDPOINTS.ADMIN.MODERATION.REPORTS,
      params as Record<string, string | number | boolean>
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Failed to fetch customer reports');
  }

  /**
   * Update customer report status
   */
  async updateReportStatus(id: string, status: string, resolution?: string): Promise<CustomerReport> {
    const response = await apiClient.patch<CustomerReport>(
      `${API_CONFIG.ENDPOINTS.ADMIN.MODERATION.REPORTS}/${id}`,
      { status, resolution }
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Failed to update report status');
  }

  /**
   * Get vendor requests
   */
  async getVendorRequests(params?: PaginationParams): Promise<PaginatedResponse<VendorRequest>> {
    const response = await apiClient.get<PaginatedResponse<VendorRequest>>(
      API_CONFIG.ENDPOINTS.ADMIN.MODERATION.VENDOR_REQUESTS,
      params as Record<string, string | number | boolean>
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Failed to fetch vendor requests');
  }

  /**
   * Approve or reject vendor request
   */
  async moderateVendorRequest(
    id: string,
    approved: boolean,
    notes?: string
  ): Promise<VendorRequest> {
    const response = await apiClient.post<VendorRequest>(
      `${API_CONFIG.ENDPOINTS.ADMIN.MODERATION.VENDOR_REQUESTS}/${id}/moderate`,
      { approved, notes }
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Failed to moderate vendor request');
  }
}

// Create and export singleton instance
export const adminService = new AdminService();
