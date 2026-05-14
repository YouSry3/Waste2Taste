import { useMutation, useQueryClient } from "@tanstack/react-query";
import { listingApi } from "./listing.api";
import { listingQueryKeys } from "./listing.queries";

export const useCreateListing = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: listingApi.createListing,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: listingQueryKeys.vendorListings });
    },
  });
};
export const useUpdateStock = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, quantity }: { id: string | number; quantity: number }) =>
      listingApi.updateStock(id, quantity),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: listingQueryKeys.vendorListings });
    },
  });
};

export const useUpdateListing = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: any }) =>
      listingApi.updateListing(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: listingQueryKeys.vendorListings });
    },
  });
};

export const useDeleteListing = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: listingApi.deleteListing,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: listingQueryKeys.vendorListings });
    },
  });
};

export const useApproveListing = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: listingApi.approveListing,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: listingQueryKeys.pending });
    },
  });
};

export const useRejectListing = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string | number; reason?: string }) =>
      listingApi.rejectListing(id, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: listingQueryKeys.pending });
    },
  });




  
};