using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodRescue.DAL.Entities
{
    public class Order
    {
        public int Id { get; set; }
        public string CustomerId { get; set; }
        public string VendorId { get; set; }
        public List<OrderItem> Items { get; set; } = new List<OrderItem>();
        public decimal TotalPrice { get; set; }
        public decimal Discount { get; set; }
        public string Status { get; set; } = "Pending";
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public Guid UserId { get; set; }
        public User User { get; set; }
    }
}
