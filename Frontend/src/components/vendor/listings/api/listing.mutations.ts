// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { listingApi } from "./listing.api";
// import { listingQueryKeys } from "./listing.queries";

// export const useCreateListing = () => {
//   const qc = useQueryClient();

//   return useMutation({
//     mutationFn: listingApi.createListing,
//     onSuccess: () => {
//       qc.invalidateQueries({ queryKey: listingQueryKeys.lists() });
//       qc.invalidateQueries({ queryKey: listingQueryKeys.stats });
//     },
//   });
// };

// export const useUpdateListing = () => {
//   const qc = useQueryClient();

//   return useMutation({
//     mutationFn: ({ id, data }: { id: number | string; data: any }) =>
//       listingApi.updateListing(id, data),

//     onSuccess: (_, vars) => {
//       qc.invalidateQueries({
//         queryKey: listingQueryKeys.detail(vars.id),
//       });

//       qc.invalidateQueries({
//         queryKey: listingQueryKeys.lists(),
//       });
//     },
//   });
// };

// export const useDeleteListing = () => {
//   const qc = useQueryClient();

//   return useMutation({
//     mutationFn: listingApi.deleteListing,

//     onSuccess: () => {
//       qc.invalidateQueries({
//         queryKey: listingQueryKeys.lists(),
//       });

//       qc.invalidateQueries({
//         queryKey: listingQueryKeys.stats,
//       });
//     },
//   });
// };



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