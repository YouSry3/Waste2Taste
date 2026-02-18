// src/components/vendor/listings/hooks/useListings.ts
import { useState, useMemo } from "react";
import { Listing } from "../types/listing.types";

// Remove this import since initialListings no longer exists
// import { initialListings } from "../constants/listings.data";

// Create initial listings here instead
const createInitialListings = (): Listing[] => {
  const samplePhoto1 =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2U1ZTVlNSIvPjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5OTkiPkJha2VyeSBCYWc8L3RleHQ+PC9zdmc+";
  const samplePhoto2 =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5OTkiPkNvZmZlZSAmIFBhc3RyaWVzPC90ZXh0Pjwvc3ZnPg==";

  return [
    {
      id: 1,
      vendor: "Green Valley Bakery",
      title: "Bakery Surprise Bag",
      category: "Bakery",
      originalPrice: 15.0,
      salePrice: 4.99,
      quantity: 5,
      pickupTime: "6:00 PM - 7:00 PM",
      status: "Active",
      location: "123 Valley Road",
      rating: 4.8,
      description:
        "Fresh bakery items included. Assortment of bread, pastries, and desserts.",
      photos: [samplePhoto1],
    },
    {
      id: 2,
      vendor: "City Cafe",
      title: "Coffee & Pastries",
      category: "Cafe",
      originalPrice: 18.0,
      salePrice: 5.99,
      quantity: 3,
      pickupTime: "8:00 PM - 9:00 PM",
      status: "Active",
      location: "456 Main Street",
      rating: 4.6,
      description:
        "Delicious coffee with fresh pastries. Perfect end-of-day deal.",
      photos: [samplePhoto2],
    },
  ];
};

const initialListings = createInitialListings();

export interface UseListingsOptions {
  initialFilters?: {
    category?: string;
    status?: string;
    searchTerm?: string;
  };
  page?: number;
  limit?: number;
}

// Create a shared state outside the hook
let sharedListings: Listing[] = initialListings;
let sharedSearchTerm = "";
let sharedFilterCategory = "all";
let sharedFilterStatus = "all";

export const useListings = (options: UseListingsOptions = {}) => {
  /* -------------------- FILTER STATE -------------------- */
  const [searchTerm, setSearchTerm] = useState(
    options.initialFilters?.searchTerm || sharedSearchTerm,
  );
  const [filterCategory, setFilterCategory] = useState(
    options.initialFilters?.category || sharedFilterCategory,
  );
  const [filterStatus, setFilterStatus] = useState(
    options.initialFilters?.status || sharedFilterStatus,
  );

  /* -------------------- DATA STATE (SOURCE OF TRUTH) -------------------- */
  const [listings, setListings] = useState<Listing[]>(sharedListings);

  const categories = ["Bakery", "Restaurant", "Cafe", "Grocery", "Other"];

  /* -------------------- MUTATIONS (MOCK, BUT REAL) -------------------- */

  const createListing = (data: Partial<Listing>) => {
    const newListing: Listing = {
      ...(data as Listing),
      id: Date.now(), // temp ID
      status: data.status || "Active",
      rating: data.rating || 4.5,
      photos: data.photos || [], // Include photos
    };

    setListings((prev) => [newListing, ...prev]);
    return newListing;
  };

  const updateListing = ({
    id,
    data,
  }: {
    id: number | string;
    data: Partial<Listing>;
  }) => {
    setListings((prev) => {
      const updated = prev.map((listing) =>
        listing.id === id ? { ...listing, ...data } : listing,
      );
      sharedListings = updated;
      return updated;
    });
  };

  const deleteListing = (id: number | string) => {
    setListings((prev) => {
      const updated = prev.filter((listing) => listing.id !== id);
      sharedListings = updated;
      return updated;
    });
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
    setSearchTerm: (term: string) => {
      setSearchTerm(term);
      sharedSearchTerm = term;
    },
    filterCategory,
    setFilterCategory: (category: string) => {
      setFilterCategory(category);
      sharedFilterCategory = category;
    },
    filterStatus,
    setFilterStatus: (status: string) => {
      setFilterStatus(status);
      sharedFilterStatus = status;
    },

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
