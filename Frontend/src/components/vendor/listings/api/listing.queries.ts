import { useQuery } from "@tanstack/react-query";
import { listingApi } from "./listing.api";
import { DEFAULT_QUERY_OPTIONS } from "../../../../config/queryConfig";

export const listingQueryKeys = {
  all: ["listings"] as const,
  vendorListings: ["listings", "vendor"] as const,
  pending: ["listings", "pending"] as const,
};

export const useVendorListings = () => {
  return useQuery({
    queryKey: listingQueryKeys.vendorListings,
    queryFn: listingApi.getVendorListings,
    ...DEFAULT_QUERY_OPTIONS,
  });
};

export const usePendingListings = () => {
  return useQuery({
    queryKey: listingQueryKeys.pending,
    queryFn: listingApi.getPendingListings,
    ...DEFAULT_QUERY_OPTIONS,
  });
};