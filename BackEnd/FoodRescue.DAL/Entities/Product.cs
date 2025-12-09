using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodRescue.DAL.Entities
{
    public class Product
    {
        public Guid Id { get; set; }
        public Guid VendorId { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public bool Expired { get; set; }
        public DateTime CreatedAt { get; set; }

        // Relations
        public Vendor Vendor { get; set; }
        public ICollection<OrderItem> OrderItems { get; set; }
    }
}
