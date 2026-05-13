// src/components/vendor/dashboard/components/ReviewsTab.tsx
import { Star, MessageSquare, TrendingUp, Heart, Zap, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { Badge } from "../../../ui/badge";
import { Skeleton } from "../../../ui/skeleton";
import { useVendorReviews, VendorReview } from "./useVendorReviews";

// ── Sentiment badge ──────────────────────────────────────────────────────────
function SentimentBadge({ sentiment }: { sentiment: VendorReview["sentiment"] | null }) {
  if (!sentiment || sentiment.neutral) {
    return (
      <Badge variant="outline" className="text-gray-500 border-gray-300 flex items-center gap-1">
        <Minus className="h-3 w-3" />
        Neutral
      </Badge>
    );
  }

  const dominant = (
    [
      { key: "gratitude", label: "Grateful", icon: Heart, color: "text-pink-600 border-pink-300 bg-pink-50" },
      { key: "excitement", label: "Excited", icon: Zap, color: "text-yellow-600 border-yellow-300 bg-yellow-50" },
      { key: "urgency", label: "Urgent", icon: TrendingUp, color: "text-red-600 border-red-300 bg-red-50" },
    ] as const
  ).reduce(
    (best, item) =>
      (sentiment[item.key] ?? 0) > (sentiment[best.key] ?? 0) ? item : best,
  );

  const Icon = dominant.icon;

  return (
    <Badge variant="outline" className={`flex items-center gap-1 ${dominant.color}`}>
      <Icon className="h-3 w-3" />
      {dominant.label}
    </Badge>
  );
}

// ── Star rating display ──────────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-200"
          }`}
        />
      ))}
      <span className="ml-1 text-sm font-medium text-gray-600">{rating}/5</span>
    </div>
  );
}

// ── Summary stats bar ────────────────────────────────────────────────────────
function ReviewsSummary({ reviews }: { reviews: VendorReview[] }) {
  if (reviews.length === 0) return null;

  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <Card className="mb-6 border-yellow-200 bg-yellow-50/30">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          {/* Average score */}
          <div className="text-center flex-shrink-0">
            <p className="text-5xl font-bold text-yellow-500">
              {avgRating.toFixed(1)}
            </p>
            <StarRating rating={Math.round(avgRating)} />
            <p className="text-xs text-gray-500 mt-1">
              {reviews.length} review{reviews.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Rating breakdown */}
          <div className="flex-1 w-full space-y-1.5">
            {ratingCounts.map(({ star, count }) => (
              <div key={star} className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-4">{star}</span>
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full transition-all"
                    style={{
                      width:
                        reviews.length > 0
                          ? `${(count / reviews.length) * 100}%`
                          : "0%",
                    }}
                  />
                </div>
                <span className="text-xs text-gray-500 w-4">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Single review card ───────────────────────────────────────────────────────
function ReviewCard({ review }: { review: VendorReview }) {
  const initials = review.user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const formattedDate = new Date(review.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="p-4 rounded-lg border bg-white hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          {review.user.imageUrl ? (
            <img
              src={review.user.imageUrl}
              alt={review.user.name}
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {initials}
            </div>
          )}
          <div>
            <p className="font-semibold text-sm">{review.user.name}</p>
            <p className="text-xs text-gray-400">{formattedDate}</p>
          </div>
        </div>
        <SentimentBadge sentiment={review.sentiment} />
      </div>

      <StarRating rating={review.rating} />

      {review.comment && (
        <p className="mt-2 text-sm text-gray-600 leading-relaxed">
          {review.comment}
        </p>
      )}
    </div>
  );
}

// ── Loading skeleton ─────────────────────────────────────────────────────────
function ReviewsSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-32 w-full rounded-lg" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-4 rounded-lg border bg-white space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
  );
}

// ── Main ReviewsTab component ────────────────────────────────────────────────
export function ReviewsTab() {
  const { data: reviews = [], isLoading, isError } = useVendorReviews();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-yellow-500" />
            <CardTitle>Customer Reviews</CardTitle>
          </div>
          <p className="text-sm text-gray-500">
            Feedback and sentiment from your customers
          </p>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <ReviewsSkeleton />
          ) : isError ? (
            <div className="py-12 text-center text-gray-500">
              <MessageSquare className="h-10 w-10 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">Failed to load reviews</p>
              <p className="text-sm mt-1">Please try again later.</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <Star className="h-10 w-10 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">No reviews yet</p>
              <p className="text-sm mt-1">
                Reviews from your customers will appear here.
              </p>
            </div>
          ) : (
            <>
              <ReviewsSummary reviews={reviews} />
              <div className="space-y-3">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}