using System;

namespace FoodRescue.DAL.Entities
{
    public class Report
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid VendorId { get; set; }
        public string Type { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }

        // Relations
        public User User { get; set; }
        public Vendor Vendor { get; set; }
    }
}
