using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodRescue.BLL.Contract.Orders.info
{
    public class CustomerOrderDto
    {
        public string OrderNumber { get; set; } = null!;
        public string Status { get; set; } = null!;

        public string ProductName { get; set; } = null!;
        public string VendorName { get; set; } = null!;
        public string ImageUrl { get; set; } = null!;

        public decimal Price { get; set; }

        public DateTime PickupTime { get; set; }
    }
}
