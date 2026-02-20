using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodRescue.BLL.Contract.AdminDashbord.Vendors.Response
{
    public class VendorListItemDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public decimal Revenue { get; set; }
        public double Rating { get; set; }
        public int ListingsCount { get; set; }
    }

    public class PagedResultDto<T>
    {
        public List<T> Items { get; set; }
        public int TotalCount { get; set; }
    }
}
