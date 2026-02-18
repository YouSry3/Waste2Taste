// src/components/admin/listings/api/listing.api.ts
import axios from "axios";
import { API_CONFIG, API_ENDPOINTS } from "../constants/api.config";
import {
  Listing,
  CreateListingDto,
  UpdateListingDto,
  ListingFilters,
} from "../types/listing.types";

// Create axios instance with configuration
const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: API_CONFIG.headers,
});

/**
 * Listing API Service
 * TODO: Update request/response types to match your actual API schema
 * AI: When backend is ready, update these functions to match your API response structure
 * Example: response.data might be { data: Listing[], total: number } or just Listing[]
 */

// Interceptor for adding auth token (uncomment when auth is ready)
// apiClient.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export const listingApi = {
  // GET all listings with pagination
  getAllListings: async (params?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) => {
    const response = await apiClient.get(API_ENDPOINTS.LISTINGS.BASE, {
      params,
    });
    return response.data;
    // TODO: Expected response structure: { data: Listing[], total: number, page: number, limit: number }
  },

  // GET listing by ID
  getListingById: async (id: number | string) => {
    const response = await apiClient.get(API_ENDPOINTS.LISTINGS.BY_ID(id));
    return response.data;
    // TODO: Expected response structure: Listing
  },

  // POST create new listing
  createListing: async (listingData: CreateListingDto) => {
    const response = await apiClient.post(
      API_ENDPOINTS.LISTINGS.BASE,
      listingData,
    );
    return response.data;
    // TODO: Expected response structure: { message: string, data: Listing }
  },

  // PUT update listing
  updateListing: async (id: number | string, listingData: UpdateListingDto) => {
    const response = await apiClient.put(
      API_ENDPOINTS.LISTINGS.BY_ID(id),
      listingData,
    );
    return response.data;
    // TODO: Expected response structure: { message: string, data: Listing }
  },

  // DELETE listing
  deleteListing: async (id: number | string) => {
    const response = await apiClient.delete(API_ENDPOINTS.LISTINGS.BY_ID(id));
    return response.data;
    // TODO: Expected response structure: { message: string }
  },

  // GET filtered listings
  getFilteredListings: async (filters: ListingFilters) => {
    const response = await apiClient.get(API_ENDPOINTS.LISTINGS.FILTER, {
      params: filters,
    });
    return response.data;
    // TODO: Expected response structure: { data: Listing[], total: number }
  },

  // GET listings by search term
  searchListings: async (searchTerm: string) => {
    const response = await apiClient.get(API_ENDPOINTS.LISTINGS.SEARCH, {
      params: { q: searchTerm },
    });
    return response.data;
    // TODO: Expected response structure: Listing[]
  },

  // GET available categories
  getCategories: async () => {
    const response = await apiClient.get(API_ENDPOINTS.CATEGORIES);
    return response.data;
    // TODO: Expected response structure: string[] or Category[]
  },

  // GET listing statistics
  getListingStats: async () => {
    const response = await apiClient.get(API_ENDPOINTS.LISTINGS.STATS);
    return response.data;
    // TODO: Expected response structure: { active: number, soldOut: number, totalRevenue: number, etc. }
  },
};
