import { useMutation, useQueryClient } from "@tanstack/react-query";
import { listingApi } from "./listing.api";
import { listingQueryKeys } from "./listing.queries";

export const useCreateListing = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: listingApi.createListing,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: listingQueryKeys.lists() });
      qc.invalidateQueries({ queryKey: listingQueryKeys.stats });
    },
  });
};

export const useUpdateListing = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: any }) =>
      listingApi.updateListing(id, data),

    onSuccess: (_, vars) => {
      qc.invalidateQueries({
        queryKey: listingQueryKeys.detail(vars.id),
      });

      qc.invalidateQueries({
        queryKey: listingQueryKeys.lists(),
      });
    },
  });
};

export const useDeleteListing = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: listingApi.deleteListing,

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: listingQueryKeys.lists(),
      });

      qc.invalidateQueries({
        queryKey: listingQueryKeys.stats,
      });
    },
  });
};
