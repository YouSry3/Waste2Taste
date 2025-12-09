using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodRescue.DAL.Entities
{
    public class Order
    {
        public Guid Id { get; set; }
        public Guid CustomerId { get; set; }
        public Guid VendorId { get; set; }
        public string Status { get; set; }
        public decimal Total { get; set; }
        public DateTime CreatedAt { get; set; }

        // Relations
        public Vendor Vendor { get; set; }
        public User Customer { get; set; }
        public ICollection<OrderItem> OrderItems { get; set; }
    }

}
