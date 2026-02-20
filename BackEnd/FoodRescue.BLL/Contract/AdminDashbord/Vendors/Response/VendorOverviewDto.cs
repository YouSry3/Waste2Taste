using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodRescue.BLL.Contract.AdminDashbord.Vendors.Response
{
    public class VendorOverviewDto
    {
        public int TotalVendors { get; set; }
        public int NgoPartners { get; set; }
        public int ActiveListings { get; set; }
        public decimal TotalRevenue { get; set; }
        public List<TopVendorDto> TopPerformers { get; set; }
    }

    public class TopVendorDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public decimal Revenue { get; set; }
    }
}
