using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodRescue.BLL.Contract.AdminDashbord.Users
{
    public class UserFilter
    {
        public string? Search { get; set; }
        public string? Status { get; set; } // Active / Inactive
        public string? SortBy { get; set; } // Name / Orders / Spend / LastOrder
        public bool Ascending { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
    }
}
