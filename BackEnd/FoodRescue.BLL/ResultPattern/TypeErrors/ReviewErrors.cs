namespace FoodRescue.BLL.ResultPattern.TypeErrors
{
    public class ReviewErrors
    {
<<<<<<< HEAD
        public static Error ReviewsNotFound(Guid VendorId) => new("Reviews.NotFound", $"Not Found Any reviews with Vendor Id :{VendorId}");
        public static Error OnlyCustomersCanAddReviews(Guid UserId) => new("Reviews.OnlyCustomersCanAddReviews", $"Only Customers Can Add Reviews , User Id :{UserId}");
=======
        public static Error ReviewsNotFound(Guid Productid) => new("Reviews.NotFound", $"Not Found Any reviews with Product Id :{Productid}");
        public static Error OnlyCustomersCanAddReviews(Guid Userid) => new("Reviews.OnlyCustomersCanAddReviews", $"Only Customers Can Add Reviews , User Id :{Userid}");
        public static Error MustPurchaseBeforeReview(Guid userId) =>
    new("REVIEW_NOT_ALLOWED", $"User {userId} must have a completed order for this product before reviewing.");

        public static Error AlreadyReviewed(Guid userId) =>
            new("ALREADY_REVIEWED", $"User {userId} has already reviewed this product.");
>>>>>>> 0b53e5a9bd434d76452ce4933fe42fa5c6ae7fb1
    }
}
