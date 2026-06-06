namespace FoodRescue.BLL.ResultPattern.TypeErrors
{
    public class ReviewErrors
    {

        public static Error ReviewsNotFound() => new("Reviews.NotFound", $"Not Found Any reviews ");
        public static Error OnlyCustomersCanAddReviews() => new("Reviews.OnlyCustomersCanAddReviews", $"Only Customers Can Add Reviews ");
        public static Error MustPurchaseBeforeReview() =>
    new("REVIEW_NOT_ALLOWED", $"You must have a completed order for this product before reviewing.");

        public static Error AlreadyReviewed() =>
            new("ALREADY_REVIEWED", $"You have already reviewed this product.");

    }
}
