// src/components/vendor/dashboard/components/useVendorReviews.ts
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../../services/api/apiClient";
import { DEFAULT_QUERY_OPTIONS } from "../../../../config/queryConfig";

export interface ReviewUser {
  name: string;
  id: string;
  imageUrl: string | null;
}

export interface ReviewSentiment {
  gratitude: number;
  excitement: number;
  urgency: number;
  neutral: boolean;
}

export interface VendorReview {
  id: number;
  comment: string;
  rating: number;
  user: ReviewUser;
  createdAt: string;
  sentiment: ReviewSentiment | null;  // ← add | null
}

const getVendorId = (): string | null => {
  try {
    return localStorage.getItem("vendorId");
  } catch {
    return null;
  }
};

const fetchVendorReviews = async (vendorId: string): Promise<VendorReview[]> => {
  const response = await apiClient.get<VendorReview[]>(
    "/Reviews/vendor/GetReviewsWithSentiment",
    { headers: { vendorId } },
  );

  const baseUrl = apiClient.defaults.baseURL?.replace(/\/api\/?$/i, "") ?? "";

  return response.data.map((review) => ({
    ...review,
    user: {
      ...review.user,
      imageUrl: review.user.imageUrl
        ? review.user.imageUrl.startsWith("http")
          ? review.user.imageUrl
          : `${baseUrl}${review.user.imageUrl}`
        : null,
    },
  }));
};
export const useVendorReviews = () => {
  const vendorId = getVendorId();

  return useQuery({
    queryKey: ["vendor-reviews", vendorId],
    queryFn: () => fetchVendorReviews(vendorId!),
    enabled: !!vendorId,
    ...DEFAULT_QUERY_OPTIONS,
  });
};