using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodRescue.DAL.Entities
{
    public class Donation
    {
        public Guid Id { get; set; }
        public Guid VendorId { get; set; }
        public int Quantity { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }

        // Relations
        public Vendor Vendor { get; set; }
    }

}
