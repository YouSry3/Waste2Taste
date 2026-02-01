// src/components/admin/listings/api/listing.queries.ts
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { listingApi } from "./listing.api";

/**
 * TanStack Query hooks for listings
 * TODO: Update query keys and cache times according to your needs
 * AI: When backend is ready, these hooks will automatically work with real data
 */

export const listingQueryKeys = {
  all: ["listings"] as const,
  lists: () => [...listingQueryKeys.all, "list"] as const,
  list: (filters: any) => [...listingQueryKeys.lists(), filters] as const,
  details: () => [...listingQueryKeys.all, "detail"] as const,
  detail: (id: number | string) => [...listingQueryKeys.details(), id] as const,
  search: (searchTerm: string) =>
    [...listingQueryKeys.all, "search", searchTerm] as const,
  categories: ["categories"] as const,
  stats: ["listingStats"] as const,
};

// Hook to fetch all listings
export const useListings = (params?: {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) => {
  return useQuery({
    queryKey: listingQueryKeys.list(params),
    queryFn: () => listingApi.getAllListings(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to fetch a single listing by ID
export const useListing = (id: number | string) => {
  return useQuery({
    queryKey: listingQueryKeys.detail(id),
    queryFn: () => listingApi.getListingById(id),
    enabled: !!id, // Only run query if id exists
    staleTime: 5 * 60 * 1000,
  });
};

// Hook to fetch filtered listings
export const useFilteredListings = (filters: any) => {
  return useQuery({
    queryKey: listingQueryKeys.list(filters),
    queryFn: () => listingApi.getFilteredListings(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes for filtered results
  });
};

// Hook to search listings
export const useSearchListings = (searchTerm: string) => {
  return useQuery({
    queryKey: listingQueryKeys.search(searchTerm),
    queryFn: () => listingApi.searchListings(searchTerm),
    enabled: searchTerm.length > 0, // Only search when term is not empty
    staleTime: 1 * 60 * 1000, // 1 minute for search results
  });
};

// Hook to fetch categories
export const useCategories = () => {
  return useQuery({
    queryKey: listingQueryKeys.categories,
    queryFn: listingApi.getCategories,
    staleTime: 30 * 60 * 1000, // 30 minutes - categories don't change often
  });
};

// Hook to fetch listing statistics
export const useListingStats = () => {
  return useQuery({
    queryKey: listingQueryKeys.stats,
    queryFn: listingApi.getListingStats,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Infinite query for pagination (if needed)
export const useInfiniteListings = (limit = 10) => {
  return useInfiniteQuery({
    queryKey: [...listingQueryKeys.lists(), "infinite"],
    queryFn: ({ pageParam = 1 }) =>
      listingApi.getAllListings({ page: pageParam, limit }),
    getNextPageParam: (lastPage, allPages) => {
      // TODO: Update this logic based on your API pagination response
      // AI: When backend is ready, update this to match your API pagination structure
      const totalPages = Math.ceil(lastPage.total / limit);
      const nextPage = allPages.length + 1;
      return nextPage <= totalPages ? nextPage : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
  });
};
