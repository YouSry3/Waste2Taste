import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../../../services/api/apiClient";
import toast from "react-hot-toast";
import { Listing } from "../types";

// --------------- API response shape ---------------
interface ListingDTO {
  productId: string;
  vendorId: string;
  name: string;
  description: string;
  category: string | null;
  imageUrl: string;
  price: number;
  originalPrice: number;
  quantity: number;
  expiryDate: string;
  createdAt: string;
  ai: any;
}

// --------------- Mapper ---------------
const mapToListing = (item: ListingDTO): Listing => ({
  id: item.productId, // we treat productId as the UI's id
  vendor: item.vendorId, // will be replaced with vendor name if needed
  vendorName: item.vendorId, // placeholder
  title: item.name,
  category: item.category ?? "Uncategorized",
  price: `$${item.price.toFixed(2)}`,
  originalPrice: `$${item.originalPrice.toFixed(2)}`,
  quantity: item.quantity,
  pickupTime: "Not specified", // API doesn't provide this yet; adjust if needed
  submitted: item.createdAt,
  image: item.imageUrl?.startsWith("http")
    ? item.imageUrl
    : `${apiClient.defaults.baseURL}${item.imageUrl}`,
  flagged: item.ai != null, // simple flag if AI indicates an issue
  aiFlag: item.ai
    ? {
        type: item.ai.type ?? "unknown",
        confidence: item.ai.confidence ?? 0,
        reason: item.ai.reason ?? "",
      }
    : null,
  status: "pending", // all pending listings are exactly that
});

// --------------- Hook: fetch pending listings ---------------
export const usePendingListings = () => {
  return useQuery<Listing[]>({
    queryKey: ["pendingListings"],
    queryFn: async () => {
      const response = await apiClient.get("/Listing/pending");
      const data = response.data?.data ?? response.data ?? [];
      return (Array.isArray(data) ? data : []).map(mapToListing);
    },
  });
};

// --------------- Hook: approve a listing ---------------
export const useApproveListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      await apiClient.post("/Listing/approve", { productId });
    },
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: ["pendingListings"] });

      const previous = queryClient.getQueryData<Listing[]>(["pendingListings"]);

      queryClient.setQueryData<Listing[]>(
        ["pendingListings"],
        (old) => old?.filter((listing) => listing.id !== productId) ?? [],
      );

      return { previous };
    },
    onError: (_err, _vars, context: any) => {
      queryClient.setQueryData(["pendingListings"], context?.previous);
      toast.error("Approval failed. Please try again.");
    },
    onSuccess: () => {
      toast.success("Listing approved successfully!");
      // re‑fetch in background to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["pendingListings"] });
    },
  });
};

// --------------- Hook: reject a listing ---------------
export const useRejectListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      rejectionReason,
    }: {
      productId: string;
      rejectionReason: string;
    }) => {
      await apiClient.post("/Listing/reject", {
        productId,
        status: 0,
        rejectionReason,
      });
    },
    onMutate: async ({ productId }) => {
      await queryClient.cancelQueries({ queryKey: ["pendingListings"] });

      const previous = queryClient.getQueryData<Listing[]>(["pendingListings"]);

      queryClient.setQueryData<Listing[]>(
        ["pendingListings"],
        (old) => old?.filter((listing) => listing.id !== productId) ?? [],
      );

      return { previous };
    },
    onError: (_err, _vars, context: any) => {
      queryClient.setQueryData(["pendingListings"], context?.previous);
      toast.error("Rejection failed. Please try again.");
    },
    onSuccess: () => {
      toast.success("Listing rejected successfully.");
      queryClient.invalidateQueries({ queryKey: ["pendingListings"] });
    },
  });
};
