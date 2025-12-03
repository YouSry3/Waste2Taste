/**
 * Vendor/Corporate Service
 * 
 * Service layer for vendor/corporate panel operations
 */

import { apiClient } from '../api/apiClient';
import { API_CONFIG, PaginationParams, PaginatedResponse } from '../api/apiConfig';
import {
  VendorDashboardStats,
  Listing,
  Order,
  CustomerReport,
  SubAccount,
  VendorLocation,
  ListingAnalytics,
  RevenueData,
} from '../../types/models';

/**
 * Vendor Service Class
 */
class VendorService {
  /**
   * Get dashboard statistics for selected branches
   */
  async getDashboardStats(branchIds?: string[]): Promise<VendorDashboardStats> {
    const params = branchIds ? { branchIds: branchIds.join(',') } : undefined;
    
    const response = await apiClient.get<VendorDashboardStats>(
      API_CONFIG.ENDPOINTS.VENDOR.DASHBOARD,
      params as Record<string, string | number | boolean>
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Failed to fetch dashboard stats');
  }

  /**
   * Get vendor branches/locations
   */
  async getBranches(): Promise<VendorLocation[]> {
    const response = await apiClient.get<VendorLocation[]>(
      API_CONFIG.ENDPOINTS.VENDOR.BRANCHES
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Failed to fetch branches');
  }

  /**
   * Get orders for vendor
   */
  async getOrders(params?: PaginationParams & { branchIds?: string[] }): Promise<PaginatedResponse<Order>> {
    const response = await apiClient.get<PaginatedResponse<Order>>(
      API_CONFIG.ENDPOINTS.VENDOR.ORDERS,
      params as Record<string, string | number | boolean>
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Failed to fetch orders');
  }

  /**
   * Update order status
   */
  async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    const response = await apiClient.patch<Order>(
      `${API_CONFIG.ENDPOINTS.VENDOR.ORDERS}/${orderId}/status`,
      { status }
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Failed to update order status');
  }

  /**
   * Get vendor listings
   */
  async getListings(params?: PaginationParams & { branchIds?: string[] }): Promise<PaginatedResponse<Listing>> {
    const response = await apiClient.get<PaginatedResponse<Listing>>(
      API_CONFIG.ENDPOINTS.VENDOR.LISTINGS,
      params as Record<string, string | number | boolean>
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Failed to fetch listings');
  }

  /**
   * Create new listing
   */
  async createListing(listingData: Partial<Listing>): Promise<Listing> {
    const response = await apiClient.post<Listing>(
      API_CONFIG.ENDPOINTS.VENDOR.LISTINGS,
      listingData
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Failed to create listing');
  }

  /**
   * Update listing
   */
  async updateListing(id: string, listingData: Partial<Listing>): Promise<Listing> {
    const response = await apiClient.put<Listing>(
      `${API_CONFIG.ENDPOINTS.VENDOR.LISTINGS}/${id}`,
      listingData
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Failed to update listing');
  }

  /**
   * Delete listing
   */
  async deleteListing(id: string): Promise<void> {
    const response = await apiClient.delete(
      `${API_CONFIG.ENDPOINTS.VENDOR.LISTINGS}/${id}`
    );

    if (!response.success) {
      throw new Error(response.message || 'Failed to delete listing');
    }
  }

  /**
   * Toggle listing active status
   */
  async toggleListingStatus(id: string, active: boolean): Promise<Listing> {
    const response = await apiClient.patch<Listing>(
      `${API_CONFIG.ENDPOINTS.VENDOR.LISTINGS}/${id}/toggle`,
      { active }
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Failed to toggle listing status');
  }

  /**
   * Get analytics data
   */
  async getAnalytics(params?: {
    branchIds?: string[];
    startDate?: string;
    endDate?: string;
  }): Promise<{
    revenue: RevenueData[];
    topListings: ListingAnalytics[];
  }> {
    const response = await apiClient.get<{
      revenue: RevenueData[];
      topListings: ListingAnalytics[];
    }>(
      API_CONFIG.ENDPOINTS.VENDOR.ANALYTICS,
      params as Record<string, string | number | boolean>
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Failed to fetch analytics');
  }

  /**
   * Get customer reports
   */
  async getReports(params?: PaginationParams): Promise<PaginatedResponse<CustomerReport>> {
    const response = await apiClient.get<PaginatedResponse<CustomerReport>>(
      API_CONFIG.ENDPOINTS.VENDOR.REPORTS,
      params as Record<string, string | number | boolean>
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Failed to fetch reports');
  }

  /**
   * Respond to customer report
   */
  async respondToReport(
    reportId: string,
    response: string,
    proofImages?: string[]
  ): Promise<CustomerReport> {
    const responseData = await apiClient.post<CustomerReport>(
      `${API_CONFIG.ENDPOINTS.VENDOR.REPORTS}/${reportId}/respond`,
      { response, proofImages }
    );

    if (responseData.success && responseData.data) {
      return responseData.data;
    }

    throw new Error(responseData.message || 'Failed to submit response');
  }

  /**
   * Get sub-accounts (Corporate Control)
   */
  async getSubAccounts(): Promise<SubAccount[]> {
    const response = await apiClient.get<SubAccount[]>(
      API_CONFIG.ENDPOINTS.VENDOR.CORPORATE.SUB_ACCOUNTS
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Failed to fetch sub-accounts');
  }

  /**
   * Create sub-account
   */
  async createSubAccount(subAccountData: {
    name: string;
    email: string;
    role: string;
    locationIds: string[];
  }): Promise<SubAccount> {
    const response = await apiClient.post<SubAccount>(
      API_CONFIG.ENDPOINTS.VENDOR.CORPORATE.SUB_ACCOUNTS,
      subAccountData
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Failed to create sub-account');
  }

  /**
   * Update sub-account
   */
  async updateSubAccount(
    id: string,
    subAccountData: Partial<{
      name: string;
      email: string;
      role: string;
      locationIds: string[];
      isActive: boolean;
    }>
  ): Promise<SubAccount> {
    const response = await apiClient.put<SubAccount>(
      `${API_CONFIG.ENDPOINTS.VENDOR.CORPORATE.SUB_ACCOUNTS}/${id}`,
      subAccountData
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Failed to update sub-account');
  }

  /**
   * Delete sub-account
   */
  async deleteSubAccount(id: string): Promise<void> {
    const response = await apiClient.delete(
      `${API_CONFIG.ENDPOINTS.VENDOR.CORPORATE.SUB_ACCOUNTS}/${id}`
    );

    if (!response.success) {
      throw new Error(response.message || 'Failed to delete sub-account');
    }
  }

  /**
   * Get available locations for corporate control
   */
  async getCorporateLocations(): Promise<VendorLocation[]> {
    const response = await apiClient.get<VendorLocation[]>(
      API_CONFIG.ENDPOINTS.VENDOR.CORPORATE.LOCATIONS
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Failed to fetch locations');
  }

  /**
   * Upload listing image
   * 
   * Note: This is a multipart/form-data request
   * You may need to adjust the apiClient for file uploads
   */
  async uploadListingImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);

    // For file uploads, you might need a separate method in apiClient
    // or handle FormData differently
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.VENDOR.LISTINGS}/upload-image`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiClient.getAuthToken()}`,
        },
        body: formData,
      }
    );

    const data = await response.json();

    if (response.ok && data.success) {
      return data.data.imageUrl;
    }

    throw new Error(data.message || 'Failed to upload image');
  }
}

// Create and export singleton instance
export const vendorService = new VendorService();
