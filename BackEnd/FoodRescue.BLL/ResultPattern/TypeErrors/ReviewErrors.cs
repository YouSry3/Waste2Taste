using FoodRescue.BLL.ResultPattern;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodRescue.BLL.ResultPattern.TypeErrors
{
    public class ReviewErrors
    {
        public static Error ReviewsNotFound(Guid VendorId) => new("Reviews.NotFound", $"Not Found Any reviews with Vendor Id :{VendorId}");
        public static Error OnlyCustomersCanAddReviews(Guid UserId) => new("Reviews.OnlyCustomersCanAddReviews", $"Only Customers Can Add Reviews , User Id :{UserId}");
    }
}
