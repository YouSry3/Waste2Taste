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
        public string Type { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }

        public ICollection<Review> Reviews { get; set; }


    }
}
