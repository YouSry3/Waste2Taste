import axios from "axios";
import { API_CONFIG, API_ENDPOINTS } from "../constants/api.config";
import {
  Listing,
  CreateListingDto,
  UpdateListingDto,
} from "../types/listing.types";

const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: API_CONFIG.headers,
});

// Backend response shape
export type ListingsResponse = {
  activeCount: number;
  listings: Listing[];
};

export const listingApi = {
  getAllListings: async (params?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) => {
    const res = await apiClient.get<ListingsResponse>(
      API_ENDPOINTS.LISTINGS.BASE,
      { params },
    );

    return res.data;
  },

  getListingById: async (id: number | string) => {
    const res = await apiClient.get<Listing>(API_ENDPOINTS.LISTINGS.BY_ID(id));
    return res.data;
  },

  createListing: async (data: CreateListingDto) => {
    const res = await apiClient.post<{ message: string; data: Listing }>(
      API_ENDPOINTS.LISTINGS.BASE,
      data,
    );
    return res.data;
  },

  updateListing: async (id: number | string, data: UpdateListingDto) => {
    const res = await apiClient.put<{ message: string; data: Listing }>(
      API_ENDPOINTS.LISTINGS.BY_ID(id),
      data,
    );
    return res.data;
  },

  deleteListing: async (id: number | string) => {
    const res = await apiClient.delete<{ message: string }>(
      API_ENDPOINTS.LISTINGS.BY_ID(id),
    );
    return res.data;
  },

  getFilteredListings: async (filters: any) => {
    const res = await apiClient.get<ListingsResponse>(
      API_ENDPOINTS.LISTINGS.FILTER,
      { params: filters },
    );
    return res.data;
  },

  searchListings: async (searchTerm: string) => {
    const res = await apiClient.get<Listing[]>(API_ENDPOINTS.LISTINGS.SEARCH, {
      params: { q: searchTerm },
    });
    return res.data;
  },

  getCategories: async () => {
    const res = await apiClient.get<string[]>(API_ENDPOINTS.CATEGORIES);
    return res.data;
  },

  getListingStats: async () => {
    const res = await apiClient.get<any>(API_ENDPOINTS.LISTINGS.STATS);
    return res.data;
  },
};
