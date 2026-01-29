// src/components/admin/listings/hooks/useListings.ts
import { useState, useMemo } from "react";
import {
  useListings as useListingsQuery,
  useCategories,
  useListingStats,
} from "../api/listing.queries";
import {
  useCreateListing,
  useUpdateListing,
  useDeleteListing,
} from "../api/listing.mutations";
import { initialListings } from "../constants/listings.data"; // Import mock data

/**
 * Custom hook that combines all listing-related logic
 * This hook serves as a facade for the listing functionality
 * TODO: Add error handling, loading states, and any additional business logic
 */

export interface UseListingsOptions {
  initialFilters?: {
    category?: string;
    status?: string;
    searchTerm?: string;
  };
  page?: number;
  limit?: number;
}

export const useListings = (options: UseListingsOptions = {}) => {
  const [searchTerm, setSearchTerm] = useState(
    options.initialFilters?.searchTerm || "",
  );
  const [filterCategory, setFilterCategory] = useState(
    options.initialFilters?.category || "all",
  );
  const [filterStatus, setFilterStatus] = useState(
    options.initialFilters?.status || "all",
  );

  // API Queries - Comment out for now since backend is not ready
  // const listingsQuery = useListingsQuery({
  //   page: options.page,
  //   limit: options.limit,
  // });
  // const categoriesQuery = useCategories();
  // const statsQuery = useListingStats();

  // Use mock data for now
  const mockListings = initialListings;
  const mockCategories = ["Bakery", "Restaurant", "Cafe", "Grocery", "Other"];

  // API Mutations - Comment out for now
  // const createMutation = useCreateListing();
  // const updateMutation = useUpdateListing();
  // const deleteMutation = useDeleteListing();

  // Use mock mutations for now
  const mockCreateMutation = { isPending: false, mutate: () => {} };
  const mockUpdateMutation = { isPending: false, mutate: () => {} };
  const mockDeleteMutation = { isPending: false, mutate: () => {} };

  // Memoized filtered listings (using mock data for now)
  const filteredListings = useMemo(() => {
    if (!mockListings) return [];

    return mockListings.filter((listing: any) => {
      const matchesSearch =
        searchTerm === "" ||
        listing.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.title.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        filterCategory === "all" || listing.category === filterCategory;
      const matchesStatus =
        filterStatus === "all" || listing.status === filterStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [mockListings, searchTerm, filterCategory, filterStatus]);

  // Comment out real API states for now
  // const isLoading = listingsQuery.isLoading || categoriesQuery.isLoading || statsQuery.isLoading;
  // const isCreating = createMutation.isPending;
  // const isUpdating = updateMutation.isPending;
  // const isDeleting = deleteMutation.isPending;
  // const error = listingsQuery.error || categoriesQuery.error || statsQuery.error;
  // const mutationError = createMutation.error || updateMutation.error || deleteMutation.error;

  // Use mock states
  const isLoading = false;
  const isCreating = false;
  const isUpdating = false;
  const isDeleting = false;
  const error = null;
  const mutationError = null;

  return {
    // State
    searchTerm,
    setSearchTerm,
    filterCategory,
    setFilterCategory,
    filterStatus,
    setFilterStatus,

    // Data
    listings: filteredListings,
    allListings: mockListings,
    categories: mockCategories,
    stats: null, // No stats for mock data

    // Loading states
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    isRefetching: false,

    // Error states
    error,
    mutationError,

    // Mutations - using mock for now
    createListing: mockCreateMutation.mutate,
    updateListing: mockUpdateMutation.mutate,
    deleteListing: mockDeleteMutation.mutate,

    // Query utilities
    refetch: () => console.log("Refetch called - backend not ready"),

    // Derived state
    totalListings: filteredListings.length,
    hasData: filteredListings.length > 0,

    // Status
    isSuccess: true,
    isError: false,
  };
};
