namespace FoodRescue.BLL.ResultPattern.TypeErrors
{
    public class ReviewErrors
    {

        public static Error ReviewsNotFound() => new("Reviews.NotFound", $"Not Found Any reviews ");
        public static Error OnlyCustomersCanAddReviews(Guid Userid) => new("Reviews.OnlyCustomersCanAddReviews", $"Only Customers Can Add Reviews , User Id :{Userid}");
        public static Error MustPurchaseBeforeReview(Guid userId) =>
    new("REVIEW_NOT_ALLOWED", $"User {userId} must have a completed order for this product before reviewing.");

        public static Error AlreadyReviewed(Guid userId) =>
            new("ALREADY_REVIEWED", $"User {userId} has already reviewed this product.");

    }
}
