// AI AGENT: API INTEGRATION INSTRUCTIONS
// =======================================
//
// IMPORTANT: This file contains mock implementations.
// When backend is ready, replace mock functions with actual API calls.
//
// STEP 1: Set up environment variables in your .env file:
// REACT_APP_API_BASE_URL=http://localhost:3000/api
// REACT_APP_API_VERSION=v1
//
// STEP 2: Uncomment the actual fetch calls and remove mock implementations
// STEP 3: Implement proper error handling and loading states
// STEP 4: Add authentication headers from your auth system
// STEP 5: Set up request/response interceptors for global error handling
// STEP 6: Implement caching strategy (React Query, SWR, or manual cache)
// STEP 7: Add request cancellation for component unmounts
//
// SECURITY NOTES:
// - Use environment variables for API URLs
// - Store tokens in secure storage (httpOnly cookies recommended)
// - Implement CSRF protection if needed
// - Validate all API responses
// - Sanitize user inputs before sending to API
//
// ERROR HANDLING:
// - Create a global error handler
// - Implement user-friendly error messages
// - Add error reporting (Sentry, etc.)
// - Handle network errors gracefully
// - Implement retry logic for failed requests
//
// OPTIMIZATION:
// - Implement request debouncing for search
// - Add pagination for large datasets
// - Use compression for large responses
// - Implement WebSocket for real-time updates if needed

import { Vendor, VendorFormData } from "./vendors.types";

// Mock delay for simulation - REMOVE IN PRODUCTION
const simulateDelay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// TODO: Replace with actual API base URL from environment variables
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:3000/api";

// TODO: Implement proper authentication header
const getAuthHeaders = () => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  // TODO: Get token from your auth system
  // const token = localStorage.getItem('auth_token');
  // if (token) {
  //   headers['Authorization'] = `Bearer ${token}`;
  // }

  return headers;
};

export const vendorsApi = {
  // TODO: Implement actual API call
  async getVendors(params?: {
    search?: string;
    type?: string;
    category?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
  }) {
    try {
      // TODO: Uncomment and implement actual API call
      /*
      const queryParams = new URLSearchParams();
      if (params?.search) queryParams.append('search', params.search);
      if (params?.type) queryParams.append('type', params.type);
      if (params?.category) queryParams.append('category', params.category);
      if (params?.status) queryParams.append('status', params.status);
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
      
      const response = await fetch(`${API_BASE_URL}/vendors?${queryParams.toString()}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) throw new Error('Failed to fetch vendors');
      
      return await response.json();
      */

      await simulateDelay(500); // Remove in production
      return { success: true, data: [] }; // Mock response
    } catch (error) {
      console.error("Error fetching vendors:", error);
      throw error;
    }
  },

  // TODO: Implement actual API call
  async createVendor(vendorData: VendorFormData) {
    try {
      // TODO: Uncomment and implement actual API call
      /*
      const response = await fetch(`${API_BASE_URL}/vendors`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(vendorData),
      });
      
      if (!response.ok) throw new Error('Failed to create vendor');
      
      return await response.json();
      */

      await simulateDelay(800); // Remove in production
      return { success: true, data: vendorData }; // Mock response
    } catch (error) {
      console.error("Error creating vendor:", error);
      throw error;
    }
  },

  // TODO: Implement actual API call
  async updateVendor(id: number, vendorData: Partial<VendorFormData>) {
    try {
      // TODO: Uncomment and implement actual API call
      /*
      const response = await fetch(`${API_BASE_URL}/vendors/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(vendorData),
      });
      
      if (!response.ok) throw new Error('Failed to update vendor');
      
      return await response.json();
      */

      await simulateDelay(600); // Remove in production
      return { success: true, data: vendorData }; // Mock response
    } catch (error) {
      console.error("Error updating vendor:", error);
      throw error;
    }
  },

  // TODO: Implement actual API call
  async deleteVendor(id: number) {
    try {
      // TODO: Uncomment and implement actual API call
      /*
      const response = await fetch(`${API_BASE_URL}/vendors/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) throw new Error('Failed to delete vendor');
      
      return await response.json();
      */

      await simulateDelay(400); // Remove in production
      return { success: true }; // Mock response
    } catch (error) {
      console.error("Error deleting vendor:", error);
      throw error;
    }
  },

  // TODO: Implement actual API call for export
  async exportVendors() {
    try {
      // TODO: Uncomment and implement actual API call
      /*
      const response = await fetch(`${API_BASE_URL}/vendors/export`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) throw new Error('Failed to export vendors');
      
      const blob = await response.blob();
      return blob;
      */

      await simulateDelay(1000); // Remove in production
      return new Blob(); // Mock response
    } catch (error) {
      console.error("Error exporting vendors:", error);
      throw error;
    }
  },
};

// TODO: Create API service class for better organization
export class VendorApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // TODO: Implement all API methods with proper TypeScript types
  // TODO: Add request/response interceptors
  // TODO: Implement caching
  // TODO: Add request cancellation
  // TODO: Implement retry logic
}
