import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { listingApi } from "./listing.api";

export const listingQueryKeys = {
  all: ["listings"] as const,
  lists: () => [...listingQueryKeys.all, "list"] as const,
  list: (filters: any) => [...listingQueryKeys.lists(), filters] as const,
  details: () => [...listingQueryKeys.all, "detail"] as const,
  detail: (id: number | string) => [...listingQueryKeys.details(), id] as const,
  search: (term: string) => [...listingQueryKeys.all, "search", term] as const,
  categories: ["categories"] as const,
  stats: ["listingStats"] as const,
};

export const useListings = (params?: {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) => {
  return useQuery({
    queryKey: listingQueryKeys.list(params),
    queryFn: () => listingApi.getAllListings(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useListing = (id: number | string) => {
  return useQuery({
    queryKey: listingQueryKeys.detail(id),
    queryFn: () => listingApi.getListingById(id),
    enabled: !!id,
  });
};

export const useFilteredListings = (filters: any) => {
  return useQuery({
    queryKey: listingQueryKeys.list(filters),
    queryFn: () => listingApi.getFilteredListings(filters),
  });
};

export const useSearchListings = (term: string) => {
  return useQuery({
    queryKey: listingQueryKeys.search(term),
    queryFn: () => listingApi.searchListings(term),
    enabled: term.length > 0,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: listingQueryKeys.categories,
    queryFn: listingApi.getCategories,
  });
};

export const useListingStats = () => {
  return useQuery({
    queryKey: listingQueryKeys.stats,
    queryFn: listingApi.getListingStats,
  });
};

export const useInfiniteListings = (limit = 10) => {
  return useInfiniteQuery({
    queryKey: [...listingQueryKeys.lists(), "infinite"],
    queryFn: ({ pageParam = 1 }) =>
      listingApi.getAllListings({ page: pageParam, limit }),

    getNextPageParam: (lastPage: any, pages) => {
      const totalPages = Math.ceil((lastPage?.activeCount ?? 0) / limit);

      const nextPage = pages.length + 1;
      return nextPage <= totalPages ? nextPage : undefined;
    },

    initialPageParam: 1,
  });
};
