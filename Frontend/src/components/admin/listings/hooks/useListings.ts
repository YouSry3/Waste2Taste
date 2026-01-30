// src/components/admin/listings/hooks/useListings.ts
import { useState, useMemo } from "react";
import { initialListings } from "../constants/listings.data";
import { Listing } from "../types/listing.types";

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
  /* -------------------- FILTER STATE -------------------- */
  const [searchTerm, setSearchTerm] = useState(
    options.initialFilters?.searchTerm || "",
  );
  const [filterCategory, setFilterCategory] = useState(
    options.initialFilters?.category || "all",
  );
  const [filterStatus, setFilterStatus] = useState(
    options.initialFilters?.status || "all",
  );

  /* -------------------- DATA STATE (SOURCE OF TRUTH) -------------------- */
  const [listings, setListings] = useState<Listing[]>(initialListings);

  const categories = ["Bakery", "Restaurant", "Cafe", "Grocery", "Other"];

  /* -------------------- MUTATIONS (MOCK, BUT REAL) -------------------- */

  const createListing = (data: Partial<Listing>) => {
    const newListing: Listing = {
      ...(data as Listing),
      id: Date.now(), // temp ID
    };

    setListings((prev) => [newListing, ...prev]);
  };

  const updateListing = ({
    id,
    data,
  }: {
    id: number | string;
    data: Partial<Listing>;
  }) => {
    setListings((prev) =>
      prev.map((listing) =>
        listing.id === id ? { ...listing, ...data } : listing,
      ),
    );
  };

  const deleteListing = (id: number | string) => {
    setListings((prev) => prev.filter((listing) => listing.id !== id));
  };

  /* -------------------- FILTERED VIEW -------------------- */
  const filteredListings = useMemo(() => {
    return listings.filter((listing) => {
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
  }, [listings, searchTerm, filterCategory, filterStatus]);

  /* -------------------- STATES (MOCKED FOR NOW) -------------------- */
  const isLoading = false;
  const isCreating = false;
  const isUpdating = false;
  const isDeleting = false;
  const error = null;

  return {
    /* Filters */
    searchTerm,
    setSearchTerm,
    filterCategory,
    setFilterCategory,
    filterStatus,
    setFilterStatus,

    /* Data */
    listings: filteredListings,
    allListings: listings,
    categories,
    stats: null,

    /* Loading */
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    isRefetching: false,

    /* Errors */
    error,
    mutationError: null,

    /* Mutations */
    createListing,
    updateListing,
    deleteListing,

    /* Utilities */
    refetch: () => {},

    /* Derived */
    totalListings: filteredListings.length,
    hasData: filteredListings.length > 0,

    /* Status */
    isSuccess: true,
    isError: false,
  };
};
