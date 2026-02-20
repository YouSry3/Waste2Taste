using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodRescue.BLL.Contract.AdminDashbord.Vendors.Request
{
    public class VendorQueryParameters
    {
        private const int MaxPageSize = 50;

        public int Page { get; set; } = 1;

        private int _limit = 10;
        public int Limit
        {
            get => _limit;
            set => _limit = value > MaxPageSize ? MaxPageSize : value;
        }

        public string? Search { get; set; }

        public string SortBy { get; set; } = "Name";

        public string Order { get; set; } = "asc";
    }
}
