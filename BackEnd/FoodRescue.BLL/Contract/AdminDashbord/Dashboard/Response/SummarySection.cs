using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodRescue.BLL.Contract.AdminDashbord.Dashboard.Response
{
    public class SummarySection
    {
        public decimal TotalRevenue { get; set; }
        public int ActiveUsers { get; set; }
        public int Vendors { get; set; }
        public int OrdersLastDays { get; set; }

        public decimal RevenueGrowthPercentage { get; set; }
        public decimal UserGrowthPercentage { get; set; }
        public decimal VendorGrowthPercentage { get; set; }
        public decimal OrderGrowthPercentage { get; set; }
    }

}
