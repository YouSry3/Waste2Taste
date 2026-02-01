// src/components/admin/listings/api/listing.mutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { listingApi } from "./listing.api";
import { listingQueryKeys } from "./listing.queries";
import { CreateListingDto, UpdateListingDto } from "../types/listing.types";

/**
 * TanStack Mutation hooks for listing operations
 * TODO: Update onSuccess/onError handlers according to your needs
 * AI: When backend is ready, these mutations will automatically work with real API
 */

export const useCreateListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (listingData: CreateListingDto) =>
      listingApi.createListing(listingData),
    onSuccess: (data) => {
      // Invalidate and refetch listings queries
      queryClient.invalidateQueries({ queryKey: listingQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: listingQueryKeys.stats });

      // TODO: Show success toast/message
      console.log("Listing created successfully:", data);
    },
    onError: (error) => {
      // TODO: Handle error (show error toast/message)
      console.error("Failed to create listing:", error);
    },
  });
};

export const useUpdateListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number | string;
      data: UpdateListingDto;
    }) => listingApi.updateListing(id, data),
    onSuccess: (data, variables) => {
      // Update the specific listing cache
      queryClient.invalidateQueries({
        queryKey: listingQueryKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: listingQueryKeys.lists() });

      // TODO: Show success toast/message
      console.log("Listing updated successfully:", data);
    },
    onError: (error) => {
      // TODO: Handle error
      console.error("Failed to update listing:", error);
    },
  });
};

export const useDeleteListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => listingApi.deleteListing(id),
    onSuccess: (data, deletedId) => {
      // Remove deleted listing from cache
      queryClient.invalidateQueries({ queryKey: listingQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: listingQueryKeys.stats });
      queryClient.removeQueries({
        queryKey: listingQueryKeys.detail(deletedId),
      });

      // TODO: Show success toast/message
      console.log("Listing deleted successfully:", data);
    },
    onError: (error) => {
      // TODO: Handle error
      console.error("Failed to delete listing:", error);
    },
  });
};

// Bulk operations (if needed)
export const useBulkUpdateListings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      updates: Array<{ id: number | string; data: UpdateListingDto }>,
    ) => {
      // TODO: Implement bulk update API or use Promise.all
      return Promise.all(
        updates.map(({ id, data }) => listingApi.updateListing(id, data)),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listingQueryKeys.lists() });
      // TODO: Show success message
    },
  });
};
