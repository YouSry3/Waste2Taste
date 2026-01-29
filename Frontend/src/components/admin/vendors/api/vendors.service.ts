// AI AGENT: SERVICE LAYER FOR VENDORS API
// =======================================
// This service layer handles business logic and API communication.
// When backend is ready, replace mock implementations with actual API calls.

import { Vendor, VendorFormData, ApiResponse } from "./vendors.types";

// TODO: Replace with actual API base URL from environment variables
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:3000/api";

class VendorService {
  private getHeaders(): HeadersInit {
    return {
      "Content-Type": "application/json",
      // TODO: Add authentication token when backend is ready
      // 'Authorization': `Bearer ${localStorage.getItem('token')}`
    };
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }

  // TODO: Implement actual API calls
  async getAllVendors(params?: any): Promise<ApiResponse<Vendor[]>> {
    try {
      // TODO: Uncomment when backend is ready
      /*
      const queryParams = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE_URL}/vendors?${queryParams}`, {
        headers: this.getHeaders(),
      });
      return this.handleResponse<Vendor[]>(response);
      */

      // Mock implementation - REMOVE WHEN BACKEND IS READY
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        success: true,
        data: [],
        message: "Mock data - replace with actual API call",
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: error instanceof Error ? error.message : "Unknown error",
        error: "FETCH_ERROR",
      };
    }
  }

  async getVendorById(id: number): Promise<ApiResponse<Vendor>> {
    try {
      // TODO: Uncomment when backend is ready
      /*
      const response = await fetch(`${API_BASE_URL}/vendors/${id}`, {
        headers: this.getHeaders(),
      });
      return this.handleResponse<Vendor>(response);
      */

      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        success: true,
        data: {} as Vendor,
        message: "Mock data - replace with actual API call",
      };
    } catch (error) {
      return {
        success: false,
        data: {} as Vendor,
        message: error instanceof Error ? error.message : "Unknown error",
        error: "FETCH_ERROR",
      };
    }
  }

  async createVendor(vendorData: VendorFormData): Promise<ApiResponse<Vendor>> {
    try {
      // TODO: Uncomment when backend is ready
      /*
      const response = await fetch(`${API_BASE_URL}/vendors`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(vendorData),
      });
      return this.handleResponse<Vendor>(response);
      */

      await new Promise((resolve) => setTimeout(resolve, 800));
      return {
        success: true,
        data: { id: Date.now(), ...vendorData } as Vendor,
        message: "Mock data - replace with actual API call",
      };
    } catch (error) {
      return {
        success: false,
        data: {} as Vendor,
        message: error instanceof Error ? error.message : "Unknown error",
        error: "CREATE_ERROR",
      };
    }
  }

  async updateVendor(
    id: number,
    vendorData: Partial<VendorFormData>,
  ): Promise<ApiResponse<Vendor>> {
    try {
      // TODO: Uncomment when backend is ready
      /*
      const response = await fetch(`${API_BASE_URL}/vendors/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(vendorData),
      });
      return this.handleResponse<Vendor>(response);
      */

      await new Promise((resolve) => setTimeout(resolve, 600));
      return {
        success: true,
        data: { id, ...vendorData } as Vendor,
        message: "Mock data - replace with actual API call",
      };
    } catch (error) {
      return {
        success: false,
        data: {} as Vendor,
        message: error instanceof Error ? error.message : "Unknown error",
        error: "UPDATE_ERROR",
      };
    }
  }

  async deleteVendor(id: number): Promise<ApiResponse<void>> {
    try {
      // TODO: Uncomment when backend is ready
      /*
      const response = await fetch(`${API_BASE_URL}/vendors/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });
      return this.handleResponse<void>(response);
      */

      await new Promise((resolve) => setTimeout(resolve, 400));
      return {
        success: true,
        data: undefined,
        message: "Mock data - replace with actual API call",
      };
    } catch (error) {
      return {
        success: false,
        data: undefined,
        message: error instanceof Error ? error.message : "Unknown error",
        error: "DELETE_ERROR",
      };
    }
  }

  // Export functionality
  async exportVendorsToCSV(): Promise<Blob> {
    try {
      // TODO: Uncomment when backend is ready
      /*
      const response = await fetch(`${API_BASE_URL}/vendors/export`, {
        headers: this.getHeaders(),
      });
      return response.blob();
      */

      await new Promise((resolve) => setTimeout(resolve, 1000));
      return new Blob(["Mock CSV data"], { type: "text/csv" });
    } catch (error) {
      throw new Error("Failed to export vendors");
    }
  }
}

export const vendorService = new VendorService();
