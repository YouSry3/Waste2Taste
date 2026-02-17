using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodRescue.DAL.Entities
{
    // USERS (All Types - Admin, Vendor, Customer)
    public class User
    {
        public Guid Id { get; set; }

        public string Email { get; set; } = string.Empty;

        public string Password { get; set; } = string.Empty;

        public string Name { get; set; } = string.Empty;
        // admin, vendor, customer
        public string Role { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }

        public DateTime CreatedAt { get; set; }

        public ICollection<Review> Reviews { get; set; }
        public ICollection<Order> Orders { get; set; }
        public string? ProfileImage { get; set; }// URL or path to profile image

    }
}
