using FoodRescue.DAL.Consts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodRescue.DAL.Entities
{
    public class VendorRequest
    {
        public Guid Id { get; set; }

        public Guid UserId { get; set; }
        public User User { get; set; }

        public string BusinessName { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }
        public VendorCategory Category { get; set; }
        public string? HealthCertificateUrl { get; set; }
        public string? BusinessLicenseUrl { get; set; } 

        public VendorRequestStatus Status { get; set; } = VendorRequestStatus.Pending;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ReviewedAt { get; set; }


    }

}
