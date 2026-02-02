using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodRescue.BLL.Abstractions.TypeErrors
{
    public class ReviewErrors
    {
        public static Error ReviewsNotFound(Guid Productid) => new("Reviews.NotFound", $"Not Found Any reviews with Product Id :{Productid}");

    }
}
