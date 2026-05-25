import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../../../services/api/apiClient";
import toast from "react-hot-toast";
import { Listing } from "../types";

const mapToListing = (item: any): Listing => {
  const id = item.productId ?? item.ProductId ?? item.id ?? item.Id ?? "";
  const vendorId = item.vendorId ?? item.VendorId ?? "";
  const name = item.name ?? item.Name ?? item.title ?? item.Title ?? "Untitled";
  const category = item.category ?? item.Category ?? "Uncategorized";
  const imageUrl = item.imageUrl ?? item.ImageUrl ?? item.image ?? item.Image ?? "";
  const priceNum = Number(item.price ?? item.Price ?? 0);
  const originalPriceNum = Number(item.originalPrice ?? item.OriginalPrice ?? 0);
  const quantity = Number(item.quantity ?? item.Quantity ?? 0);
  const createdAt = item.createdAt ?? item.CreatedAt ?? new Date().toISOString();
  const expiryDate = item.expiryDate ?? item.ExpiryDate ?? item.expiresAt ?? "";

  // ── AI Spoilage fields ──────────────────────────────────────────────
  const aiIsSpoiled: boolean | null =
    item.aiIsSpoiled ?? item.AIIsSpoiled ?? item.ai?.isSpoiled ?? null;
  const aiConfidence: number | null =
    item.aiConfidence != null
      ? Number(item.aiConfidence)
      : item.AIConfidence != null
        ? Number(item.AIConfidence)
        : item.ai?.confidence != null
          ? Number(item.ai.confidence)
          : null;
  const aiSpoiledPercentage: number | null =
    item.aiSpoiledPercentage ?? item.AISpoiledPercentage ?? item.ai?.spoiledPercentage ?? null;
  const aiPrediction: string | null =
    item.aiPrediction ?? item.AIPrediction ?? item.ai?.prediction ?? null;

  const resolvedImageUrl = imageUrl?.startsWith("http")
    ? imageUrl
    : `${apiClient.defaults.baseURL}${imageUrl}`;

  return {
    id: String(id),
    vendor: vendorId ? `Vendor ${String(vendorId).substring(0, 8)}...` : "Unknown Vendor",
    vendorName: item.vendorName ?? item.VendorName ?? (vendorId ? `Vendor ${String(vendorId).substring(0, 8)}...` : "Unknown Vendor"),
    title: name,
    name,
    description: item.descripcion ?? item.description ?? item.Description ?? "",
    category,
    price: priceNum,
    priceFormatted: `$${priceNum.toFixed(2)}`,
    originalPrice: originalPriceNum,
    originalPriceFormatted: `$${originalPriceNum.toFixed(2)}`,
    quantity,
    pickupTime: item.pickupTime ?? item.PickupTime ?? "Not specified",
    submitted: createdAt,
    createdAt,
    image: resolvedImageUrl,
    imageUrl: resolvedImageUrl,
    expiryDate,
    expiresIn: expiryDate ? new Date(expiryDate).toLocaleDateString() : "N/A",
    // Flag the card if AI says it's spoiled
    flagged: aiIsSpoiled === true,
    aiFlag:
      aiIsSpoiled != null
        ? {
            type: aiPrediction ?? "Spoilage Check",
            confidence: aiConfidence ?? 0,
            reason:
              aiIsSpoiled
                ? `AI detected spoilage (${aiSpoiledPercentage ?? 0}% spoiled)`
                : "AI found no spoilage",
          }
        : null,
    status: "pending",
    // ── AI fields for ListingCard display ──
    aiIsSpoiled,
    aiConfidence,
    aiSpoiledPercentage,
    aiPrediction,
  };
};

export const usePendingListings = () => {
  return useQuery<Listing[]>({
    queryKey: ["pendingListings"],
    queryFn: async () => {
      const response = await apiClient.get("/Listing/pending");
      
      console.log("RAW /Listing/pending response:", response.data);
 console.log("RAW /Listing/pending response:", JSON.stringify(response.data, null, 2));
      const payload = response.data;
      let rawData: any[] = [];

      if (Array.isArray(payload)) {
        rawData = payload;
      } else if (Array.isArray(payload?.items)) {
        rawData = payload.items;
      } else if (Array.isArray(payload?.data)) {
        rawData = payload.data;
      } else if (Array.isArray(payload?.data?.items)) {
        rawData = payload.data.items;
      } else {
        console.warn("Unexpected /Listing/pending response shape:", payload);
      }

      return rawData.map(mapToListing);
    },
  });
};

export const useApproveListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      await apiClient.post(
        "/Listing/approve",
        {},
        { headers: { productId } },
      );
    },
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: ["pendingListings"] });
      const previous = queryClient.getQueryData<Listing[]>(["pendingListings"]);
      queryClient.setQueryData<Listing[]>(
        ["pendingListings"],
        (old) => old?.filter((l) => String(l.id) !== String(productId)) ?? [],
      );
      return { previous };
    },
    onError: (_err, _vars, context: any) => {
      queryClient.setQueryData(["pendingListings"], context?.previous);
      toast.error("Approval failed. Please try again.");
    },
    onSuccess: () => {
      toast.success("Listing approved successfully!");
      queryClient.invalidateQueries({ queryKey: ["pendingListings"] });
    },
  });
};

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
        ProductId: productId,
        RejectionReason: rejectionReason,
      });
    },
    onMutate: async ({ productId }) => {
      await queryClient.cancelQueries({ queryKey: ["pendingListings"] });
      const previous = queryClient.getQueryData<Listing[]>(["pendingListings"]);
      queryClient.setQueryData<Listing[]>(
        ["pendingListings"],
        (old) => old?.filter((l) => String(l.id) !== String(productId)) ?? [],
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